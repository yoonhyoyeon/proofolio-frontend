import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
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
import { popularCompanies, positions } from '@/lib/mock'

const STEPS = ['PDF 업로드', '직무 선택', '회사 입력', '채용 공고', '면접 모드']

export function InterviewSetupPage() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'practice' | 'real'>('practice')
  const [position, setPosition] = useState('frontend')
  const [company, setCompany] = useState('토스')
  const navigate = useNavigate()

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
              title="PDF 파일을 업로드해 주세요"
              description="이력서·포트폴리오 구분 없이 PDF 파일만 받습니다. 여러 개를 한 번에 올릴 수 있어요. 파일은 면접 종료 후 자동 삭제됩니다."
            >
              <DropZone
                label="PDF 파일"
                hint="PDF · 파일당 최대 25MB · 여러 파일 업로드 가능"
                accept=".pdf"
                multiple
                initialFileNames={['yhy_resume_2026.pdf']}
              />
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
              title="목표하는 회사가 있나요?"
              description="회사명을 입력하면 해당 회사의 면접 스타일을 반영합니다."
              badge="선택사항"
            >
              <div className="flex flex-col gap-4">
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="예: 네이버, 카카오, 토스…"
                  className="h-11 text-base"
                />
                <div className="flex flex-wrap gap-2">
                  {popularCompanies.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCompany(c)}
                      className={
                        'inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ' +
                        (company === c
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                          : 'border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] hover:border-[var(--color-brand)]/40 hover:text-[var(--color-fg)]')
                      }
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </StepWrap>
          )}

          {step === 3 && (
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

          {step === 4 && (
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
            <Button size="md" onClick={next} className="gap-1">
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

        <PreviewBar position={position} company={company} mode={mode} />
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
  company,
  mode,
}: {
  position: string
  company: string
  mode: 'practice' | 'real'
}) {
  const posLabel =
    positions.find((p) => p.value === position)?.label ?? '직무 미선택'
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3 text-xs text-[var(--color-fg-muted)]">
      <span className="font-medium">현재 설정</span>
      <Badge tone="brand">{posLabel}</Badge>
      <Badge tone="neutral">{company || '회사 미정'}</Badge>
      <Badge tone={mode === 'real' ? 'dark' : 'outline'}>
        {mode === 'real' ? '실전 모드' : '연습 모드'}
      </Badge>
    </div>
  )
}
