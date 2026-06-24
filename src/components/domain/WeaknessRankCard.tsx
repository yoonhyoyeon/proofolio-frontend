import { AlertTriangle } from 'lucide-react'

interface WeaknessRankCardProps {
  rank: number
  title: string
  count: number
  summary: string
}

export function WeaknessRankCard({
  rank,
  title,
  count,
  summary,
}: WeaknessRankCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">
        #{rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-[var(--color-fg)]">
            {title}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-amber-700">
            <AlertTriangle className="h-3 w-3" />
            {count}회
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-fg-muted)]">
          {summary}
        </p>
      </div>
    </div>
  )
}
