import { useEffect, useRef, useState } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
  DrawingUtils,
} from '@mediapipe/tasks-vision'
import { cn } from '@/lib/cn'

const WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const FACE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const POSE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

// Throttle heavy inference; draw runs every frame from the last result
const DETECT_INTERVAL = 60 // ms (~16 fps)
const EMIT_INTERVAL = 400 // ms — how often scores are pushed up

type Status = 'loading' | 'ready' | 'error'

export type OverlayLayers = {
  /** Face tessellation mesh */
  mesh: boolean
  /** Body pose skeleton */
  skeleton: boolean
}

/** Simple vision-derived interview metrics, all 0–100. */
export type LiveMetrics = {
  /** Looking straight at the camera (head centered, not turned/down) */
  gaze: number
  /** Shoulders level + head centered over the body */
  posture: number
  /** Low frame-to-frame movement (steady, not fidgeting) */
  stability: number
  /** Purposeful hand gestures vs. distracting movements (face-touching, fidgeting) */
  gesture: number
  /** Cumulative count of head-down events this session */
  headDownCount: number
  /** Cumulative count of abnormal hand raises (wrist above shoulders) this session */
  handRaiseCount: number
  /** Weighted blend of the score metrics above */
  confidence: number
  faceFound: boolean
  poseFound: boolean
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const ema = (prev: number, next: number, a = 0.15) => prev + (next - prev) * a

/** Facing-forward score from face landmarks. */
function computeGaze(f: NormalizedLandmark[]): number {
  const nose = f[1]
  const leftEye = f[33]
  const rightEye = f[263]
  const forehead = f[10]
  const chin = f[152]
  if (!nose || !leftEye || !rightEye || !forehead || !chin) return 50

  const eyeMidX = (leftEye.x + rightEye.x) / 2
  const eyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y) || 1e-3
  const yaw = (nose.x - eyeMidX) / eyeDist // ~0 when facing forward

  const faceH = chin.y - forehead.y || 1e-3
  const pitch = (nose.y - forehead.y) / faceH - 0.55 // ~0 when head upright

  return clamp(100 - Math.abs(yaw) * 220 - Math.abs(pitch) * 150)
}

/** Posture score from pose landmarks (shoulder levelness + head centering). */
function computePosture(p: NormalizedLandmark[]): number {
  const nose = p[0]
  const lShoulder = p[11]
  const rShoulder = p[12]
  if (!nose || !lShoulder || !rShoulder) return 50

  const shoulderW = Math.hypot(rShoulder.x - lShoulder.x, rShoulder.y - lShoulder.y) || 1e-3
  const tilt = Math.abs(lShoulder.y - rShoulder.y) / shoulderW
  const midX = (lShoulder.x + rShoulder.x) / 2
  const lean = Math.abs(nose.x - midX) / shoulderW

  return clamp(100 - tilt * 180 - lean * 120)
}

/** Head pitch from face landmarks (>0 = looking down). */
function headPitch(f: NormalizedLandmark[]): number {
  const nose = f[1]
  const forehead = f[10]
  const chin = f[152]
  if (!nose || !forehead || !chin) return 0
  const faceH = chin.y - forehead.y || 1e-3
  return (nose.y - forehead.y) / faceH - 0.55
}

const isVisible = (lm?: NormalizedLandmark): lm is NormalizedLandmark =>
  !!lm &&
  (lm.visibility === undefined || lm.visibility > 0.5) &&
  lm.x > 0 && lm.x < 1 && lm.y > 0 && lm.y < 1

/**
 * Hand-gesture appropriateness from pose wrists.
 *
 * Rewards purposeful gestures in the natural "gesture zone" in front of the
 * torso; penalizes distracting movements — touching the face/hair and frantic
 * fidgeting (high `handMove`). `handMove` is the EMA of wrist speed in
 * shoulder-width units, computed by the caller across frames.
 */
function computeGesture(
  p: NormalizedLandmark[],
  handMove: number,
): { score: number; handsVisible: boolean } {
  const nose = p[0]
  const lShoulder = p[11]
  const rShoulder = p[12]
  if (!nose || !lShoulder || !rShoulder) return { score: 60, handsVisible: false }

  const shoulderW = Math.hypot(rShoulder.x - lShoulder.x, rShoulder.y - lShoulder.y) || 1e-3
  const shoulderY = (lShoulder.y + rShoulder.y) / 2
  const midX = (lShoulder.x + rShoulder.x) / 2

  const wrists = [p[15], p[16]].filter(isVisible)
  // Hands resting / out of frame → neutral, don't penalize
  if (wrists.length === 0) return { score: 62, handsVisible: false }

  // Distracting: a wrist near the head (face / hair touching)
  const faceTouch = wrists.some(
    (w) => Math.hypot(w.x - nose.x, w.y - nose.y) < shoulderW * 0.75,
  )
  // Purposeful: hands in front of the torso, below shoulders, not too low/wide
  const inZone = wrists.some(
    (w) =>
      w.y > shoulderY - shoulderW * 0.2 &&
      w.y < shoulderY + shoulderW * 1.8 &&
      Math.abs(w.x - midX) < shoulderW * 1.3,
  )

  let score = 78
  if (faceTouch) score -= 45
  if (!inZone) score -= 12
  if (handMove > 0.12) score -= 35 // frantic / fidgety
  else if (handMove > 0.07) score -= 15 // a bit excessive
  else if (handMove >= 0.015) score += 6 // healthy, expressive gesturing

  return { score: clamp(score), handsVisible: true }
}

