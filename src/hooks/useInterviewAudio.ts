import { useState, useRef, useEffect, useCallback } from 'react'
import { getInterviewSocket } from '@/lib/interviewSocket'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export type ClientSpeechMetrics = {
  /** Syllables per minute (한국어 음절/분) */
  speechRate: number | null
  /** Total filler word occurrences */
  fillerCount: number | null
  /** Distinct filler words found */
  fillerTypes: string[]
  /** Seconds between last interviewer question and user's first word */
  answerDelaySec: number | null
}

// ── Filler word detection ────────────────────────────────────────────────────
const FILLERS = [
  // 단음절 간투사
  '어', '음', '아', '그', '뭐', '저', '응', '네', '예', '흠', '오', '에',
  // 접속·전환어 (습관적 사용)
  '그래서', '그리고', '근데', '그런데', '그러니까', '그러면', '그래도',
  '그렇지만', '하지만', '근데요', '그러면서', '그러다가',
  // 완충·채움어
  '사실', '이제', '일단', '뭔가', '있잖아', '있잖아요',
  '그냥', '약간', '좀', '조금', '어떻게보면', '어떻게 보면',
  '솔직히', '솔직히말해서', '솔직히 말해서',
  '기본적으로', '일반적으로', '보통', '사실상',
  // 시간 벌기
  '음그', '아그', '저기', '저기요', '잠깐', '잠시',
  '어떻게', '어떤', '무슨', '뭐랄까', '뭐라고해야하나', '뭐라 해야 하나',
  // 확인·동조
  '맞죠', '맞아요', '그렇죠', '그렇지', '아무튼', '아무래도',
  '어쨌든', '어쨌거나', '하여튼', '어쩄든',
]

function detectFillers(text: string): { count: number; types: string[] } {
  const found = new Set<string>()
  let count = 0
  for (const word of FILLERS) {
    // Match as a whole space-delimited token
    const re = new RegExp(`(^|[\\s,。.?!])(${word})(?=[\\s,。.?!]|$)`, 'g')
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      found.add(word)
      count++
      // Prevent infinite loop on zero-length match
      if (m[0].length === 0) re.lastIndex++
    }
  }
  return { count, types: Array.from(found) }
}

function countKoreanSyllables(text: string): number {
  return (text.match(/[가-힣]/g) ?? []).length
}

// ── SpeechRecognition setup ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognitionAPI: any =
  typeof window !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    : null

const EMPTY_METRICS: ClientSpeechMetrics = {
  speechRate: null,
  fillerCount: null,
  fillerTypes: [],
  answerDelaySec: null,
}

