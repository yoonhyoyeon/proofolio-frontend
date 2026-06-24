import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { TranscriptMsg } from '@/lib/mock'

interface TranscriptMessageProps {
  message: TranscriptMsg
  tone?: 'light' | 'dark'
}

export function TranscriptMessage({
  message,
  tone = 'light',
}: TranscriptMessageProps) {
  const isDark = tone === 'dark'
  const isMine = message.side === 'right'

  if (isMine) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[80%] flex-col items-end gap-1">
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-wide',
              isDark ? 'text-slate-500' : 'text-[var(--color-fg-subtle)]',
            )}
          >
            나 · {message.speakerName}
            {message.active && ' · 발화 중'}
          </span>
          <div
            className={cn(
              'rounded-[var(--radius-lg)] rounded-tr-[6px] px-4 py-2.5 text-sm leading-relaxed shadow-[var(--shadow-soft)]',
              'bg-[var(--color-brand)] text-white',
              message.active && 'ring-2 ring-[var(--color-brand-ring)]',
            )}
          >
            {message.text}
            {message.active && (
              <span className="ml-1 inline-flex gap-0.5 align-middle">
                <span className="h-1 w-1 animate-pulse rounded-full bg-white/80" />
                <span
                  className="h-1 w-1 animate-pulse rounded-full bg-white/80"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="h-1 w-1 animate-pulse rounded-full bg-white/80"
                  style={{ animationDelay: '0.3s' }}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        message.followUp && 'pl-9',
      )}
    >
      {!message.followUp && (
        <Avatar
          initials={message.initials ?? '?'}
          size="sm"
          accent={message.accent ?? 'from-slate-500 to-slate-700'}
        />
      )}
      {message.followUp && (
        <span className="mt-2 block h-px w-6 shrink-0 bg-[var(--color-border)]" />
      )}
      <div className="flex max-w-[80%] flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-semibold',
              isDark ? 'text-slate-200' : 'text-[var(--color-fg)]',
            )}
          >
            {message.speakerName}
          </span>
          <span
            className={cn(
              'text-[10px]',
              isDark ? 'text-slate-500' : 'text-[var(--color-fg-subtle)]',
            )}
          >
            {message.role}
          </span>
          {message.followUp && (
            <Badge
              tone={isDark ? 'dark' : 'brand'}
              size="sm"
              className={isDark ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' : ''}
            >
              follow-up
            </Badge>
          )}
          {message.interrupt && (
            <Badge
              tone={isDark ? 'danger' : 'warning'}
              size="sm"
              className={isDark ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' : ''}
            >
              개입
            </Badge>
          )}
        </div>
        <div
          className={cn(
            'rounded-[var(--radius-lg)] rounded-tl-[6px] px-4 py-2.5 text-sm leading-relaxed',
            isDark
              ? 'bg-[var(--color-real-surface)] text-slate-200'
              : 'bg-white text-[var(--color-fg)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--color-border)]',
          )}
        >
          {message.text}
        </div>
      </div>
    </div>
  )
}
