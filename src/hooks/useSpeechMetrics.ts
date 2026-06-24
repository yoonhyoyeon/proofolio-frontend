import { useEffect, useState } from 'react'
import { getInterviewSocket } from '@/lib/interviewSocket'
import type { FeedbackItem } from '@/lib/feedback'

/**
 * Speech analysis metrics, supplied by the backend (not computed on the client).
 * Each field is `null` until the backend reports it.
 */
export type SpeechMetrics = {
  /** Speaking pace score 0–100 (ideal pace = high) */
  speechRate: number | null
  /** Intonation stability score 0–100 */
  intonation: number | null
  /** Loudness score 0–100 */
  volume: number | null
  /** Filler-word occurrences */
  fillerCount: number | null
  /** Distinct filler words detected (e.g. ["음", "어"]) */
  fillerTypes: string[]
  /** Delay before the candidate started answering, in seconds */
  answerDelaySec: number | null
}

const EMPTY: SpeechMetrics = {
  speechRate: null,
  intonation: null,
  volume: null,
  fillerCount: null,
  fillerTypes: [],
  answerDelaySec: null,
}

type SpeechEvent = {
  type?: string
  speechRate?: number
  intonation?: number
  volume?: number
  fillerCount?: number
  fillerTypes?: string[]
  answerDelaySec?: number
  answerDelayMs?: number
  // feedback shape
  severity?: 'warning' | 'info'
  title?: string
  detail?: string
  items?: FeedbackItem[]
}

const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null

/**
 * Subscribes to backend speech-analysis events and exposes the latest metrics
 * and speech feedback. The backend is expected to emit on the `event` channel:
 *
 *   { type: 'metrics.speech', speechRate, intonation, volume,
 *     fillerCount, fillerTypes, answerDelaySec }
 *   { type: 'feedback.speech', items: FeedbackItem[] }   // or a single
 *                                                        // { severity,title,detail }
 *
 * Until those arrive, metrics stay `null` and feedback is empty — the UI shows
 * placeholders rather than fabricated values.
 */
export function useSpeechMetrics() {
  const [metrics, setMetrics] = useState<SpeechMetrics>(EMPTY)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])

  useEffect(() => {
    const socket = getInterviewSocket()

    const onEvent = (event: SpeechEvent) => {
      if (event?.type === 'metrics.speech') {
        setMetrics((prev) => ({
          speechRate: num(event.speechRate) ?? prev.speechRate,
          intonation: num(event.intonation) ?? prev.intonation,
          volume: num(event.volume) ?? prev.volume,
          fillerCount: num(event.fillerCount) ?? prev.fillerCount,
          fillerTypes: Array.isArray(event.fillerTypes)
            ? event.fillerTypes
            : prev.fillerTypes,
          answerDelaySec:
            num(event.answerDelaySec) ??
            (num(event.answerDelayMs) !== null
              ? (event.answerDelayMs as number) / 1000
              : prev.answerDelaySec),
        }))
      } else if (event?.type === 'feedback.speech') {
        const items = normalizeFeedback(event)
        if (items.length) setFeedback(items)
      }
    }

    socket.on('event', onEvent)
    return () => {
      socket.off('event', onEvent)
    }
  }, [])

  return { metrics, feedback }
}

function normalizeFeedback(event: SpeechEvent): FeedbackItem[] {
  if (Array.isArray(event.items)) {
    return event.items.map((it, i) => ({ ...it, source: 'speech', id: it.id ?? `speech-${i}` }))
  }
  if (event.title) {
    return [
      {
        id: 'speech-0',
        severity: event.severity ?? 'info',
        title: event.title,
        detail: event.detail ?? '',
        source: 'speech',
      },
    ]
  }
  return []
}