export function useInterviewAudio() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [micOn, setMicOn] = useState(true)
  const [transcriptText, setTranscriptText] = useState('')
  const [speechMetrics, setSpeechMetrics] = useState<ClientSpeechMetrics>(EMPTY_METRICS)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const micOnRef = useRef(true)
  const finalSeqRef = useRef(0)   // increments per final utterance
  const deltaSeqRef = useRef(0)   // resets to 0 after each final

  // ── Speech-rate tracking ─────────────────────────────────────────────────
  const totalSyllablesRef = useRef(0)
  const totalSpeakingMsRef = useRef(0)
  const utteranceStartRef = useRef<number | null>(null)  // when interim first appeared

  // ── Filler tracking ──────────────────────────────────────────────────────
  const fillerCountRef = useRef(0)
  const fillerTypesRef = useRef(new Set<string>())

  // ── Answer-delay tracking ────────────────────────────────────────────────
  const questionAskedAtRef = useRef<number | null>(null)  // timestamp of last panel.message
  const firstSpeechAtRef = useRef<number | null>(null)    // timestamp of first interim after question
  const answerDelayRef = useRef<number | null>(null)
  const answerDelayAccRef = useRef<number[]>([])

  const computeAndSetMetrics = useCallback(() => {
    const durationSec = totalSpeakingMsRef.current / 1000
    const rate = durationSec > 1
      ? Math.round((totalSyllablesRef.current / durationSec) * 60)
      : null

    setSpeechMetrics({
      speechRate: rate,
      fillerCount: fillerCountRef.current > 0 ? fillerCountRef.current : null,
      fillerTypes: Array.from(fillerTypesRef.current),
      answerDelaySec: answerDelayRef.current,
    })
  }, [])

  const startRecognition = useCallback(() => {
    if (!SpeechRecognitionAPI || recognitionRef.current) return

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'ko-KR'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (e: { resultIndex: number; results: SpeechRecognitionResultList }) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        const text = result[0].transcript

        if (result.isFinal) {
          // ── Speaking duration ──────────────────────────────────────────
          if (utteranceStartRef.current !== null) {
            totalSpeakingMsRef.current += Date.now() - utteranceStartRef.current
            utteranceStartRef.current = null
          }

          // ── Syllables (speech rate) ────────────────────────────────────
          totalSyllablesRef.current += countKoreanSyllables(text)

          // ── Filler words ───────────────────────────────────────────────
          const { count, types } = detectFillers(text)
          fillerCountRef.current += count
          types.forEach(t => fillerTypesRef.current.add(t))

          computeAndSetMetrics()

          // Send final transcript to server, then clear delta buffer
          try {
            getInterviewSocket().emit('event', {
              type: 'transcript.final',
              transcript: text,
              sequence: finalSeqRef.current++,
            })
          } catch { /* socket not ready */ }
          deltaSeqRef.current = 0  // reset delta buffer for next utterance

          setTranscriptText(text)
        } else {
          // ── First interim of this utterance ───────────────────────────
          if (utteranceStartRef.current === null) {
            utteranceStartRef.current = Date.now()

            // Answer delay: first speech after a panel.message
            if (questionAskedAtRef.current !== null && firstSpeechAtRef.current === null) {
              firstSpeechAtRef.current = Date.now()
              const delay = (firstSpeechAtRef.current - questionAskedAtRef.current) / 1000
              answerDelayRef.current = delay
              answerDelayAccRef.current.push(delay)
              computeAndSetMetrics()
            }
          }

          // Send incremental delta (sequence resets to 0 after each final)
          try {
            getInterviewSocket().emit('event', {
              type: 'transcript.delta',
              transcript: text,
              sequence: deltaSeqRef.current++,
            })
          } catch { /* socket not ready */ }

          setTranscriptText(text)
        }
      }
    }

    recognition.onerror = () => {}
    recognition.onend = () => {
      if (micOnRef.current) recognition.start()
    }

    recognition.start()
    recognitionRef.current = recognition
  }, [computeAndSetMetrics])

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.onend = null
    recognitionRef.current.stop()
    recognitionRef.current = null
    setTranscriptText('')
  }, [])

  const toggleMic = useCallback(() => {
    const next = !micOnRef.current
    micOnRef.current = next
    setMicOn(next)
    if (next) {
      startRecognition()
    } else {
      stopRecognition()
    }
  }, [startRecognition, stopRecognition])

  // ── Socket setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    let socket: ReturnType<typeof getInterviewSocket>
    try {
      socket = getInterviewSocket()
    } catch {
      return
    }

    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')
    const onConnectError = () => setStatus('error')

    // Track when interviewer asks a question → resets answer-delay window
    const onEvent = (ev: { type: string }) => {
      if (ev.type === 'panel.message') {
        questionAskedAtRef.current = Date.now()
        firstSpeechAtRef.current = null
      }
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('event', onEvent)

    if (socket.connected) setStatus('connected')

    startRecognition()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('event', onEvent)
      stopRecognition()
    }
  }, [startRecognition, stopRecognition])

  // Returns accumulated data for POST /speech-metrics on session end
  const getSpeechMetricsPayload = useCallback(() => {
    const durationSec = totalSpeakingMsRef.current / 1000
    const avgCps = durationSec > 0
      ? Math.round((totalSyllablesRef.current / durationSec) * 10) / 10
      : 0
    const delays = answerDelayAccRef.current
    const avgDelay = delays.length > 0
      ? Math.round((delays.reduce((a, b) => a + b, 0) / delays.length) * 10) / 10
      : 0
    return {
      avgResponseDelaySec: avgDelay,
      avgSpeakingRateCps: avgCps,
      turnCount: finalSeqRef.current,
    }
  }, [])

  return { status, micOn, toggleMic, transcriptText, speechMetrics, getSpeechMetricsPayload }
}
