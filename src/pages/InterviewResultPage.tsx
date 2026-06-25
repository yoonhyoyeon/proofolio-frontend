import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { ScoreRadarChart, type RadarItem } from '@/components/domain/ScoreRadarChart'
import { QuestionReviewItem } from '@/components/domain/QuestionReviewItem'
import { getInterviewReport, GITHUB_TOKEN_KEY, type InterviewReport } from '@/lib/api'
import { cn } from '@/lib/cn'

const CATEGORY_LABELS: Record<string, string> = {
  TECHNICAL_KNOWLEDGE: '기술지식',
  PROBLEM_SOLVING: '문제해결',
  COLLABORATION: '협업',
  CREATIVITY: '창의력',
}

const ACCENT_BY_KEY: Record<string, string> = {
  kind: 'from-indigo-500 to-blue-500',
  strict: 'from-pink-500 to-rose-500',
  normal: 'from-amber-500 to-orange-500',
}

function formatDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '.')
}

function formatDuration(start: string, end: string | null) {
  if (!end) return '-'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return `${Math.floor(ms / 60000)}분 ${Math.floor((ms % 60000) / 1000)}초`
}

function ScoreBar({ value, max = 100 }: { value: number | null; max?: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[var(--color-brand)] transition-all"
        style={{ width: value !== null ? `${(value / max) * 100}%` : '0%' }}
      />
    </div>
  )
}

export function InterviewResultPage() {
  const { id } = useParams<{ id: string }>()
  const [report, setReport] = useState<InterviewReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem(GITHUB_TOKEN_KEY) ?? ''
    getInterviewReport(id, token)
      .then(setReport)
      .catch(() => setError('리포트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-[var(--color-fg-muted)]">
        <Loader2 className="h-5 w-5 animate-spin" />
        리포트 불러오는 중...
      </div>
    )
  }

  if (error || !report) {
    return <p className="py-24 text-center text-sm text-rose-500">{error || '리포트 없음'}</p>
  }

  const { session, scores, interviewerFeedbacks, questions, attitude, speechMetrics } = report

  const radarData: RadarItem[] = scores.byCategory.map((c) => ({
    axis: CATEGORY_LABELS[c.category] ?? c.category,
    value: c.average ?? 0,
  }))

  return (
    <>
      <Link
        to="/reports"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        리포트 목록으로
      </Link>

      <PageHeader
        title={`면접 #${session.sessionNo}`}
        description={
          <span className="flex flex-wrap items-center gap-2 text-xs">
            <Badge tone={session.status === 'ENDED' ? 'outline' : 'brand'}>
              {session.status === 'ENDED' ? '종료' : '진행 중'}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[var(--color-fg-muted)]">
              <Calendar className="h-3 w-3" />
              {formatDate(session.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--color-fg-muted)]">
              <Clock className="h-3 w-3" />
              {formatDuration(session.createdAt, session.endedAt)}
            </span>
          </span>
        }
      />

      {/* Block 1 — Overall Score + Radar */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-brand)]">
              <Sparkles className="h-3.5 w-3.5" />
              종합 점수
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-gradient-brand text-[88px] font-bold leading-none tracking-tight">
                  {scores.overall ?? '-'}
                </span>
                <span className="text-2xl font-semibold text-[var(--color-fg-subtle)]">/ 100</span>
              </div>
              {scores.overall === null && (
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">답변 데이터가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>역량별 점수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
              <ScoreRadarChart data={radarData} />
              <ul className="flex flex-col justify-center gap-3">
                {scores.byCategory.map((c) => (
                  <li key={c.category} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--color-fg)]">
                        {CATEGORY_LABELS[c.category] ?? c.category}
                      </span>
                      <span className="font-bold text-[var(--color-fg)]">
                        {c.average ?? '-'}
                      </span>
                    </div>
                    <ScoreBar value={c.average} />
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Block 2 — Interviewer Feedback */}
      {interviewerFeedbacks.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">면접관별 피드백</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {interviewerFeedbacks.map((f) => {
              const accent = ACCENT_BY_KEY[f.interviewerKey] ?? 'from-slate-500 to-slate-700'
              const initials = f.displayName.slice(0, 2)
              return (
                <Card key={f.interviewerKey} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials} size="md" accent={accent} />
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-fg)]">{f.displayName}</p>
                        <p className="text-xs text-[var(--color-fg-muted)]">{f.interviewerKey}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {f.messages.length === 0 ? (
                      <p className="text-xs text-[var(--color-fg-muted)]">메시지 없음</p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {f.messages.map((msg, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-fg)]">
                            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-brand)]" />
                            {msg}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Block 3 — Question Review */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">질문별 리뷰</h2>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => (
            <QuestionReviewItem
              key={q.id}
              index={i + 1}
              question={q.question}
              summary={q.answer?.transcript ?? '(답변 없음)'}
              evaluation={q.answer?.feedback ?? ''}
              suggestion={''}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </section>

      {/* Block 4 — Attitude + Speech Metrics */}
      <section className="mt-6 mb-2">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">면접 태도 분석</h2>
        {attitude || speechMetrics ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {attitude && (
              <>
                <MetricCard label="시선 처리" value={attitude.eyeContact} unit="%" max={100} />
                <MetricCard label="고개 숙임" value={attitude.headDownCount} unit="회" max={20} invertBar />
                <MetricCard label="손 움직임" value={attitude.handMovementCount} unit="회" max={20} invertBar />
                <MetricCard label="자세 안정성" value={attitude.postureStability} unit="%" max={100} />
              </>
            )}
            {speechMetrics && (
              <>
                <MetricCard label="평균 답변 지연" value={speechMetrics.avgResponseDelaySec} unit="초" max={10} invertBar decimals={1} />
                <MetricCard label="평균 발화 속도" value={speechMetrics.avgSpeakingRateCps} unit="자/초" max={15} decimals={1} />
                <MetricCard label="발화 턴 수" value={speechMetrics.turnCount} unit="회" max={30} />
              </>
            )}
          </div>
        ) : (
          <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 text-center text-sm text-[var(--color-fg-muted)]">
            태도 분석 데이터가 없습니다.
          </p>
        )}
      </section>
    </>
  )
}

function MetricCard({
  label, value, unit, max, invertBar = false, decimals = 0,
}: {
  label: string
  value: number
  unit: string
  max: number
  invertBar?: boolean
  decimals?: number
}) {
  const pct = Math.min(100, (value / max) * 100)
  const barPct = invertBar ? 100 - pct : pct
  const tone = invertBar
    ? pct > 70 ? 'warning' : 'success'
    : pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'neutral'

  const barColor = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    neutral: 'bg-slate-400',
  }[tone]

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
      <p className="text-xs font-medium text-[var(--color-fg-muted)]">{label}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[22px] font-bold tracking-tight text-[var(--color-fg)]">
          {decimals > 0 ? value.toFixed(decimals) : value}
        </span>
        <span className="text-xs font-semibold text-[var(--color-fg-muted)]">{unit}</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full', barColor)} style={{ width: `${barPct}%` }} />
      </div>
    </div>
  )
}
