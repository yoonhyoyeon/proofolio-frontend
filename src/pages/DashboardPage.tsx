import { Link } from 'react-router-dom'
import {
  Mic,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowUpRight,
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
import { WeaknessRankCard } from '@/components/domain/WeaknessRankCard'
import { ProgressLineChart } from '@/components/domain/ProgressLineChart'
import {
  currentUser,
  dashboardStats,
  recentInterviews,
  topWeaknesses,
} from '@/lib/mock'

const iconMap = {
  Mic,
  Sparkles,
  AlertTriangle,
  TrendingUp,
} as const

const toneMap = {
  total: 'brand',
  average: 'brand',
  weakness: 'warning',
  improvement: 'success',
} as const

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            안녕하세요,{' '}
            <span className="text-gradient-brand">{currentUser.name}</span> 님
            👋
          </>
        }
        description="이번 주의 면접 연습 현황을 한눈에 확인해 보세요."
        action={
          <Link
            to="/interview/new"
            className={buttonVariants({ size: 'lg' })}
          >
            <Plus className="h-4 w-4" />새 면접 시작
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((s) => {
          const Icon = iconMap[s.icon as keyof typeof iconMap]
          return (
            <StatCard
              key={s.key}
              label={s.label}
              value={s.value}
              suffix={s.suffix}
              delta={s.delta}
              trend={s.trend}
              icon={Icon}
              iconTone={toneMap[s.key as keyof typeof toneMap]}
            />
          )
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>최근 면접</CardTitle>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                지난 30일 동안 진행한 모의면접 4건
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
            <div className="flex flex-col">
              {recentInterviews.map((iv) => (
                <RecentInterviewItem key={iv.id} {...iv} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>반복되는 약점 Top 3</CardTitle>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                AI가 누적 면접에서 자주 감지한 항목
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {topWeaknesses.map((w) => (
              <WeaknessRankCard key={w.rank} {...w} />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>면접 점수 추이</CardTitle>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                최근 8회 면접 결과 · 평균 76.4 → 84
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              꾸준히 상승
            </span>
          </CardHeader>
          <CardContent>
            <ProgressLineChart />
          </CardContent>
        </Card>
      </section>
    </>
  )
}
