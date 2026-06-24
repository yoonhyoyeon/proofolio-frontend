import * as React from 'react'
import { cn } from '@/lib/cn'

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (v: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  className,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false)
  const isOn = checked ?? internal
  const toggle = () => {
    if (disabled) return
    const next = !isOn
    if (checked === undefined) setInternal(next)
    onCheckedChange?.(next)
  }
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-ring)]',
        isOn ? 'bg-[var(--color-brand)]' : 'bg-slate-300',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          isOn ? 'translate-x-[18px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
