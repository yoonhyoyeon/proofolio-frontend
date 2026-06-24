import { liveScores } from '@/lib/mock'

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
}

export type LiveScoreItem = {
  label: string
  value: number
  color: string
}

export function LiveScoreGrid({ scores }: { scores?: LiveScoreItem[] }) {
  const items = scores ?? liveScores

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3"
        >
          <p className="text-[11px] font-medium text-[var(--color-fg-muted)]">
            {s.label}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums tracking-tight text-[var(--color-fg)]">
              {s.value}
            </span>
            <span className="text-[10px] font-medium text-[var(--color-fg-subtle)]">
              / 100
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${colorMap[s.color] ?? 'bg-indigo-500'}`}
              style={{ width: `${s.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
