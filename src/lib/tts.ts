// Google Cloud Text-to-Speech (REST) client.
//
// Auth: a browser API key from `VITE_GC_TTS_API_KEY`. Restrict the key to the
// Text-to-Speech API + your HTTP referrers in the Google Cloud console, since
// it is exposed to the client. When no key is set (or a request fails), callers
// fall back to the browser's built-in SpeechSynthesis.

const API_KEY = import.meta.env.VITE_GC_TTS_API_KEY
const ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize'

export type TtsVoice = {
  languageCode: string
  name?: string
  ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
}

export const DEFAULT_VOICE: TtsVoice = {
  languageCode: 'ko-KR',
  name: 'ko-KR-Neural2-C',
  ssmlGender: 'MALE',
}

/** Per-interviewer voices so each panelist sounds distinct. */
export const INTERVIEWER_VOICES: Record<string, TtsVoice> = {
  'sr-eng': { languageCode: 'ko-KR', name: 'ko-KR-Neural2-C', ssmlGender: 'MALE' },
  hr: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A', ssmlGender: 'FEMALE' },
  cto: { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-D', ssmlGender: 'MALE' },
  // socket interviewerKey aliases
  kind: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-C', ssmlGender: 'MALE' },
  strict: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A', ssmlGender: 'FEMALE' },
  normal: { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-D', ssmlGender: 'MALE' },
}

export function voiceFor(interviewerKey?: string): TtsVoice {
  return (interviewerKey && INTERVIEWER_VOICES[interviewerKey]) || DEFAULT_VOICE
}

export const isGoogleTtsConfigured = () => !!API_KEY

// Cache synthesized audio by (voice|text) to avoid re-billing identical lines
const cache = new Map<string, string>()

/**
 * Synthesize speech via Google Cloud TTS. Returns base64-encoded MP3, or `null`
 * if no API key is configured. Throws on a failed request.
 */
export async function synthesizeSpeech(
  text: string,
  voice: TtsVoice = DEFAULT_VOICE,
): Promise<string | null> {
  if (!API_KEY) return null

  const cacheKey = `${voice.name ?? voice.languageCode}|${text}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice,
      // Lower pitch + slightly measured pace for a calm, professional tone
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.94, pitch: -4.0 },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Google TTS ${res.status}: ${detail.slice(0, 200)}`)
  }

  const data = (await res.json()) as { audioContent?: string }
  if (!data.audioContent) throw new Error('Google TTS: empty audioContent')
  cache.set(cacheKey, data.audioContent)
  return data.audioContent
}

/** Play a base64 MP3 and resolve when playback ends (or errors). */
export function playBase64Mp3(
  audioContent: string,
  audioEl: HTMLAudioElement,
): Promise<void> {
  return new Promise((resolve, reject) => {
    audioEl.src = `data:audio/mp3;base64,${audioContent}`
    audioEl.onended = () => resolve()
    audioEl.onerror = () => reject(new Error('audio playback failed'))
    audioEl.play().catch(reject)
  })
}

/** Browser SpeechSynthesis fallback (no API key / request failure). */
export function speakWithWebSpeech(text: string, lang = 'ko-KR'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve()
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.onend = () => resolve()
    utter.onerror = () => resolve()
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  })
}
