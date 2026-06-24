import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Users, Bot, BarChart3 } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(440px,46%)_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white lg:flex">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(800px 400px at 0% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(700px 380px at 100% 100%, rgba(124,58,237,0.30), transparent 60%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_8px_24px_rgba(99,102,241,0.45)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight">Proofolio</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-300">
                AI Interview
              </span>
            </span>
          </Link>

          <div className="flex flex-col gap-10">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-300" />
                실전 같은 모의면접
              </p>
              <h2 className="mt-5 text-[34px] font-bold leading-[1.2] tracking-tight">
                진짜 면접관처럼,
                <br />
                꼬리 질문과 개입까지.
              </h2>
              <p className="mt-3 max-w-[420px] text-sm leading-relaxed text-slate-300">
                여러 명의 AI 면접관이 이력서·포트폴리오·채용 공고를 읽고,
                답변에 따라 실시간으로 후속 질문을 던집니다.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              <Bullet
                icon={<Users className="h-4 w-4" />}
                title="3인 패널 면접"
                description="시니어 엔지니어 · HR · CTO가 동시에 참여"
              />
              <Bullet
                icon={<Bot className="h-4 w-4" />}
                title="실시간 꼬리 질문"
                description="답변의 빈틈을 파고드는 후속 질문 자동 생성"
              />
              <Bullet
                icon={<BarChart3 className="h-4 w-4" />}
                title="태도 + 답변 동시 평가"
                description="시선·자세·말 속도까지 분석한 면접 리포트"
              />
            </ul>
          </div>

          <div className="relative max-w-[440px] rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <p className="text-sm leading-relaxed text-slate-200">
              “3번 연습한 뒤 진짜 면접에서 처음 받은 질문 80%가 Proofolio에서
              이미 받아본 거였어요. 자신감이 완전히 달랐습니다.”
            </p>
            <p className="mt-3 text-[11px] font-medium text-slate-400">
              김OO · 토스 프론트엔드 합격자
            </p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-10">
        {/* Mobile-only logo */}
        <Link
          to="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-bold tracking-tight text-[var(--color-fg)] lg:hidden"
        >
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          Proofolio
        </Link>

        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  )
}

function Bullet({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-white/[0.06] text-indigo-200 ring-1 ring-white/10">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </li>
  )
}
