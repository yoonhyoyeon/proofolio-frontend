import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Check,
  Github,
  GitFork,
  Globe,
  GraduationCap,
  Loader2,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { WizardStepper } from '@/components/domain/WizardStepper'
import { githubOssContributions, githubProfile } from '@/lib/mock'
import {
  getGithubLoginUrl,
  getGithubRepos,
  GITHUB_TOKEN_KEY,
  type GithubRepo,
} from '@/lib/api'

const STEPS = ['GitHub 연동', '프로젝트 선택', '추가 정보 입력']

type Experience = { id: string; company: string; role: string; period: string }
type Education = { id: string; school: string; period: string }
type Activity = { id: string; title: string; description: string }

const langColor: Record<string, string> = {
  TypeScript: 'bg-sky-500',
  Python: 'bg-amber-500',
  Shell: 'bg-slate-500',
  JavaScript: 'bg-yellow-400',
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function PortfolioBuilderPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  // GitHub OAuth
  const [ghConnected, setGhConnected] = useState(false)
  const [ghLoading, setGhLoading] = useState(false)
  const [ghError, setGhError] = useState('')

  // Repos (real API replaces mock after connect)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(false)

  // Project pick
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [repoSearch, setRepoSearch] = useState('')

  // On mount: check if already connected (returned from OAuth callback)
  useEffect(() => {
    const token = sessionStorage.getItem(GITHUB_TOKEN_KEY)
    if (!token) return
    setGhConnected(true)
    setReposLoading(true)
    getGithubRepos(token)
      .then(setRepos)
      .catch(() => {
        // Token expired or invalid — clear and show connect again
        sessionStorage.removeItem(GITHUB_TOKEN_KEY)
        setGhConnected(false)
      })
      .finally(() => setReposLoading(false))
  }, [])

  // Step 2 inputs (4, 7, 9, 10)
  const [homepage, setHomepage] = useState('')
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: newId(), company: '', role: '', period: '' },
  ])
  const [educations, setEducations] = useState<Education[]>([
    { id: newId(), school: '', period: '' },
  ])
  const [activities, setActivities] = useState<Activity[]>([
    { id: newId(), title: '', description: '' },
  ])

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(repoSearch.toLowerCase()),
  )

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const prev = () => setStep((s) => Math.max(0, s - 1))

  const connectGithub = async () => {
    setGhLoading(true)
    setGhError('')
    try {
      const { url } = await getGithubLoginUrl()
      window.location.href = url
    } catch {
      setGhError('GitHub 로그인 URL을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      setGhLoading(false)
    }
  }

  const toggleRepo = (id: string) =>
    setSelectedRepos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const canGoNext =
    (step === 0 && ghConnected) ||
    (step === 1 && selectedRepos.length > 0) ||
    step === 2

  return (
    <>
      <PageHeader
        title="GitHub로 포트폴리오 자동 생성"
        description="계정 정보·GitHub에서 자동으로 채워지지 않는 항목만 입력하시면 됩니다."
      />

      <Card className="w-full">
        <div className="border-b border-[var(--color-border)] px-8 py-6">
          <WizardStepper steps={STEPS} current={step} />
        </div>

        <CardContent className="min-h-[460px] px-8 py-8">
          {step === 0 && (
            <StepWrap
              title="GitHub 계정을 연결해 주세요"
              description="공개 저장소뿐 아니라 비공개 저장소까지 불러올 수 있습니다."
            >
              <GithubConnectPanel
                connected={ghConnected}
                loading={ghLoading}
                reposCount={repos.length}
                reposLoading={reposLoading}
                error={ghError}
                onConnect={connectGithub}
              />
            </StepWrap>
          )}

          {step === 1 && (
            <StepWrap
              title="포트폴리오에 담을 저장소를 골라주세요"
              description={
                reposLoading
                  ? '저장소를 불러오는 중입니다...'
                  : `${selectedRepos.length}개 선택됨 · 비공개 저장소도 함께 표시됩니다.`
              }
            >
              <div className="flex flex-col gap-3">
                {reposLoading ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--color-fg-muted)]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    저장소 불러오는 중...
                  </div>
                ) : (
                <>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]" />
                  <Input
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    placeholder="저장소 이름으로 검색..."
                    className="h-10 pl-9"
                  />
                </div>
                <ul className="flex flex-col gap-2">
                  {filteredRepos.map((repo) => {
                    const selected = selectedRepos.includes(repo.id)
                    const isPrivate = repo.visibility === 'private'
                    return (
                      <li key={repo.id}>
                        <button
                          type="button"
                          onClick={() => toggleRepo(repo.id)}
                          className={cn(
                            'flex w-full items-start gap-3 rounded-[var(--radius-md)] border p-4 text-left transition-colors',
                            selected
                              ? 'border-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
                              : 'border-[var(--color-border)] hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-surface)]',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors',
                              selected
                                ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                                : 'border-[var(--color-border)] bg-white',
                            )}
                          >
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <Github className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" />
                              <p className="text-sm font-semibold text-[var(--color-fg)]">
                                {repo.name}
                              </p>
                              {isPrivate ? (
                                <Badge tone="warning" size="sm" className="gap-1">
                                  <Lock className="h-2.5 w-2.5" />
                                  Private
                                </Badge>
                              ) : (
                                <Badge tone="outline" size="sm" className="gap-1">
                                  <Globe className="h-2.5 w-2.5" />
                                  Public
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                              {repo.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[var(--color-fg-muted)]">
                              <span className="inline-flex items-center gap-1">
                                <span
                                  className={cn(
                                    'h-2 w-2 rounded-full',
                                    langColor[repo.language] ?? 'bg-slate-400',
                                  )}
                                />
                                {repo.language}
                              </span>
                              {!isPrivate && (
                                <>
                                  <span className="inline-flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {repo.stars}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <GitFork className="h-3 w-3" />
                                    {repo.forks}
                                  </span>
                                </>
                              )}
                              <span>업데이트 {repo.updatedAt}</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                </>
                )}
              </div>
            </StepWrap>
          )}

          {step === 2 && (
            <StepWrap
              title="추가 정보를 입력해 주세요"
              description="계정·GitHub에서 가져올 수 없는 항목만 직접 채워주시면 됩니다."
            >
              <FormSection
                icon={<Globe className="h-4 w-4" />}
                title="홈페이지"
                description="개인 블로그·웹사이트 URL이 있다면 입력하세요."
                badge="선택"
              >
                <Input
                  value={homepage}
                  onChange={(e) => setHomepage(e.target.value)}
                  placeholder="https://example.com"
                />
              </FormSection>

              <FormSection
                icon={<Building2 className="h-4 w-4" />}
                title="업무 경험"
                description="회사 / 직무 / 기간 순서로 입력해 주세요."
              >
                <ExperienceList items={experiences} onChange={setExperiences} />
              </FormSection>

              <FormSection
                icon={<GraduationCap className="h-4 w-4" />}
                title="학력"
                description="학교명과 재학 기간을 입력해 주세요."
              >
                <EducationList items={educations} onChange={setEducations} />
              </FormSection>

              <FormSection
                icon={<Award className="h-4 w-4" />}
                title="수상 및 활동"
                description="수상 내역·블로그 글·강연 등 GitHub에서 자동 추출되지 않는 항목."
              >
                <ActivityList items={activities} onChange={setActivities} />
                {githubOssContributions.length > 0 && (
                  <div className="mt-3 rounded-[var(--radius-md)] border border-indigo-200 bg-indigo-50/60 px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-900">
                      <Sparkles className="h-3 w-3" />
                      GitHub에서 자동 추출된 오픈소스 기여
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {githubOssContributions.map((c) => (
                        <li
                          key={c.id}
                          className="text-[11px] text-indigo-800/90"
                        >
                          <span className="font-mono">{c.repo}</span> —{' '}
                          {c.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </FormSection>
            </StepWrap>
          )}

        </CardContent>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-8 py-5">
          <Button
            variant="ghost"
            size="md"
            onClick={prev}
            disabled={step === 0}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            이전
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              size="md"
              onClick={next}
              disabled={!canGoNext}
              className="gap-1"
            >
              다음
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="md"
              onClick={() => navigate('/portfolio')}
              className="gap-1"
            >
              <Sparkles className="h-4 w-4" />
              포트폴리오 생성
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
        취소하고{' '}
        <Link to="/portfolio" className="underline-offset-4 hover:underline">
          포트폴리오 목록으로 돌아가기
        </Link>
      </p>
    </>
  )
}

function StepWrap({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[var(--color-fg)]">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

function GithubConnectPanel({
  connected,
  loading,
  reposCount,
  reposLoading,
  error,
  onConnect,
}: {
  connected: boolean
  loading: boolean
  reposCount: number
  reposLoading: boolean
  error: string
  onConnect: () => void
}) {
  if (connected) {
    return (
      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50/60 p-5">
        <div className="flex items-center gap-3">
          <Avatar
            initials="GH"
            size="md"
            accent="from-slate-700 to-slate-900"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[var(--color-fg)]">
                @{githubProfile.username}
              </p>
              <Badge tone="success" className="gap-1">
                <Check className="h-3 w-3" />
                연결됨
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-fg-muted)]">
              공개·비공개 저장소 접근 권한이 부여되었습니다.
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 text-xs text-[var(--color-fg-muted)] md:grid-cols-2">
          <li className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            저장소 메타데이터 (read-only)
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            {reposLoading ? '저장소 불러오는 중...' : `비공개 레포 포함 (${reposCount}개 감지)`}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            자기소개·스킬·오픈소스 기여 자동 추출
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            언제든 설정에서 연결 해제 가능
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white">
          <Github className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-[var(--color-fg)]">
            GitHub로 로그인
          </p>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            OAuth로 안전하게 연결됩니다. 비밀번호는 저장하지 않으며, 저장소
            메타데이터 읽기 권한만 사용합니다.
          </p>
        </div>
        <Button
          variant="dark"
          size="lg"
          onClick={onConnect}
          disabled={loading}
          className="w-full gap-2 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              GitHub 페이지로 이동 중...
            </>
          ) : (
            <>
              <Github className="h-4 w-4" />
              GitHub로 로그인하고 저장소 불러오기
            </>
          )}
        </Button>
        {error && (
          <p className="text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-xs text-indigo-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">비공개 저장소도 안전하게 반영</p>
          <p className="mt-0.5 text-indigo-800/90">
            GitHub OAuth의 <code className="font-mono">repo</code> 스코프로 비공개
            레포까지 가져오며, 코드 내용은 저장하지 않고 메타데이터만 분석합니다.
          </p>
        </div>
      </div>
    </div>
  )
}


function FormSection({
  icon,
  title,
  description,
  badge,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-brand-subtle)] text-[var(--color-brand)]">
          {icon}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[var(--color-fg)]">{title}</h3>
            {badge && <Badge tone="outline">{badge}</Badge>}
          </div>
          <p className="text-xs text-[var(--color-fg-muted)]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function ExperienceList({
  items,
  onChange,
}: {
  items: Experience[]
  onChange: (next: Experience[]) => void
}) {
  const update = (id: string, patch: Partial<Experience>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))
  const add = () =>
    onChange([...items, { id: newId(), company: '', role: '', period: '' }])

  return (
    <div className="flex flex-col gap-2">
      {items.map((exp) => (
        <div
          key={exp.id}
          className="grid grid-cols-12 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3"
        >
          <Input
            value={exp.company}
            onChange={(e) => update(exp.id, { company: e.target.value })}
            placeholder="회사 이름"
            className="col-span-12 h-9 md:col-span-4"
          />
          <Input
            value={exp.role}
            onChange={(e) => update(exp.id, { role: e.target.value })}
            placeholder="직무 (예: 프론트엔드 개발자)"
            className="col-span-12 h-9 md:col-span-4"
          />
          <Input
            value={exp.period}
            onChange={(e) => update(exp.id, { period: e.target.value })}
            placeholder="2024.01 ~ 현재"
            className="col-span-10 h-9 md:col-span-3"
          />
          <button
            type="button"
            onClick={() => remove(exp.id)}
            className="col-span-2 inline-flex h-9 items-center justify-center rounded-md text-[var(--color-fg-subtle)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)] md:col-span-1"
            aria-label="삭제"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <AddRowButton label="업무 경험 추가" onClick={add} />
    </div>
  )
}

function EducationList({
  items,
  onChange,
}: {
  items: Education[]
  onChange: (next: Education[]) => void
}) {
  const update = (id: string, patch: Partial<Education>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))
  const add = () =>
    onChange([...items, { id: newId(), school: '', period: '' }])

  return (
    <div className="flex flex-col gap-2">
      {items.map((edu) => (
        <div
          key={edu.id}
          className="grid grid-cols-12 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3"
        >
          <Input
            value={edu.school}
            onChange={(e) => update(edu.id, { school: e.target.value })}
            placeholder="학교 이름 (전공 포함)"
            className="col-span-12 h-9 md:col-span-7"
          />
          <Input
            value={edu.period}
            onChange={(e) => update(edu.id, { period: e.target.value })}
            placeholder="2020.03 ~ 2024.02"
            className="col-span-10 h-9 md:col-span-4"
          />
          <button
            type="button"
            onClick={() => remove(edu.id)}
            className="col-span-2 inline-flex h-9 items-center justify-center rounded-md text-[var(--color-fg-subtle)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)] md:col-span-1"
            aria-label="삭제"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <AddRowButton label="학력 추가" onClick={add} />
    </div>
  )
}

function ActivityList({
  items,
  onChange,
}: {
  items: Activity[]
  onChange: (next: Activity[]) => void
}) {
  const update = (id: string, patch: Partial<Activity>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id))
  const add = () =>
    onChange([...items, { id: newId(), title: '', description: '' }])

  return (
    <div className="flex flex-col gap-2">
      {items.map((act) => (
        <div
          key={act.id}
          className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3"
        >
          <div className="flex items-center gap-2">
            <Input
              value={act.title}
              onChange={(e) => update(act.id, { title: e.target.value })}
              placeholder="제목 (예: 2025 우아콘 발표)"
              className="h-9 flex-1"
            />
            <button
              type="button"
              onClick={() => remove(act.id)}
              className="grid h-9 w-9 place-items-center rounded-md text-[var(--color-fg-subtle)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)]"
              aria-label="삭제"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Textarea
            value={act.description}
            onChange={(e) => update(act.id, { description: e.target.value })}
            placeholder="간단한 설명, 링크 등"
            className="min-h-[60px]"
          />
        </div>
      ))}
      <AddRowButton label="항목 추가" onClick={add} />
    </div>
  )
}

function AddRowButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-1 rounded-full border border-dashed border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-fg-muted)] hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand)]"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

