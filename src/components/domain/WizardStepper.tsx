import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface WizardStepperProps {
  steps: string[]
  current: number
}

export function WizardStepper({ steps, current }: WizardStepperProps) {
  return (
    <ol className="flex items-center gap-3">
      {steps.map((label, idx) => {
        const state =
          idx < current ? 'done' : idx === current ? 'active' : 'pending'
        return (
          <li key={label} className="flex flex-1 items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-colors',
                  state === 'done'
                    ? 'bg-[var(--color-brand)] text-white'
                    : state === 'active'
                      ? 'bg-[var(--color-brand)] text-white shadow-[0_0_0_4px_rgba(99,102,241,0.18)]'
                      : 'bg-slate-100 text-[var(--color-fg-subtle)]',
                )}
              >
                {state === 'done' ? <Check className="h-4 w-4" /> : idx + 1}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap text-[11px] font-medium transition-colors',
                  state === 'pending'
                    ? 'text-[var(--color-fg-subtle)]'
                    : 'text-[var(--color-fg)]',
                )}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  'mb-5 h-px flex-1 transition-colors',
                  state === 'done'
                    ? 'bg-[var(--color-brand)]'
                    : 'bg-slate-200',
                )}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
