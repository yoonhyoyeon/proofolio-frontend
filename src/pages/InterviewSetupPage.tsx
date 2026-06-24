import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, FileText, Github, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { WizardStepper } from '@/components/domain/WizardStepper'
import { DropZone } from '@/components/domain/DropZone'
import { ModeCard } from '@/components/domain/ModeCard'
import { myPortfolios, positions } from '@/lib/mock'

const STEPS = ['포트폴리오 선택', '직무 선택', '채용 공고', '면접 모드']

export function InterviewSetupPage() {
  const [step, setStep] = useState(0)
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([])
  const [mode, setMode] = useState<'practice' | 'real'>('practice')
  const [position, setPosition] = useState('frontend')
  const navigate = useNavigate()

  const togglePortfolio = (id: string) =>
    setSelectedPortfolios((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const canGoNext = step === 0 ? selectedPortfolios.length > 0 : true

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const prev = () => setStep((s) => Math.max(0, s - 1))
  const start = () => navigate(`/interview/check?mode=${mode}`)

  return (
    <>
      <PageHeader
        title="새 면접 만들기"
        description="이력서와 직무 정보를 입력하면, AI 면접관이 맞춤 질문을 준비합니다."
      />

      <Card className="w-full">
        <div className="border-b border-[var(--color-border)] px-8 py-6">
          <WizardStepper steps={STEPS} current={step} />
        </div>

        <CardContent className="min-h-[420px] px-8 py-8">
          {step === 0 && (
            <StepWrap
              title="포트폴리오를 선택해 주세요"
              description="저장된 포트폴리오를 하나 이상 선택하면 AI 면접관이 내용을 분석해 맞춤 질문을 준비합니다."
            >
              <div className="flex flex-col gap-3">
                {myPortfolios.map((pf) => {
                  const selected = selectedPortfolios.includes(pf.id)
                  return (
                    <button
                      key={pf.id}
                      type="button"
                      onClick={() => togglePortfolio(pf.id)}
                      className={
                        'flex items-center gap-4 rounded-[var(--radius-md)] border p-4 text-left transition-colors ' +
                        (selected
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
                          : 'border-[var(--color-border)] bg-white hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-surface)]')
                      }
                    >
                      <span
                        className={
                          'grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors ' +
                          (selected
                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                            : 'border-[var(--color-border)] bg-white')
                        }
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                      <span
                        className={
                          'grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] ' +
                          (pf.source === 'github'
                            ? 'bg-slate-900 text-white'
                            : 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]')
                        }
                      >
                        {pf.source === 'github' ? (
                          <Github className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[var(--color-fg)]">
                            {pf.title}
                          </p>
                          <Badge tone={pf.source === 'github' ? 'neutral' : 'outline'} className="shrink-0">
                            {pf.source === 'github' ? 'GitHub' : 'PDF'}
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[var(--color-fg-muted)]">
                          {pf.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-[var(--color-fg-subtle)]">
                        {pf.updatedAt}
                      </span>
                    </button>
                  )
                })}
              </div>
            </StepWrap>
          )}

          {step === 1 && (
            <StepWrap
              title="어떤 직무로 면접을 진행할까요?"
              description="선택한 직무에 맞춰 면접관의 질문 영역이 달라집니다."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {positions.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPosition(p.value)}
                    className={
                      'rounded-[var(--radius-md)] border p-4 text-left transition-colors ' +
                      (position === p.value
                        ? 'border-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-surface)]')
                    }
                  >
                    <p className="text-sm font-semibold text-[var(--color-fg)]">
                      {p.label}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                      {p.detail}
                    </p>
                  </button>
                ))}
              </div>
            </StepWrap>
          )}

          {step === 2 && (
            <StepWrap
              title="채용 공고 정보를 입력해 주세요"
              description="공고의 자격요건/우대사항을 기반으로 면접 질문이 만들어집니다."
            >
              <Tabs defaultValue="url">
                <TabsList>
                  <TabsTrigger value="url">URL 붙여넣기</TabsTrigger>
                  <TabsTrigger value="pdf">PDF 업로드</TabsTrigger>
                  <TabsTrigger value="text">텍스트 직접 입력</TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                  <Input
                    placeholder="https://career.example.com/jobs/1234"
                    className="h-11"
                  />
                  <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                    공개된 채용 페이지 URL을 입력해 주세요.
                  </p>
                </TabsContent>
                <TabsContent value="pdf">
                  <DropZone
                    label="채용 공고 PDF"
                    hint="PDF · 최대 10MB"
                    accept=".pdf"
                  />
                </TabsContent>
                <TabsContent value="text">
                  <Textarea
                    placeholder="채용 공고의 자격요건, 우대사항, 주요 업무를 붙여넣어 주세요."
                    className="min-h-[180px]"
                  />
                </TabsContent>
              </Tabs>
            </StepWrap>
          )}

          {step === 3 && (
            <StepWrap
              title="어떤 분위기로 면접을 볼까요?"
              description="모드는 면접 시작 후 변경할 수 없습니다."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ModeCard
                  mode="practice"
                  selected={mode === 'practice'}
                  onSelect={() => setMode('practice')}
                  badge={
                    <Badge tone="brand" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      추천
                    </Badge>
                  }
                  features={[
                    { label: '실시간 태도 점수', included: true },
                    { label: '카메라 + 자세 분석', included: true },
                    { label: '실시간 피드백 메시지', included: true },
                    { label: '면접 종료 후 최종 리포트', included: true },
                  ]}
                />
                <ModeCard
                  mode="real"
                  selected={mode === 'real'}
                  onSelect={() => setMode('real')}
                  features={[
                    { label: '실시간 피드백 없음', included: true },
                    { label: '점수 비공개', included: true },
                    { label: '카메라 인디케이터 없음', included: true },
                    { label: '면접 종료 후 최종 리포트만', included: true },
                  ]}
                />
              </div>
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
            <Button size="md" onClick={next} disabled={!canGoNext} className="gap-1">
              다음
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="md" onClick={start} className="gap-1">
              <Sparkles className="h-4 w-4" />
              면접 시작하기
            </Button>
          )}
        </div>

        <PreviewBar position={position} mode={mode} />
      </Card>

      <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
        취소하고{' '}
        <Link to="/" className="underline-offset-4 hover:underline">
          대시보드로 돌아가기
        </Link>
      </p>
    </>
  )
}

function StepWrap({
  title,
  description,
  badge,
  children,
}: {
  title: string
  description: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight text-[var(--color-fg)]">
            {title}
          </h2>
          {badge ? <Badge tone="outline">{badge}</Badge> : null}
        </div>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

function PreviewBar({
  position,
  mode,
}: {
  position: string
  mode: 'practice' | 'real'
}) {
  const posLabel =
    positions.find((p) => p.value === position)?.label ?? '직무 미선택'
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3 text-xs text-[var(--color-fg-muted)]">
      <span className="font-medium">현재 설정</span>
      <Badge tone="brand">{posLabel}</Badge>
      <Badge tone={mode === 'real' ? 'dark' : 'outline'}>
        {mode === 'real' ? '실전 모드' : '연습 모드'}
      </Badge>
    </div>
  )
}
