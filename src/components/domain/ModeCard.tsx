import type { ReactNode } from 'react'
import { Check, Sparkles, Mic } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ModeCardProps {
  mode: 'practice' | 'real'
  selected: boolean
  onSelect: () => void
  features: { label: string; included: boolean }[]
  badge?: ReactNode
}

export function ModeCard({
  mode,
  selected,
  onSelect,
  features,
  badge,
}: ModeCardProps) {
  const isPractice = mode === 'practice'
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] border p-6 text-left transition-all',
        isPractice
          ? 'bg-white'
          : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100',
        selected
          ? isPractice
            ? 'border-[var(--color-brand)] shadow-[0_0_0_4px_rgba(99,102,241,0.18)]'
            : 'border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.30)]'
          : isPractice
            ? 'border-[var(--color-border)] hover:border-[var(--color-brand)]/40'
            : 'border-slate-800 hover:border-indigo-500/60',
      )}
    >
      {!isPractice && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(600px 200px at 100% 0%, rgba(124,58,237,0.5), transparent)',
          }}
        />
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'grid h-11 w-11 place-items-center rounded-[var(--radius-md)]',
              isPractice
                ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                : 'bg-slate-800/80 text-indigo-300',
            )}
          >
            {isPractice ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </span>
          <div>
            <p
              className={cn(
                'text-[15px] font-bold tracking-tight',
                isPractice ? 'text-[var(--color-fg)]' : 'text-white',
              )}
            >
              {isPractice ? 'Practice Mode' : 'Real Interview Mode'}
            </p>
            <p
              className={cn(
                'mt-0.5 text-xs',
                isPractice
                  ? 'text-[var(--color-fg-muted)]'
                  : 'text-slate-400',
              )}
            >
              {isPractice ? '연습 모드' : '실전 모드'}
            </p>
          </div>
        </div>
        {badge}
      </div>

      <p
        className={cn(
          'relative text-sm leading-relaxed',
          isPractice ? 'text-[var(--color-fg-muted)]' : 'text-slate-300',
        )}
      >
        {isPractice
          ? '실시간 피드백과 카메라 분석으로 자신의 약점을 즉시 점검합니다.'
          : '점수와 피드백이 보이지 않는 진짜 면접 환경을 그대로 재현합니다.'}
      </p>

      <ul className="relative mt-1 flex flex-col gap-2">
        {features.map((f) => (
          <li
            key={f.label}
            className={cn(
              'flex items-center gap-2 text-sm',
              f.included
                ? isPractice
                  ? 'text-[var(--color-fg)]'
                  : 'text-slate-100'
                : isPractice
                  ? 'text-[var(--color-fg-subtle)] line-through'
                  : 'text-slate-500 line-through',
            )}
          >
            <span
              className={cn(
                'grid h-4 w-4 place-items-center rounded-full',
                f.included
                  ? isPractice
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-indigo-500 text-white'
                  : 'bg-slate-200 text-slate-400',
              )}
            >
              <Check className="h-3 w-3" />
            </span>
            {f.label}
          </li>
        ))}
      </ul>
    </button>
  )
}
