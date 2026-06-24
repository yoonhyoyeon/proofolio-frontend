import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-fg)]">
          다시 오신 걸 환영해요 👋
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
          이메일로 로그인하거나, 소셜 계정으로 빠르게 시작하세요.
        </p>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-fg-muted)]">
              이메일
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
              <Input
                type="email"
                placeholder="you@proofolio.ai"
                className="h-11 pl-10"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-fg-muted)]">
                비밀번호
              </span>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[var(--color-brand)] hover:underline"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-11 px-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-[var(--color-fg-subtle)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          <label className="mt-1 inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-fg-muted)]">
            <Switch defaultChecked={false} />
            로그인 상태 유지
          </label>

          <Button type="submit" size="lg" className="mt-2">
            로그인
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-fg-muted)]">
          아직 계정이 없으신가요?{' '}
          <Link
            to="/signup"
            className="font-semibold text-[var(--color-brand)] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
