import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SocialButtonProps {
  provider: 'google' | 'kakao' | 'naver' | 'github'
  children: ReactNode
}

export function SocialButton({ provider, children }: SocialButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border text-sm font-medium transition-colors',
        provider === 'google' &&
          'border-[var(--color-border)] bg-white text-[var(--color-fg)] hover:bg-[var(--color-surface)]',
        provider === 'kakao' &&
          'border-[#FEE500] bg-[#FEE500] text-[#191600] hover:brightness-95',
        provider === 'naver' &&
          'border-[#03C75A] bg-[#03C75A] text-white hover:brightness-95',
        provider === 'github' &&
          'border-slate-900 bg-slate-900 text-white hover:bg-slate-800',
      )}
    >
      <ProviderIcon provider={provider} />
      <span>{children}</span>
    </button>
  )
}

function ProviderIcon({
  provider,
}: {
  provider: SocialButtonProps['provider']
}) {
  if (provider === 'google') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="#EA4335"
          d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.32 0-6.04-2.76-6.04-6.16S8.68 6.04 12 6.04c1.9 0 3.16.8 3.88 1.48l2.64-2.56C16.94 3.48 14.68 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12s4.26 9.5 9.5 9.5c5.48 0 9.1-3.84 9.1-9.26 0-.62-.06-1.1-.16-1.58H12z"
        />
        <path
          fill="#34A853"
          d="M3.6 7.36l3.18 2.34C7.68 7.84 9.68 6.04 12 6.04c1.9 0 3.16.8 3.88 1.48l2.64-2.56C16.94 3.48 14.68 2.5 12 2.5 8.16 2.5 4.84 4.84 3.6 7.36z"
          opacity="0"
        />
      </svg>
    )
  }
  if (provider === 'kakao') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="#191600"
          d="M12 3C7 3 3 6.2 3 10.1c0 2.5 1.7 4.7 4.2 6L6 19.7c-.1.3.2.6.5.4l4.2-2.8c.4 0 .9.1 1.3.1 5 0 9-3.2 9-7.3S17 3 12 3z"
        />
      </svg>
    )
  }
  if (provider === 'naver') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="#fff"
          d="M14.13 12.84 9.78 6.5H6v11h3.87v-6.34l4.35 6.34H18V6.5h-3.87v6.34z"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.85 9.66.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 7.5c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.94-2.33 4.81-4.56 5.06.36.32.68.94.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49C19.13 20.56 22 16.75 22 12.26 22 6.58 17.52 2 12 2z" />
    </svg>
  )
}
