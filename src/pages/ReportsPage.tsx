import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScorePill } from '@/components/domain/ScorePill'
import { getInterviewList, GITHUB_TOKEN_KEY, type InterviewSession } from '@/lib/api'

function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.')
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return '-'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}분 ${sec}초`
}

export function ReportsPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY) ?? ''
    getInterviewList(token)
      .then(setSessions)
      .catch(() => setError('면접 리포트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="면접 리포트"
        description="지금까지 진행한 모든 모의면접 결과를 확인할 수 있어요."
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[var(--color-fg-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              불러오는 중...
            </div>
          ) : error ? (
            <p className="py-16 text-center text-sm text-rose-500">{error}</p>
          ) : sessions.length === 0 ? (
            <p className="py-16 text-center text-sm text-[var(--color-fg-muted)]">
              진행한 면접이 없습니다.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs font-medium text-[var(--color-fg-muted)]">
                  <th className="px-6 py-3">세션 번호</th>
                  <th className="py-3 pr-4">날짜</th>
                  <th className="py-3 pr-4">소요 시간</th>
                  <th className="py-3 pr-4">질문 수</th>
                  <th className="py-3 pr-4">답변 수</th>
                  <th className="py-3 pr-4">상태</th>
                  <th className="py-3 pr-4">점수</th>
                  <th className="py-3 pr-6"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => navigate(`/interview/result/${s.id}`)}
                    className="group cursor-pointer border-b border-[var(--color-border)] last:border-none hover:bg-[var(--color-surface)]"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--color-fg)]">
                      #{s.sessionNo}
                    </td>
                    <td className="py-4 pr-4 text-[var(--color-fg-muted)]">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="py-4 pr-4 text-[var(--color-fg-muted)]">
                      {formatDuration(s.createdAt, s.endedAt)}
                    </td>
                    <td className="py-4 pr-4 text-[var(--color-fg-muted)]">
                      {s._count.questions}개
                    </td>
                    <td className="py-4 pr-4 text-[var(--color-fg-muted)]">
                      {s._count.answers}개
                    </td>
                    <td className="py-4 pr-4">
                      <Badge tone={s.status === 'ENDED' ? 'outline' : 'brand'}>
                        {s.status === 'ENDED' ? '종료' : '진행 중'}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4">
                      <ScorePill score={s.finalScore} />
                    </td>
                    <td className="py-4 pr-6">
                      <ChevronRight className="h-4 w-4 text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && !error && sessions.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-6 py-4 text-xs text-[var(--color-fg-muted)]">
            총 {sessions.length}건
          </div>
        )}
      </Card>
    </>
  )
}
