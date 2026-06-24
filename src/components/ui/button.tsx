import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-ring)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand)] text-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:bg-[var(--color-brand-hover)]',
        secondary:
          'bg-[var(--color-surface-2)] text-[var(--color-fg)] hover:bg-slate-200/80',
        outline:
          'border border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:bg-[var(--color-surface)]',
        ghost:
          'bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface)]',
        soft:
          'bg-[var(--color-brand-subtle)] text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]',
        danger:
          'bg-[var(--color-danger)] text-white hover:bg-red-700',
        dangerOutline:
          'border border-[var(--color-danger)]/40 text-[var(--color-danger)] bg-white hover:bg-[var(--color-danger-soft)]',
        dark:
          'bg-slate-900 text-white hover:bg-slate-800',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-5 text-[15px]',
        xl: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { buttonVariants }
