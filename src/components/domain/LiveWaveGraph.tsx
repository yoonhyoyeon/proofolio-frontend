type WaveColor = 'indigo' | 'emerald' | 'sky' | 'violet' | 'amber' | 'rose'

const STROKE: Record<WaveColor, string> = {
  indigo: '#6366f1',
  emerald: '#10b981',
  sky: '#0ea5e9',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
}

const W = 100
const H = 34

/**
 * A live, scrolling "oscillating" graph for a 0–100 metric over time.
 * Renders a filled area + line from a rolling history of values.
 */
export function LiveWaveGraph({
  label,
  value,
  history,
  color = 'indigo',
  unit = '',
  min = 0,
  max = 100,
  decimals = 0,
}: {
  label: string
  value: number | null
  history: number[]
  color?: WaveColor
  /** Unit suffix shown after the value, e.g. 'dB', '반음' */
  unit?: string
  /** Plotting range (y-axis) */
  min?: number
  max?: number
  /** Decimal places for the displayed value */
  decimals?: number
}) {
  const stroke = STROKE[color]
  const pending = value === null || history.length < 2
  const span = max - min || 1

  const pts = history.map((v, i) => {
    const x = history.length > 1 ? (i / (history.length - 1)) * W : 0
    const ratio = Math.max(0, Math.min(1, (v - min) / span))
    const y = H - ratio * (H - 4) - 2
    return [x, y] as const
  })
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = pts.length
    ? `M ${pts[0][0].toFixed(1)},${H} L ${line.replace(/ /g, ' L ')} L ${pts[pts.length - 1][0].toFixed(1)},${H} Z`
    : ''
  const gradId = `wave-${color}`

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-medium text-[var(--color-fg-muted)]">{label}</p>
        <div className="flex items-baseline gap-1">
          {pending ? (
            <span className="text-base font-bold text-[var(--color-fg-subtle)]">—</span>
          ) : (
            <>
              <span className="text-base font-bold tabular-nums tracking-tight text-[var(--color-fg)]">
                {value.toFixed(decimals)}
              </span>
              {unit && (
                <span className="text-[10px] font-medium text-[var(--color-fg-subtle)]">
                  {unit}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-2 h-9 w-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {pending ? (
          <line
            x1="0"
            y1={H / 2}
            x2={W}
            y2={H / 2}
            stroke={stroke}
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ) : (
          <>
            <path d={area} fill={`url(#${gradId})`} />
            <polyline
              points={line}
              fill="none"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>
    </div>
  )
}
