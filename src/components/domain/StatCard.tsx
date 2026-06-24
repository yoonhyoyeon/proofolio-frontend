import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  value: string
  suffix?: string
  delta?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
  iconTone?: 'brand' | 'success' | 'warning' | 'danger'
}

const toneMap = {
  brand: 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-rose-50 text-rose-600',
} as const

export function StatCard({
  label,
  value,
  suffix,
  delta,
  trend = 'up',
  icon: Icon,
  iconTone = 'brand',
}: StatCardProps) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'grid h-10 w-10 place-items-center rounded-[var(--radius-md)]',
            toneMap[iconTone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs font-medium text-[var(--color-fg-muted)]">
        {label}
      </p>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-[28px] font-bold tracking-tight text-[var(--color-fg)]">
          {value}
        </span>
        {suffix ? (
          <span className="text-sm font-semibold text-[var(--color-fg-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
      {delta ? (
        <div className="mt-2 inline-flex items-center gap-1 text-xs">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <span className="font-medium text-emerald-600">{delta}</span>
        </div>
      ) : null}
    </Card>
  )
}
