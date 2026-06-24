import { scoreLevel } from '@/lib/mock'
import { cn } from '@/lib/cn'

interface ScorePillProps {
  score: number
  className?: string
}

export function ScorePill({ score, className }: ScorePillProps) {
  const level = scoreLevel(score)
  const tone =
    level === 'high'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : level === 'mid'
        ? 'bg-amber-50 text-amber-700 ring-amber-100'
        : 'bg-rose-50 text-rose-700 ring-rose-100'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        tone,
        className,
      )}
    >
      {score}
      <span className="text-[10px] font-medium opacity-70">점</span>
    </span>
  )
}
