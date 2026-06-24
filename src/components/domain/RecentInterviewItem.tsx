import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ScorePill } from './ScorePill'

interface RecentInterviewItemProps {
  id: string
  title: string
  position: string
  date: string
  score: number
  mode: 'practice' | 'real'
}

export function RecentInterviewItem({
  id,
  title,
  position,
  date,
  score,
  mode,
}: RecentInterviewItemProps) {
  return (
    <Link
      to={`/interview/result/${id}`}
      className="group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 transition-colors hover:bg-[var(--color-surface)]"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-semibold text-slate-600">
        {position.slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--color-fg)]">
          {title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--color-fg-muted)]">
          {position} · {date}
        </p>
      </div>
      <Badge
        tone={mode === 'real' ? 'dark' : 'brand'}
        className="hidden md:inline-flex"
      >
        {mode === 'real' ? '실전' : '연습'}
      </Badge>
      <ScorePill score={score} />
      <ChevronRight className="h-4 w-4 text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
