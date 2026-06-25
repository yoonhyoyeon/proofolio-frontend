import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mic,
  Sparkles,
  Plus,
  ArrowUpRight,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatCard } from '@/components/domain/StatCard'
import { RecentInterviewItem } from '@/components/domain/RecentInterviewItem'
import { ProgressLineChart, type ChartPoint } from '@/components/domain/ProgressLineChart'
import {
  getInterviewList,
  GITHUB_TOKEN_KEY,
  GITHUB_USERNAME_KEY,
  type InterviewSession,
} from '@/lib/api'

export function DashboardPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem(GITHUB_USERNAME_KEY) ?? '사용자'

  useEffect(() => {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY) ?? ''
    if (!token) { setLoading(false); return }
    getInterviewList(token)
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sortedAsc = [...sessions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const withScore = sortedAsc.filter((s) => s.finalScore !== null)
  const avgScore =
    withScore.length > 0
      ? Math.round(
          (withScore.reduce((acc, s) => acc + (s.finalScore ?? 0), 0) / withScore.length) * 10,
        ) / 10
      : null

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const chartData: ChartPoint[] = withScore.map((s) => ({
    label: s.createdAt.slice(5, 10).replace('-', '.'),
    score: s.finalScore as number,
  }))

  return (
    <>
      <PageHeader
        title={
          <>
            안녕하세요,{' '}
            <span className="text-gradient-brand">{username}</span> 님
          </>
        }
        description="면접 연습 현황을 한눈에 확인해 보세요."
        action={
          <Link to="/interview/new" className={buttonVariants({ size: 'lg' })}>
            <Plus className="h-4 w-4" />새 면접 시작
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="총 면접 횟수"
          value={loading ? '-' : String(sessions.length)}
          suffix="회"
          icon={Mic}
          iconTone="brand"
        />
        <StatCard
          label="평균 면접 점수"
          value={loading ? '-' : avgScore !== null ? String(avgScore) : '-'}
          suffix="점"
          icon={Sparkles}
          iconTone="brand"
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>최근 면접</CardTitle>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                최근 진행한 면접 최대 4건
              </p>
            </div>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand)] hover:underline"
            >
              전체 보기
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--color-fg-muted)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                불러오는 중...
              </div>
            ) : recentSessions.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-fg-muted)]">
                진행한 면접이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col">
                {recentSessions.map((s) => (
                  <RecentInterviewItem
                    key={s.id}
                    id={s.id}
                    title={`면접 #${s.sessionNo}`}
                    position="면접"
                    date={s.createdAt.slice(0, 10).replace(/-/g, '.')}
                    score={s.finalScore ?? 0}
                    mode="practice"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>면접 점수 추이</CardTitle>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                점수가 기록된 면접 기준
              </p>
            </div>
            {chartData.length >= 2 && (() => {
              const first = chartData[0].score
              const last = chartData[chartData.length - 1].score
              const diff = last - first
              if (diff <= 0) return null
              return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  +{diff}점 향상
                </span>
              )
            })()}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--color-fg-muted)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                불러오는 중...
              </div>
            ) : chartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-fg-muted)]">
                점수 데이터가 없습니다.
              </p>
            ) : (
              <ProgressLineChart data={chartData} />
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
