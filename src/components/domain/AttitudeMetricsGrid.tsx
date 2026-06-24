import { attitudeMetrics } from '@/lib/mock'
import { cn } from '@/lib/cn'

const toneMap = {
  success: {
    bar: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700',
  },
  warning: {
    bar: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700',
  },
  neutral: {
    bar: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-600',
  },
} as const

export function AttitudeMetricsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {attitudeMetrics.map((m) => {
        const tone = toneMap[m.tone]
        return (
          <div
            key={m.key}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-[var(--color-fg-muted)]">
                {m.label}
              </p>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  tone.chip,
                )}
              >
                {m.comment}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[22px] font-bold tracking-tight text-[var(--color-fg)]">
                {m.value}
              </span>
              <span className="text-xs font-semibold text-[var(--color-fg-muted)]">
                {m.unit}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn('h-full rounded-full', tone.bar)}
                style={{
                  width: `${m.unit === '%' ? m.value : Math.min(100, m.value * 2)}%`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
