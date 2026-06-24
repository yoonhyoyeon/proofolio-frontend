import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface InterviewerCardProps {
  name: string
  role: string
  roleKo: string
  focus: string[]
  initials: string
  accent: string
  active?: boolean
  tone?: 'light' | 'dark'
}

export function InterviewerCard({
  name,
  role,
  roleKo,
  focus,
  initials,
  accent,
  active,
  tone = 'light',
}: InterviewerCardProps) {
  const isDark = tone === 'dark'
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[var(--radius-lg)] border p-4 transition-all',
        isDark
          ? 'border-[var(--color-real-border)] bg-[var(--color-real-surface)]'
          : 'border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]',
        active &&
          (isDark
            ? 'border-indigo-400 ring-1 ring-indigo-500/60'
            : 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand-ring)]'),
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar
          initials={initials}
          size="md"
          accent={accent}
          ringed={active && !isDark}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p
              className={cn(
                'truncate text-sm font-bold',
                isDark ? 'text-white' : 'text-[var(--color-fg)]',
              )}
            >
              {name}
            </p>
            {active && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]',
                )}
              >
                <span className="h-1 w-1 animate-pulse rounded-full bg-current" />
                Live
              </span>
            )}
          </div>
          <p
            className={cn(
              'mt-0.5 truncate text-[11px]',
              isDark ? 'text-slate-400' : 'text-[var(--color-fg-muted)]',
            )}
          >
            {role} · {roleKo}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {focus.map((f) => (
          <Badge
            key={f}
            tone={isDark ? 'dark' : 'outline'}
            size="sm"
            className={
              isDark
                ? 'border-slate-700 bg-slate-800/50 text-slate-300'
                : ''
            }
          >
            {f}
          </Badge>
        ))}
      </div>
    </div>
  )
}
