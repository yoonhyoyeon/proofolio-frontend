import { cn } from '@/lib/cn'

interface AvatarProps {
  initials: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  accent?: string
  ringed?: boolean
}

const sizeMap = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-sm',
  xl: 'h-20 w-20 text-base',
} as const

export function Avatar({
  initials,
  className,
  size = 'md',
  accent = 'from-indigo-500 to-violet-500',
  ringed = false,
}: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-br font-semibold tracking-tight text-white',
        sizeMap[size],
        accent,
        ringed && 'ring-4 ring-[var(--color-brand-ring)]',
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  )
}