/**
 * Draws a live MediaPipe face mesh and/or pose skeleton on a canvas overlaid
 * on top of an existing <video> element, and reports simple interview metrics
 * derived from the landmarks. The canvas uses object-cover so its cropping
 * matches a video rendered the same way.
 */
export function PoseMeshOverlay({
  videoRef,
  active,
  layers,
  onStatusChange,
  onMetrics,
  className,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  active: boolean
  layers: OverlayLayers
  onStatusChange?: (status: Status) => void
  onMetrics?: (metrics: LiveMetrics) => void
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const faceRef = useRef<FaceLandmarker | null>(null)
  const poseRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number>(0)
  const lastTsRef = useRef(-1)
  const lastDetectRef = useRef(0)
  const lastEmitRef = useRef(0)
  const [status, setStatus] = useState<Status>('loading')

  // Latest detection results, reused for drawing between throttled detections
  const faceResultRef = useRef<NormalizedLandmark[] | null>(null)
  const poseResultRef = useRef<NormalizedLandmark[] | null>(null)
  // EMA-smoothed scores + movement tracking
  const scoreRef = useRef({ gaze: 65, posture: 65, stability: 70, gesture: 70 })
  const prevNoseRef = useRef<{ x: number; y: number } | null>(null)
  const moveRef = useRef(0)
  // Wrist tracking for hand-gesture analysis
  const prevWristRef = useRef<{ lx: number; ly: number; rx: number; ry: number } | null>(null)
  const handMoveRef = useRef(0)
  // Cumulative event counters + edge-detection state (with hysteresis)
  const countRef = useRef({ headDown: 0, handRaise: 0 })
  const headDownStateRef = useRef(false)
  const handRaiseStateRef = useRef(false)
  const lastRaiseAtRef = useRef(0) // debounce between hand-raise counts

  // Keep latest props available to the rAF loop without re-creating it
  const layersRef = useRef(layers)
  const activeRef = useRef(active)
  const onMetricsRef = useRef(onMetrics)
  useEffect(() => {
    layersRef.current = layers
  }, [layers])
  useEffect(() => {
    activeRef.current = active
  }, [active])
  useEffect(() => {
    onMetricsRef.current = onMetrics
  }, [onMetrics])

  // Notify parent of status changes outside of render
  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  // Load the MediaPipe models once
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL)
        const [face, pose] = await Promise.all([
          FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: 'GPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
          }),
          PoseLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate: 'GPU' },
            runningMode: 'VIDEO',
            numPoses: 1,
          }),
        ])
        if (cancelled) {
          face.close()
          pose.close()
          return
        }
        faceRef.current = face
        poseRef.current = pose
        setStatus('ready')
      } catch (err) {
        console.error('[PoseMeshOverlay] model load failed', err)
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
      faceRef.current?.close()
      poseRef.current?.close()
      faceRef.current = null
      poseRef.current = null
    }
  }, [])

  // Detection + draw loop
  useEffect(() => {
    if (status !== 'ready') return

    function detect(video: HTMLVideoElement, now: number) {
      const face = faceRef.current
      const pose = poseRef.current
      if (!face || !pose) return

      // detectForVideo requires a strictly increasing timestamp (ms)
      let ts = performance.now()
      if (ts <= lastTsRef.current) ts = lastTsRef.current + 1
      lastTsRef.current = ts

      const faceLm = face.detectForVideo(video, ts).faceLandmarks[0] ?? null
      const poseLm = pose.detectForVideo(video, ts + 0.5).landmarks[0] ?? null
      faceResultRef.current = faceLm
      poseResultRef.current = poseLm

      // --- Simple evaluation -------------------------------------------------
      const s = scoreRef.current
      s.gaze = ema(s.gaze, faceLm ? computeGaze(faceLm) : 35)
      s.posture = ema(s.posture, poseLm ? computePosture(poseLm) : 45)

      // Stability from frame-to-frame nose movement
      const noseTip = faceLm?.[1] ?? poseLm?.[0] ?? null
      if (noseTip) {
        const prev = prevNoseRef.current
        if (prev) {
          const d = Math.hypot(noseTip.x - prev.x, noseTip.y - prev.y)
          moveRef.current = ema(moveRef.current, d, 0.3)
        }
        prevNoseRef.current = { x: noseTip.x, y: noseTip.y }
      }
      s.stability = ema(s.stability, clamp(100 - moveRef.current * 3500))

      // Hand-gesture appropriateness (wrist speed → handMove, then heuristic)
      if (poseLm) {
        const ls = poseLm[11]
        const rs = poseLm[12]
        const lw = poseLm[15]
        const rw = poseLm[16]
        const shoulderW =
          ls && rs ? Math.hypot(rs.x - ls.x, rs.y - ls.y) || 1e-3 : 1e-3
        const prev = prevWristRef.current
        if (prev && lw && rw) {
          const dl = Math.hypot(lw.x - prev.lx, lw.y - prev.ly)
          const dr = Math.hypot(rw.x - prev.rx, rw.y - prev.ry)
          handMoveRef.current = ema(handMoveRef.current, (dl + dr) / 2 / shoulderW, 0.3)
        }
        if (lw && rw) {
          prevWristRef.current = { lx: lw.x, ly: lw.y, rx: rw.x, ry: rw.y }
        }
        s.gesture = ema(s.gesture, computeGesture(poseLm, handMoveRef.current).score)
      } else {
        s.gesture = ema(s.gesture, 60)
      }

      // Head-down events (edge-triggered, with hysteresis)
      if (faceLm) {
        const pitch = headPitch(faceLm)
        if (!headDownStateRef.current && pitch > 0.16) {
          headDownStateRef.current = true
          countRef.current.headDown += 1
        } else if (headDownStateRef.current && pitch < 0.08) {
          headDownStateRef.current = false
        }
      }

      // Abnormal hand raises — counted once per *large* gesture (hand goes
      // clearly above the shoulder, then back down). Hysteresis + debounce so
      // small finger/hand jitter while held up doesn't keep counting.
      if (poseLm) {
        const ls = poseLm[11]
        const rs = poseLm[12]
        const wrists = [poseLm[15], poseLm[16]].filter(isVisible)
        if (ls && rs && wrists.length > 0) {
          const shoulderY = (ls.y + rs.y) / 2
          const sw = Math.hypot(rs.x - ls.x, rs.y - ls.y) || 1e-3
          const highestWristY = Math.min(...wrists.map((w) => w.y)) // smaller y = higher
          const enterY = shoulderY - sw * 0.4 // must rise clearly above the shoulder
          const exitY = shoulderY - sw * 0.05 // must come back down to reset

          if (
            !handRaiseStateRef.current &&
            highestWristY < enterY &&
            now - lastRaiseAtRef.current >= 700
          ) {
            handRaiseStateRef.current = true
            lastRaiseAtRef.current = now
            countRef.current.handRaise += 1
          } else if (handRaiseStateRef.current && highestWristY > exitY) {
            handRaiseStateRef.current = false
          }
        }
        // wrists not visible → hold current state (avoid recount on flicker)
      }

      if (now - lastEmitRef.current >= EMIT_INTERVAL) {
        lastEmitRef.current = now
        const confidence =
          s.gaze * 0.35 + s.posture * 0.3 + s.stability * 0.15 + s.gesture * 0.2
        onMetricsRef.current?.({
          gaze: s.gaze,
          posture: s.posture,
          stability: s.stability,
          gesture: s.gesture,
          headDownCount: countRef.current.headDown,
          handRaiseCount: countRef.current.handRaise,
          confidence,
          faceFound: !!faceLm,
          poseFound: !!poseLm,
        })
      }
    }

    function loop() {
      rafRef.current = requestAnimationFrame(loop)

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return
      if (video.readyState < 2 || video.videoWidth === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!activeRef.current) return

      const now = performance.now()
      if (now - lastDetectRef.current >= DETECT_INTERVAL) {
        lastDetectRef.current = now
        detect(video, now)
      }

      const draw = new DrawingUtils(ctx)
      const { mesh, skeleton } = layersRef.current
      const faceLm = faceResultRef.current
      const poseLm = poseResultRef.current

      if (mesh && faceLm) {
        draw.drawConnectors(faceLm, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
          color: 'rgba(99,102,241,0.35)',
          lineWidth: 0.6,
        })
        draw.drawConnectors(faceLm, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
          color: 'rgba(129,140,248,0.9)',
          lineWidth: 1.5,
        })
        draw.drawConnectors(faceLm, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {
          color: '#34d399',
          lineWidth: 1.2,
        })
        draw.drawConnectors(faceLm, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, {
          color: '#34d399',
          lineWidth: 1.2,
        })
        draw.drawConnectors(faceLm, FaceLandmarker.FACE_LANDMARKS_LIPS, {
          color: '#f472b6',
          lineWidth: 1.2,
        })
      }

      if (skeleton && poseLm) {
        draw.drawConnectors(poseLm, PoseLandmarker.POSE_CONNECTIONS, {
          color: 'rgba(96,165,250,0.9)',
          lineWidth: 3,
        })
        draw.drawLandmarks(poseLm, {
          color: '#fbbf24',
          fillColor: '#60a5fa',
          lineWidth: 1,
          radius: 3,
        })
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full object-cover',
        className,
      )}
    />
  )
}
