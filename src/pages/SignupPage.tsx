import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Check } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

type Strength = 'weak' | 'fair' | 'good' | 'strong'

function getStrength(pw: string): { level: Strength; score: number } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (pw.length >= 12) score++
  const level: Strength =
    score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong'
  return { level, score }
}

const strengthMeta: Record<Strength, { label: string; tone: string; barTone: string }> = {
  weak: {
    label: '약함',
    tone: 'text-rose-600',
    barTone: 'bg-rose-500',
  },
  fair: {
    label: '보통',
    tone: 'text-amber-600',
    barTone: 'bg-amber-500',
  },
  good: {
    label: '좋음',
    tone: 'text-emerald-600',
    barTone: 'bg-emerald-500',
  },
  strong: {
    label: '강함',
    tone: 'text-emerald-700',
    barTone: 'bg-emerald-600',
  },
}

export function SignupPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const navigate = useNavigate()

  const strength = useMemo(() => getStrength(password), [password])
  const requirements = [
    { label: '8자 이상', ok: password.length >= 8 },
    { label: '영문 + 숫자 조합', ok: /[A-Za-z]/.test(password) && /[0-9]/.test(password) },
    { label: '특수문자 포함', ok: /[^A-Za-z0-9]/.test(password) },
  ]

  const canSubmit = terms && privacy && password.length >= 8

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-fg)]">
          무료로 시작하기
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
          1분이면 끝. 첫 모의면접은 신용카드 없이 진행할 수 있어요.
        </p>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (canSubmit) navigate('/')
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-fg-muted)]">
              이름
            </span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
              <Input
                type="text"
                placeholder="윤효연"
                className="h-11 pl-10"
                autoComplete="name"
                required
              />
            </div>
          </label>

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
            <span className="text-xs font-medium text-[var(--color-fg-muted)]">
              비밀번호
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="8자 이상, 영문/숫자/특수문자"
                className="h-11 px-10"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {password.length > 0 && (
              <div className="mt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-fg-muted)]">
                    비밀번호 강도
                  </span>
                  <span
                    className={cn(
                      'font-semibold',
                      strengthMeta[strength.level].tone,
                    )}
                  >
                    {strengthMeta[strength.level].label}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-colors',
                        i < strength.score
                          ? strengthMeta[strength.level].barTone
                          : 'bg-slate-100',
                      )}
                    />
                  ))}
                </div>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {requirements.map((r) => (
                    <li
                      key={r.label}
                      className={cn(
                        'inline-flex items-center gap-1 text-[11px]',
                        r.ok
                          ? 'text-emerald-600'
                          : 'text-[var(--color-fg-subtle)]',
                      )}
                    >
                      <Check
                        className={cn(
                          'h-3 w-3',
                          r.ok ? 'opacity-100' : 'opacity-40',
                        )}
                      />
                      {r.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </label>

          <div className="mt-2 flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <TermsRow
              required
              checked={terms}
              onChange={setTerms}
              label="서비스 이용약관에 동의합니다"
              link="이용약관 보기"
            />
            <TermsRow
              required
              checked={privacy}
              onChange={setPrivacy}
              label="개인정보 처리방침에 동의합니다"
              link="자세히"
            />
            <TermsRow
              checked={marketing}
              onChange={setMarketing}
              label="마케팅 정보 수신에 동의합니다 (선택)"
            />
          </div>

          <Button type="submit" size="lg" className="mt-3" disabled={!canSubmit}>
            계정 만들기
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-fg-muted)]">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-brand)] hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

function TermsRow({
  required,
  checked,
  onChange,
  label,
  link,
}: {
  required?: boolean
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  link?: string
}) {
  return (
    <label className="flex items-start gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-[4px] border border-[var(--color-border-strong)] accent-[var(--color-brand)]"
      />
      <span className="flex-1 text-[var(--color-fg)]">
        {required && (
          <span className="mr-1 text-[10px] font-bold text-rose-500">필수</span>
        )}
        {label}
      </span>
      {link && (
        <button
          type="button"
          className="text-xs font-medium text-[var(--color-fg-muted)] underline-offset-4 hover:underline"
        >
          {link}
        </button>
      )}
    </label>
  )
}
