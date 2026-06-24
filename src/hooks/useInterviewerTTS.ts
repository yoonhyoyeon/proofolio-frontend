import { useCallback, useEffect, useRef, useState } from 'react'
import { getInterviewSocket } from '@/lib/interviewSocket'
import {
  isGoogleTtsConfigured,
  speakWithWebSpeech,
  synthesizeSpeech,
  voiceFor,
} from '@/lib/tts'

type PanelEvent = {
  type?: string
  message?: string
  text?: string
  interviewerKey?: string
}

type QueueItem = { text: string; interviewerKey?: string }

/**
 * Speaks interviewer questions out loud via Google Cloud TTS.
 *
 * Listens to the socket `event` channel for `panel.message` / `panel.interrupt`
 * and plays the `message` text. Messages are queued so they never overlap; a
 * `panel.interrupt` clears the queue and barges in immediately.
 */
export function useInterviewerTTS(enabled = true) {
  const [speaking, setSpeaking] = useState(false)
  const [activeInterviewerKey, setActiveInterviewerKey] = useState<string | null>(null)
  const [lastMessage, setLastMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const queueRef = useRef<QueueItem[]>([])
  const pumpingRef = useRef(false)
  // Bumped to invalidate the in-flight clip (mute / interrupt / unmount)
  const genRef = useRef(0)
  // Resolves the currently-awaited clip so the pump loop can unwind early
  const abortRef = useRef<(() => void) | null>(null)

  const enabledRef = useRef(enabled)
  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    return audioRef.current
  }, [])

  // External side effects only (no setState) so it's safe to call from effects
  const cutPlayback = useCallback(() => {
    genRef.current += 1
    queueRef.current = []
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    window.speechSynthesis?.cancel()
    abortRef.current?.()
    abortRef.current = null
  }, [])

  // Drain the queue one clip at a time
  const pump = useCallback(async () => {
    if (pumpingRef.current) return
    pumpingRef.current = true

    while (queueRef.current.length > 0) {
      const myGen = genRef.current
      const item = queueRef.current.shift()
      if (!item) break
      setSpeaking(true)
      setActiveInterviewerKey(item.interviewerKey ?? null)

      let audioContent: string | null = null
      try {
        audioContent = await synthesizeSpeech(item.text, voiceFor(item.interviewerKey))
        setError(null)
      } catch (err) {
        console.error('[interviewer-tts] synthesis failed', err)
        setError(err instanceof Error ? err.message : 'TTS 합성 실패')
      }
      if (genRef.current !== myGen) continue // cut off during synthesis

      await new Promise<void>((resolve) => {
        abortRef.current = resolve
        if (audioContent) {
          const audio = getAudio()
          audio.src = `data:audio/mp3;base64,${audioContent}`
          audio.onended = () => resolve()
          audio.onerror = () => resolve()
          audio.play().catch(() => resolve())
        } else {
          // No API key (or synthesis failed) → browser speech fallback
          void speakWithWebSpeech(item.text).then(() => resolve())
        }
      })
      abortRef.current = null
    }

    pumpingRef.current = false
    setSpeaking(false)
    setActiveInterviewerKey(null)
  }, [getAudio])

  const enqueue = useCallback(
    (text: string, interviewerKey: string | undefined, interrupt: boolean) => {
      if (interrupt) cutPlayback() // barge in: drop queue + stop current clip
      queueRef.current.push({ text, interviewerKey })
      void pump()
    },
    [cutPlayback, pump],
  )

  // Imperatively speak a line (used for local testing / demos)
  const speak = useCallback(
    (text: string, interviewerKey?: string, interrupt = false) => {
      const trimmed = text.trim()
      if (!trimmed) return
      setLastMessage(trimmed)
      enqueue(trimmed, interviewerKey, interrupt)
    },
    [enqueue],
  )

  // Subscribe to interviewer panel messages
  useEffect(() => {
    const socket = getInterviewSocket()
    const handler = (event: PanelEvent) => {
      if (!enabledRef.current) return
      if (event?.type !== 'panel.message' && event?.type !== 'panel.interrupt') return
      const text = (event.message ?? event.text ?? '').trim()
      if (!text) return
      setLastMessage(text)
      enqueue(text, event.interviewerKey, event.type === 'panel.interrupt')
    }

    socket.on('event', handler)
    return () => {
      socket.off('event', handler)
      cutPlayback()
    }
  }, [enqueue, cutPlayback])

  // Stop immediately when the user mutes the interviewer (no setState here)
  useEffect(() => {
    if (!enabled) cutPlayback()
  }, [enabled, cutPlayback])

  return {
    speaking,
    activeInterviewerKey,
    lastMessage,
    error,
    ttsConfigured: isGoogleTtsConfigured(),
    speak,
    stop: cutPlayback,
  }
}
