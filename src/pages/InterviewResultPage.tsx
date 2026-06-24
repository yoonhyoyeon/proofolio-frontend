import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Sparkles,
  Share2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScoreRadarChart } from '@/components/domain/ScoreRadarChart'
import { FeedbackBlock } from '@/components/domain/FeedbackBlock'
import { QuestionReviewItem } from '@/components/domain/QuestionReviewItem'
import { AttitudeMetricsGrid } from '@/components/domain/AttitudeMetricsGrid'
import {
  interviewMeta,
  interviewerFeedback,
  questionReview,
  weaknessAnalysis,
  categoryScores,
} from '@/lib/mock'

export function InterviewResultPage() {
  const { id } = useParams()

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
        title={interviewMeta.title}
        description={
          <span className="flex flex-wrap items-center gap-2 text-xs">
            <Badge tone="brand">{interviewMeta.company}</Badge>
            <Badge tone="neutral">{interviewMeta.position}</Badge>
            <Badge tone={interviewMeta.mode === 'real' ? 'dark' : 'outline'}>
              {interviewMeta.mode === 'real' ? '실전 모드' : '연습 모드'}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[var(--color-fg-muted)]">
              <Calendar className="h-3 w-3" />
              {interviewMeta.date}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--color-fg-muted)]">
              <Clock className="h-3 w-3" />
              {interviewMeta.duration}
            </span>
            <span className="text-[var(--color-fg-subtle)]">
              · 면접 ID #{id}
            </span>
          </span>
        }
        action={
          <>
            <Button variant="outline" size="md" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              공유
            </Button>
            <Button size="md" className="gap-1.5">
              <Download className="h-4 w-4" />
              PDF 다운로드
            </Button>
          </>
        }
      />

      {/* Block 1 — Overall Score */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-brand)]">
              <Sparkles className="h-3.5 w-3.5" />
              종합 점수
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-gradient-brand text-[88px] font-bold leading-none tracking-tight">
                  {interviewMeta.totalScore}
                </span>
                <span className="text-2xl font-semibold text-[var(--color-fg-subtle)]">
                  / 100
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--color-fg)]">
                {interviewMeta.comment}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {interviewMeta.trend.map((t) => (
                <Badge key={t} tone="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>역량별 점수</CardTitle>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                5개 평가 축 기준의 균형도를 확인하세요.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
              <ScoreRadarChart />
              <ul className="flex flex-col justify-center gap-3">
                {categoryScores.map((c) => (
                  <li key={c.axis} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--color-fg)]">
                        {c.axis}
                      </span>
                      <span className="font-bold text-[var(--color-fg)]">
                        {c.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[var(--color-brand)]"
                        style={{ width: `${c.value}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Block 2 — Interviewer Feedback */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">
          면접관별 피드백
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {interviewerFeedback.map((f) => (
            <FeedbackBlock key={f.interviewerId} {...f} />
          ))}
        </div>
      </section>

      {/* Block 3 — Weakness Analysis */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">
          반복적으로 감지된 약점
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {weaknessAnalysis.map((w) => (
            <div
              key={w.id}
              className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50/60 p-4"
            >
              <div className="flex items-start gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-900">
                    {w.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
                    {w.description}
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:underline"
                  >
                    개선 가이드 보기
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Block 4 — Question Review */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">
          질문별 리뷰
        </h2>
        <div className="flex flex-col gap-3">
          {questionReview.map((q, i) => (
            <QuestionReviewItem
              key={q.id}
              index={i + 1}
              question={q.question}
              summary={q.summary}
              evaluation={q.evaluation}
              suggestion={q.suggestion}
              defaultOpen={q.expanded}
            />
          ))}
        </div>
      </section>

      {/* Block 5 — Attitude Analysis */}
      <section className="mt-6 mb-2">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">
          면접 태도 분석
        </h2>
        <AttitudeMetricsGrid />
      </section>
    </>
  )
}
