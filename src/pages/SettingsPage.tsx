import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Lock, Bell, LogOut } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import { currentUser } from '@/lib/mock'

type Section = 'profile' | 'password' | 'notification' | 'logout'

const sections = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'password', label: '비밀번호', icon: Lock },
  { id: 'notification', label: '알림', icon: Bell },
  { id: 'logout', label: '로그아웃', icon: LogOut, danger: true },
] as const

export function SettingsPage() {
  const [active, setActive] = useState<Section>('profile')

  return (
    <>
      <PageHeader
        title="설정"
        description="프로필과 알림 설정을 관리할 수 있어요."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-0.5">
          {sections.map((s) => {
            const Icon = s.icon
            const isActive = active === s.id
            const danger = 'danger' in s && s.danger
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id as Section)}
                className={cn(
                  'flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
                  isActive && !danger
                    ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                    : danger
                      ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]'
                      : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]',
                )}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </button>
            )
          })}
        </nav>

        <div>
          {active === 'profile' && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>프로필</CardTitle>
                  <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                    면접관과 리포트에 표시되는 프로필 정보입니다.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar
                    initials={currentUser.initials}
                    size="xl"
                    accent="from-indigo-500 to-blue-500"
                  />
                  <div className="flex flex-col gap-1.5">
                    <Button variant="outline" size="sm">
                      이미지 변경
                    </Button>
                    <p className="text-[11px] text-[var(--color-fg-subtle)]">
                      JPG/PNG · 최대 2MB
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="이름">
                    <Input defaultValue={currentUser.name} />
                  </Field>
                  <Field label="이메일">
                    <Input
                      type="email"
                      defaultValue={currentUser.email}
                      readOnly
                    />
                  </Field>
                  <Field label="직무" className="md:col-span-2">
                    <Input defaultValue={currentUser.role} />
                  </Field>
                  <Field label="자기소개" className="md:col-span-2">
                    <Textarea
                      placeholder="간단한 자기소개를 작성하면 AI가 더 자연스러운 질문을 생성합니다."
                      defaultValue="실시간 협업 도구와 디자인 시스템에 관심이 많은 3년차 프론트엔드 개발자입니다."
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="md">
                    취소
                  </Button>
                  <Button size="md">저장</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === 'password' && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>비밀번호 변경</CardTitle>
                  <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                    안전을 위해 6개월에 한 번씩 변경을 권장해요.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="max-w-md space-y-4">
                <Field label="현재 비밀번호">
                  <Input type="password" placeholder="••••••••" />
                </Field>
                <Field label="새 비밀번호">
                  <Input type="password" placeholder="8자 이상, 영문/숫자/특수문자 조합" />
                </Field>
                <Field label="새 비밀번호 확인">
                  <Input type="password" placeholder="다시 한 번 입력" />
                </Field>
                <Button size="md" className="w-full md:w-auto">
                  변경 저장
                </Button>
              </CardContent>
            </Card>
          )}

          {active === 'notification' && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>알림 설정</CardTitle>
                  <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                    어떤 상황에 알림을 받을지 선택하세요.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-[var(--color-border)]">
                <NotificationRow
                  title="이메일 알림"
                  description="중요한 업데이트를 이메일로 받습니다."
                  defaultChecked
                />
                <NotificationRow
                  title="리포트 완성 알림"
                  description="면접 분석 리포트가 준비되면 알려드려요."
                  defaultChecked
                />
                <NotificationRow
                  title="주간 인사이트 다이제스트"
                  description="매주 월요일, 주간 면접 인사이트 요약."
                  defaultChecked={false}
                />
                <NotificationRow
                  title="마케팅 소식"
                  description="새로운 기능과 이벤트 소식."
                  defaultChecked={false}
                />
              </CardContent>
            </Card>
          )}

          {active === 'logout' && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>로그아웃</CardTitle>
                  <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                    현재 기기에서 로그아웃합니다. 진행 중인 면접은 종료돼요.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  to="/login"
                  className={buttonVariants({
                    variant: 'dangerOutline',
                    size: 'md',
                  })}
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-[var(--color-fg-muted)]">
        {label}
      </span>
      {children}
    </label>
  )
}

function NotificationRow({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-fg)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
          {description}
        </p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}
