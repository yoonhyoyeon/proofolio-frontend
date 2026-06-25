import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  FileText,
  FolderKanban,
  Github,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPortfolioList, GITHUB_TOKEN_KEY, type PortfolioSummary } from '@/lib/api'

export function PortfolioListPage() {
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY) ?? ''
    getPortfolioList(token)
      .then(setPortfolios)
      .catch(() => setPortfolios([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="내 포트폴리오"
        description="포트폴리오를 만들고, 공유하고, 면접 준비에 활용해 보세요."
      />

      {/* Two distinct entry points */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Link
          to="/portfolio/new"
          className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-brand-subtle)]/40"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-slate-900 text-white transition-transform group-hover:scale-105">
            <Github className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[var(--color-fg)]">GitHub로 자동 생성</p>
              <Badge tone="brand" className="gap-1">
                <Sparkles className="h-3 w-3" />
                추천
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
              공개·비공개 저장소를 연결해 AI가 포트폴리오를 자동으로 만듭니다.
            </p>
          </div>
        </Link>

        <Link
          to="/portfolio/upload"
          className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-brand-subtle)]/40"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-subtle)] text-[var(--color-brand)] transition-transform group-hover:scale-105">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-fg)]">이력서·포트폴리오 PDF 업로드</p>
            <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
              기존 PDF를 올리면 AI가 프로젝트 정보를 자동 추출합니다.
            </p>
          </div>
        </Link>
      </div>

      {/* Existing portfolios */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--color-fg-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          불러오는 중...
        </div>
      ) : portfolios.length > 0 ? (
        <>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            내 포트폴리오 ({portfolios.length})
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {portfolios.map((pf) => (
              <PortfolioCard key={pf.id} portfolio={pf} />
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}

function PortfolioCard({ portfolio }: { portfolio: PortfolioSummary }) {
  const isPublished = portfolio.status === 'PUBLISHED'
  return (
    <Link
      to={`/portfolio/${portfolio.id}`}
      className="group flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--color-brand)]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <FolderKanban className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-[var(--color-fg)]">
              {portfolio.title}
            </p>
            {portfolio.slug && (
              <p className="text-[11px] text-[var(--color-fg-muted)]">proofolio.io/{portfolio.slug}</p>
            )}
          </div>
        </div>
        <Badge tone={isPublished ? 'success' : 'outline'}>
          {isPublished ? '공개' : portfolio.status === 'READY' ? '완료' : '초안'}
        </Badge>
      </div>

      {portfolio.description && (
        <p className="mt-3 px-5 text-sm text-[var(--color-fg-muted)]">{portfolio.description}</p>
      )}

      <div className="mt-4 flex items-center gap-4 px-5 text-xs text-[var(--color-fg-muted)]">
        {portfolio.projectsCount != null && (
          <span>
            프로젝트 <span className="font-semibold text-[var(--color-fg)]">{portfolio.projectsCount}</span>
          </span>
        )}
        {portfolio.views != null && (
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {portfolio.views.toLocaleString()}
          </span>
        )}
        {portfolio.updatedAt && (
          <span className="ml-auto">업데이트 {portfolio.updatedAt}</span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
        {portfolio.theme ? (
          <Badge tone="neutral">{portfolio.theme}</Badge>
        ) : (
          <span />
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => e.preventDefault()}
        >
          편집
        </Button>
      </div>
    </Link>
  )
}
