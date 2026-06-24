import { useEffect, useRef, useState } from 'react'

/**
 * Client-side audio analysis via the Web Audio API.
 *
 * Computes two metrics from the microphone in real time:
 * - `volume`: loudness score 0–100 (from RMS, perceptual dB mapping)
 * - `intonation`: intonation stability score 0–100 (from pitch variance —
 *   steadier pitch = higher). Pitch is estimated with autocorrelation.
 *
 * Both are `null` until enough audio is captured. Pass `enabled=false`
 * (e.g. mic muted) to release the mic and stop analysis.
 */
const HISTORY = 48 // ~8s of samples at the emit cadence (for the wave graph)

export function useAudioAnalysis(enabled: boolean) {
  const [volume, setVolume] = useState<number | null>(null)
  const [intonation, setIntonation] = useState<number | null>(null)
  // Rolling histories for the live oscillating graphs
  const [volumeHistory, setVolumeHistory] = useState<number[]>([])
  const [intonationHistory, setIntonationHistory] = useState<number[]>([])

  const rafRef = useRef(0)
  const ctxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  // Rolling window of recent voiced pitches (semitones) with timestamps
  const pitchWindowRef = useRef<{ t: number; semi: number }[]>([])
  const volEmaRef = useRef<number | null>(null)
  const lastPitchRef = useRef(0)
  const lastEmitRef = useRef(0)
  const lastIntoRef = useRef<number | null>(null)
  const lastSemiRef = useRef<number | null>(null) // for octave correction
  const intoEmaRef = useRef<number | null>(null) // smoothed intonation score

  useEffect(() => {
    if (!enabled) return // mic off → release handled by cleanup; values gated below

    let cancelled = false
    const buf = new Float32Array(2048)

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream

        const ctx = new AudioContext()
        ctxRef.current = ctx
        if (ctx.state === 'suspended') await ctx.resume()

        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 2048
        source.connect(analyser)

        const loop = () => {
          rafRef.current = requestAnimationFrame(loop)
          analyser.getFloatTimeDomainData(buf)
          const now = performance.now()

          // --- Volume (RMS → dB, clamped to [-60, 0]) ---
          let sumSq = 0
          for (let i = 0; i < buf.length; i++) sumSq += buf[i] * buf[i]
          const rms = Math.sqrt(sumSq / buf.length)
          const db = 20 * Math.log10(rms + 1e-7) // ~ -60(quiet) .. 0(loud)
          const dbClamped = Math.max(-60, Math.min(0, db))
          volEmaRef.current =
            volEmaRef.current === null
              ? dbClamped
              : volEmaRef.current + (dbClamped - volEmaRef.current) * 0.2

          // --- Pitch (autocorrelation) every ~80ms while voiced ---
          if (now - lastPitchRef.current >= 80) {
            lastPitchRef.current = now
            const freq = autoCorrelate(buf, ctx.sampleRate)
            if (freq > 70 && freq < 500) {
              // human voice range; convert to semitones (ref 110Hz)
              let semi = 12 * Math.log2(freq / 110)
              // Octave-correct against the last pitch so autocorrelation octave
              // errors don't inflate the variance (and pin the score at 0)
              const last = lastSemiRef.current
              if (last !== null) {
                while (semi - last > 7) semi -= 12
                while (last - semi > 7) semi += 12
              }
              lastSemiRef.current = semi
              pitchWindowRef.current.push({ t: now, semi })
            }
            // keep last 4 seconds (longer = smoother, sentence-level intonation)
            pitchWindowRef.current = pitchWindowRef.current.filter(
              (p) => now - p.t <= 4000,
            )
          }

          // --- Emit ~6 Hz ---
          if (now - lastEmitRef.current >= 160) {
            lastEmitRef.current = now

            // 음량: dBFS(-60~0) → 0~100 양수 레벨
            if (volEmaRef.current !== null) {
              const vol = Math.round(((volEmaRef.current + 60) / 60) * 100)
              setVolume(vol)
              setVolumeHistory((h) => [...h, vol].slice(-HISTORY))
            }

            // 억양: 피치 변동(반음), 소수점 2자리
            const semis = pitchWindowRef.current.map((p) => p.semi)
            if (semis.length >= 3) {
              // Robust spread: drop octave-ish outliers around the median
              const med = median(semis)
              const inliers = semis.filter((s) => Math.abs(s - med) <= 6)
              const std = stdDev(inliers.length >= 3 ? inliers : semis)
              // EMA so the value moves smoothly instead of sticking
              intoEmaRef.current =
                intoEmaRef.current === null
                  ? std
                  : intoEmaRef.current + (std - intoEmaRef.current) * 0.25
              lastIntoRef.current = Math.round(intoEmaRef.current * 100) / 100
              setIntonation(lastIntoRef.current)
            }
            // Keep the intonation graph scrolling once we have a value
            if (lastIntoRef.current !== null) {
              const into = lastIntoRef.current
              setIntonationHistory((h) => [...h, into].slice(-HISTORY))
            }
          }
        }
        rafRef.current = requestAnimationFrame(loop)
      } catch (err) {
        console.error('[audio-analysis] failed', err)
      }
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
      pitchWindowRef.current = []
      volEmaRef.current = null
      intoEmaRef.current = null
      lastSemiRef.current = null
      lastIntoRef.current = null
    }
  }, [enabled])

  // When disabled, report null/empty without storing it in state
  return enabled
    ? { volume, intonation, volumeHistory, intonationHistory }
    : { volume: null, intonation: null, volumeHistory: [], intonationHistory: [] }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance =
    values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / values.length
  return Math.sqrt(variance)
}

/**
 * Estimate fundamental frequency (Hz) via autocorrelation, searching only the
 * voice band (70–500 Hz). Uses a level-independent **clarity** check (peak /
 * energy) so quiet mics still register, instead of an absolute loudness gate.
 * Returns -1 when essentially silent or not periodic enough (unvoiced).
 */
function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length

  let rms = 0
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i]
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.001) return -1 // near-total silence

  // Only correlate lags inside the voice band (bounds cost + restricts result)
  const minLag = Math.floor(sampleRate / 500) // 500 Hz
  const maxLag = Math.min(SIZE - 1, Math.ceil(sampleRate / 70)) // 70 Hz

  let energy = 0
  for (let j = 0; j < SIZE; j++) energy += buf[j] * buf[j]
  if (energy <= 0) return -1

  let maxval = -1
  let maxpos = -1
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0
    for (let j = 0; j < SIZE - lag; j++) sum += buf[j] * buf[j + lag]
    if (sum > maxval) {
      maxval = sum
      maxpos = lag
    }
  }
  if (maxpos < 1) return -1

  // Clarity: how periodic the signal is, independent of absolute volume
  if (maxval / energy < 0.4) return -1 // unvoiced / noise

  // Parabolic interpolation around the peak for sub-sample accuracy
  let period = maxpos
  let cPrev = 0
  let cNext = 0
  for (let j = 0; j < SIZE - (maxpos - 1); j++) cPrev += buf[j] * buf[j + maxpos - 1]
  for (let j = 0; j < SIZE - (maxpos + 1); j++) cNext += buf[j] * buf[j + maxpos + 1]
  const a = (cPrev + cNext - 2 * maxval) / 2
  const b = (cNext - cPrev) / 2
  if (a) period -= b / (2 * a)

  return sampleRate / period
}
