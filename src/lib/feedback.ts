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
