import type { LiveMetrics } from '@/components/domain/PoseMeshOverlay'

export type FeedbackSeverity = 'warning' | 'info'
export type FeedbackSource = 'posture' | 'speech'

export type FeedbackItem = {
  id: string
  severity: FeedbackSeverity
  title: string
  detail: string
  source?: FeedbackSource
}

/**
 * Immediate posture/vision feedback derived client-side from the live
 * MediaPipe metrics. Updates every render as the metrics change.
 */
export function postureFeedback(m: LiveMetrics): FeedbackItem[] {
  const items: FeedbackItem[] = []

  if (m.gaze < 55) {
    items.push({
      id: 'gaze',
      severity: 'warning',
      title: '시선이 자주 벗어나요',
      detail: '카메라(면접관)를 바라보며 시선을 안정적으로 유지해 보세요.',
      source: 'posture',
    })
  }
  if (m.posture < 60) {
    items.push({
      id: 'posture',
      severity: 'warning',
      title: '자세가 불안정해요',
      detail: '어깨를 수평으로 맞추고 몸을 화면 중앙에 두세요.',
      source: 'posture',
    })
  }
  if (m.headDownCount >= 3) {
    items.push({
      id: 'head',
      severity: 'warning',
      title: `고개 숙임이 ${m.headDownCount}회 감지됐어요`,
      detail: '고개를 들고 정면을 바라보면 더 자신감 있어 보여요.',
      source: 'posture',
    })
  }
  if (m.handRaiseCount >= 3) {
    items.push({
      id: 'hand',
      severity: 'info',
      title: `손이 어깨 위로 ${m.handRaiseCount}회 올라갔어요`,
      detail: '손은 가슴 아래에서 자연스럽게 사용하는 것이 안정적으로 보여요.',
      source: 'posture',
    })
  }

  if (items.length === 0) {
    items.push({
      id: 'posture-ok',
      severity: 'info',
      title: '자세가 안정적이에요',
      detail: '시선·자세를 잘 유지하고 있어요. 그대로 이어가세요.',
      source: 'posture',
    })
  }

  return items
}

/**
 * Immediate speech feedback derived client-side from the Web Audio metrics
 * (음량 레벨 0~60, 억양 변동 반음). Only fires while the user is actually
 * speaking (recent volume above a floor) to avoid nagging during silence.
 */
export function speechFeedbackFromAudio(a: {
  intonation: number | null
  volumeHistory: number[]
}): FeedbackItem[] {
  const items: FeedbackItem[] = []
  const recent = a.volumeHistory.slice(-12) // ~2s (volume level 0~100)
  // Judge loudness from the louder (speaking) samples, ignoring pauses
  const loud = recent.filter((v) => v >= 12)
  const speaking = loud.length >= 3
  if (!speaking) return items

  const avg = loud.reduce((s, v) => s + v, 0) / loud.length
  if (avg < 30) {
    items.push({
      id: 'vol-low',
      severity: 'warning',
      title: '목소리가 작아요',
      detail: '조금 더 또렷하고 크게 말해보세요.',
      source: 'speech',
    })
  } else if (avg > 70) {
    items.push({
      id: 'vol-high',
      severity: 'info',
      title: '목소리가 큰 편이에요',
      detail: '편안한 크기로 조절해보세요.',
      source: 'speech',
    })
  }

  // 단조로움(낮은 변동)은 피드백하지 않음. 3.0반음 이상이면 기복 큼.
  if (a.intonation !== null && a.intonation >= 3.0) {
    items.push({
      id: 'into-wide',
      severity: 'warning',
      title: '억양 기복이 커요',
      detail: '차분하고 일정한 톤을 유지해보세요.',
      source: 'speech',
    })
  }

  return items
}
