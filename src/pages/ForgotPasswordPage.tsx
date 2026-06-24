import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          로그인으로 돌아가기
        </Link>

        {!submitted ? (
          <>
            <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-fg)]">
              비밀번호를 잊으셨나요?
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
              가입하신 이메일을 입력하시면 재설정 링크를 보내드립니다.
            </p>

            <form
              className="mt-8 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <Button type="submit" size="lg" className="mt-2">
                재설정 링크 받기
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <MailCheck className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-[var(--color-fg)]">
                메일을 확인해 주세요
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                <strong className="font-semibold text-[var(--color-fg)]">
                  {email || 'you@proofolio.ai'}
                </strong>{' '}
                로 비밀번호 재설정 링크를 보냈어요. 메일이 도착하지 않으면 스팸함도 확인해 주세요.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-fg-muted)]">
              <p className="font-medium text-[var(--color-fg)]">
                메일이 안 보이나요?
              </p>
              <ul className="list-disc pl-4 text-xs leading-relaxed">
                <li>입력한 이메일 주소가 정확한지 다시 확인해 주세요</li>
                <li>스팸함이나 프로모션 탭을 확인해 주세요</li>
                <li>그래도 안 보이면 5분 후 다시 시도해 주세요</li>
              </ul>
            </div>

            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setSubmitted(false)}
              >
                다른 이메일 사용
              </Button>
              <Link
                to="/login"
                className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand)] px-4 text-sm font-medium text-white hover:bg-[var(--color-brand-hover)]"
              >
                로그인으로
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
