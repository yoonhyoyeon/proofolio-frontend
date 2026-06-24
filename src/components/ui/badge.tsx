import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5',
  {
    variants: {
      tone: {
        neutral:
          'border-slate-200 bg-slate-50 text-slate-600',
        brand:
          'border-indigo-200 bg-[var(--color-brand-subtle)] text-[var(--color-brand)]',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning:
          'border-amber-200 bg-amber-50 text-amber-700',
        danger:
          'border-rose-200 bg-rose-50 text-rose-700',
        dark:
          'border-slate-700 bg-slate-900 text-slate-100',
        outline:
          'border-[var(--color-border)] bg-white text-[var(--color-fg-muted)]',
      },
      size: {
        sm: 'text-[10px] px-2 py-0',
        md: 'text-[11px] px-2.5 py-0.5',
        lg: 'text-xs px-3 py-1',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
  )
}
