import { Mic, PhoneOff, Pause } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

interface MicControlsProps {
  elapsed?: string
  tone?: 'light' | 'dark'
}

export function MicControls({ elapsed = '12:34', tone = 'light' }: MicControlsProps) {
  const isDark = tone === 'dark'

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-6 rounded-[var(--radius-xl)] border px-6 py-4',
        isDark
          ? 'border-[var(--color-real-border)] bg-[var(--color-real-surface)]'
          : 'border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]',
      )}
    >
      <div className="flex min-w-[160px] items-center gap-2">
        <Wave isDark={isDark} />
        <span
          className={cn(
            'text-xs font-medium',
            isDark ? 'text-slate-400' : 'text-[var(--color-fg-muted)]',
          )}
        >
          음성 입력 중
        </span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_8px_24px_rgba(99,102,241,0.45)] transition-transform hover:scale-105"
          aria-label="마이크 토글"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40" />
          <Mic className="relative h-6 w-6" />
        </button>
        <span
          className={cn(
            'text-[10px] font-medium',
            isDark ? 'text-slate-500' : 'text-[var(--color-fg-subtle)]',
          )}
        >
          스페이스바를 눌러도 됩니다
        </span>
      </div>

      <div className="flex min-w-[160px] items-center justify-end gap-2">
        <span
          className={cn(
            'mr-2 inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums',
            isDark ? 'text-slate-300' : 'text-[var(--color-fg)]',
          )}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
          {elapsed}
        </span>
        <Button
          variant={isDark ? 'secondary' : 'outline'}
          size="sm"
          className={cn(
            'gap-1',
            isDark && 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700',
          )}
        >
          <Pause className="h-3.5 w-3.5" />
          일시정지
        </Button>
        <Button variant="danger" size="sm" className="gap-1">
          <PhoneOff className="h-3.5 w-3.5" />
          종료
        </Button>
      </div>
    </div>
  )
}

function Wave({ isDark }: { isDark: boolean }) {
  const bars = [4, 9, 14, 18, 22, 16, 10, 6, 12, 18, 14, 8, 4]
  return (
    <div className="flex h-6 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn(
            'block w-[3px] rounded-full',
            isDark ? 'bg-indigo-400/70' : 'bg-[var(--color-brand)]/80',
          )}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}
