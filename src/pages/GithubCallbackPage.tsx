import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Github, Loader2, AlertCircle } from 'lucide-react'
import { exchangeGithubCode, GITHUB_TOKEN_KEY } from '@/lib/api'
import { useState } from 'react'

type Status = 'loading' | 'error'

export function GithubCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      setErrorMsg('code 또는 state 파라미터가 없습니다.')
      setStatus('error')
      return
    }

    exchangeGithubCode(code, state)
      .then((data) => {
        sessionStorage.setItem(GITHUB_TOKEN_KEY, data.access_token)
        navigate('/portfolio/new', { replace: true })
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : '알 수 없는 오류')
        setStatus('error')
      })
  }, [searchParams, navigate])

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-surface)] p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </span>
        <p className="text-base font-semibold text-[var(--color-fg)]">GitHub 연동에 실패했습니다</p>
        <p className="max-w-sm text-sm text-[var(--color-fg-muted)]">{errorMsg}</p>
        <button
          type="button"
          onClick={() => navigate('/portfolio/new', { replace: true })}
          className="mt-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-surface)] p-8">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white">
        <Github className="h-7 w-7" />
      </span>
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-fg)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        GitHub 계정을 연결하는 중...
      </div>
      <p className="text-xs text-[var(--color-fg-muted)]">잠시만 기다려 주세요.</p>
    </div>
  )
}
