import { cn } from '@/lib/cn'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  trackClassName?: string
  barClassName?: string
}

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  barClassName,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full bg-slate-100',
        trackClassName,
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full bg-[var(--color-brand)] transition-all',
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
