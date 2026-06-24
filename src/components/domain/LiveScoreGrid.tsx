import { liveScores } from '@/lib/mock'

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}

export type LiveScoreItem = {
  label: string
  /** Percentage (0–100) for bar items, or a raw value for unit items. null = pending */
  value: number | null
  color: string
  /** When set, render as a raw metric with this unit (e.g. '회', '초') instead of a /100 bar */
  unit?: string
  /** Small subtitle, e.g. detected filler-word types */
  note?: string
}

export function LiveScoreGrid({ scores }: { scores?: LiveScoreItem[] }) {
  const items: LiveScoreItem[] = scores ?? liveScores

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((s) => {
        const pending = s.value === null
        const isBar = !s.unit

        return (
          <div
            key={s.label}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3"
          >
            <p className="text-[11px] font-medium text-[var(--color-fg-muted)]">
              {s.label}
            </p>

            <div className="mt-1 flex items-baseline gap-1">
              {pending ? (
                <span className="text-lg font-bold text-[var(--color-fg-subtle)]">—</span>
              ) : (
                <>
                  <span className="text-lg font-bold tabular-nums tracking-tight text-[var(--color-fg)]">
                    {s.value}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--color-fg-subtle)]">
                    {s.unit ?? '/ 100'}
                  </span>
                </>
              )}
            </div>

            {isBar && (
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${colorMap[s.color] ?? 'bg-indigo-500'}`}
                  style={{ width: `${pending ? 0 : s.value}%` }}
                />
              </div>
            )}
            {!isBar && pending && (
              <p className="mt-2 text-[10px] text-[var(--color-fg-subtle)]">분석 대기 중</p>
            )}
            {s.note && !pending && (
              <p className="mt-1.5 truncate text-[10px] text-[var(--color-fg-subtle)]">
                {s.note}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
