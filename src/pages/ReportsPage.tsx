import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, ChevronRight, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScorePill } from '@/components/domain/ScorePill'
import { reportList } from '@/lib/mock'

export function ReportsPage() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeader
        title="면접 리포트"
        description="지금까지 진행한 모든 모의면접 결과를 확인할 수 있어요."
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
            <Input
              placeholder="면접 제목으로 검색"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all" className="h-9 w-[140px]">
              <option value="all">전체 직무</option>
              <option value="frontend">프론트엔드</option>
              <option value="backend">백엔드</option>
              <option value="fullstack">풀스택</option>
              <option value="ai">AI 엔지니어</option>
              <option value="designer">디자이너</option>
              <option value="pm">PM</option>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" />
              최신순
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs font-medium text-[var(--color-fg-muted)]">
                <th className="px-6 py-3">면접 제목</th>
                <th className="py-3 pr-4">직무</th>
                <th className="py-3 pr-4">날짜</th>
                <th className="py-3 pr-4">모드</th>
                <th className="py-3 pr-4">점수</th>
                <th className="py-3 pr-6"></th>
              </tr>
            </thead>
            <tbody>
              {reportList.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(`/interview/result/${row.id}`)}
                  className="group cursor-pointer border-b border-[var(--color-border)] last:border-none hover:bg-[var(--color-surface)]"
                >
                  <td className="px-6 py-4">{row.title}</td>
                  <td className="py-4 pr-4 text-[var(--color-fg-muted)]">
                    {row.position}
                  </td>
                  <td className="py-4 pr-4 text-[var(--color-fg-muted)]">
                    {row.date}
                  </td>
                  <td className="py-4 pr-4">
                    <Badge tone={row.mode === 'real' ? 'dark' : 'brand'}>
                      {row.mode === 'real' ? '실전' : '연습'}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <ScorePill score={row.score} />
                  </td>
                  <td className="py-4 pr-6">
                    <ChevronRight className="h-4 w-4 text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-0.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 text-xs text-[var(--color-fg-muted)]">
          <span>총 {reportList.length}건 중 1–{reportList.length}건 표시</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled>
              이전
            </Button>
            <Button variant="ghost" size="sm" disabled>
              다음
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
