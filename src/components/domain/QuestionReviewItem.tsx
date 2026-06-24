import { useState } from 'react'
import { ChevronDown, MessageSquare, Sparkles, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/cn'

interface QuestionReviewItemProps {
  index: number
  question: string
  summary: string
  evaluation: string
  suggestion: string
  defaultOpen?: boolean
}

export function QuestionReviewItem({
  index,
  question,
  summary,
  evaluation,
  suggestion,
  defaultOpen,
}: QuestionReviewItemProps) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white transition-colors',
        open ? 'shadow-[var(--shadow-soft)]' : '',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-6 min-w-[28px] place-items-center rounded-md bg-[var(--color-brand-subtle)] px-1.5 text-[11px] font-bold text-[var(--color-brand)]">
            Q{index}
          </span>
          <p className="truncate text-sm font-semibold text-[var(--color-fg)]">
            {question}
          </p>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] px-5 py-5 md:grid-cols-3">
          <DetailItem
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            label="답변 요약"
            text={summary}
          />
          <DetailItem
            icon={<Sparkles className="h-3.5 w-3.5" />}
            label="AI 평가"
            text={evaluation}
            tone="brand"
          />
          <DetailItem
            icon={<Lightbulb className="h-3.5 w-3.5" />}
            label="개선 제안"
            text={suggestion}
            tone="amber"
          />
        </div>
      )}
    </div>
  )
}

function DetailItem({
  icon,
  label,
  text,
  tone = 'neutral',
}: {
  icon: React.ReactNode
  label: string
  text: string
  tone?: 'neutral' | 'brand' | 'amber'
}) {
  const labelTone =
    tone === 'brand'
      ? 'text-[var(--color-brand)]'
      : tone === 'amber'
        ? 'text-amber-700'
        : 'text-[var(--color-fg-muted)]'
  return (
    <div>
      <p
        className={cn(
          'mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide',
          labelTone,
        )}
      >
        {icon}
        {label}
      </p>
      <p className="text-[13px] leading-relaxed text-[var(--color-fg)]">
        {text}
      </p>
    </div>
  )
}
