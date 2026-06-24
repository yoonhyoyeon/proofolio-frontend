import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Globe,
  Github,
  Mail,
  Phone,
  Code2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { myPortfolios, portfolioDetails } from '@/lib/mock'

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const meta = myPortfolios.find((p) => p.id === id)
  const detail = id ? portfolioDetails[id] : undefined

  if (!meta || !detail) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-[var(--color-fg-muted)]">
        <p className="text-sm">포트폴리오를 찾을 수 없습니다.</p>
        <Link to="/portfolio" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          목록으로
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-4 w-4" />
          내 포트폴리오
        </Link>
        <div className="flex items-center gap-2">
          <Badge tone={meta.status === 'published' ? 'success' : 'outline'}>
            {meta.status === 'published' ? '공개' : '초안'}
          </Badge>
          <Button variant="outline" size="sm">편집</Button>
        </div>
      </div>

      {/* Header */}
      <header className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-8 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-fg)]">
          {detail.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <ContactItem icon={<Phone className="h-3.5 w-3.5" />} value={detail.phone} />
          <ContactItem icon={<Mail className="h-3.5 w-3.5" />} value={detail.email} />
          <ContactItem
            icon={<Github className="h-3.5 w-3.5" />}
            value={detail.github.replace('https://github.com/', 'github.com/')}
            href={detail.github}
          />
          {detail.homepage && (
            <ContactItem
              icon={<Globe className="h-3.5 w-3.5" />}
              value={detail.homepage.replace('https://', '')}
              href={detail.homepage}
            />
          )}
        </div>
      </header>

      <div className="mt-4 flex flex-col gap-4">
        {/* 자기소개 */}
        <Section icon={<BookOpen className="h-4 w-4" />} title="자기소개">
          <p className="text-sm leading-relaxed text-[var(--color-fg)]">{detail.bio}</p>
        </Section>

        {/* 업무 경험 */}
        {detail.experiences.length > 0 && (
          <Section icon={<Briefcase className="h-4 w-4" />} title="업무 경험">
            <ul className="flex flex-col divide-y divide-[var(--color-border)]">
              {detail.experiences.map((exp, i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-fg)]">{exp.company}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{exp.role}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--color-fg-muted)]">
                    {exp.period}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 프로젝트 */}
        {detail.projects.length > 0 && (
          <Section icon={<Code2 className="h-4 w-4" />} title="프로젝트">
            <ul className="flex flex-col gap-5">
              {detail.projects.map((proj, i) => (
                <li
                  key={i}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-bold tracking-tight text-[var(--color-fg)]">
                      {proj.name}
                    </p>
                    <span className="shrink-0 text-xs tabular-nums text-[var(--color-fg-muted)]">
                      {proj.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{proj.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {proj.stack.map((s) => (
                      <Badge key={s} tone="brand">{s}</Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--color-fg)]">
                    {proj.detail}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 학력 */}
        {detail.educations.length > 0 && (
          <Section icon={<GraduationCap className="h-4 w-4" />} title="학력">
            <ul className="flex flex-col divide-y divide-[var(--color-border)]">
              {detail.educations.map((edu, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-[var(--color-fg)]">{edu.school}</p>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--color-fg-muted)]">
                    {edu.period}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 수상 및 활동 */}
        {detail.activities.length > 0 && (
          <Section icon={<Award className="h-4 w-4" />} title="수상 및 활동">
            <ul className="flex flex-col gap-3">
              {detail.activities.map((act, i) => (
                <li key={i}>
                  <p className="text-sm font-semibold text-[var(--color-fg)]">{act.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-fg-muted)]">
                    {act.description}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 스킬 */}
        {Object.keys(detail.skills).length > 0 && (
          <Section icon={<Code2 className="h-4 w-4" />} title="스킬">
            <ul className="flex flex-col gap-3">
              {Object.entries(detail.skills).map(([category, items]) => (
                <li key={category} className="flex items-start gap-3">
                  <span className="mt-0.5 w-20 shrink-0 text-xs font-semibold text-[var(--color-fg-muted)]">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <Badge key={item} tone="neutral">{item}</Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-6 py-5">
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--color-brand-subtle)] text-[var(--color-brand)]">
          {icon}
        </span>
        <h2 className="text-sm font-bold tracking-tight text-[var(--color-fg)]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ContactItem({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode
  value: string
  href?: string
}) {
  const cls = 'inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]'
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(cls, 'hover:text-[var(--color-brand)]')}>
      {icon}
      {value}
    </a>
  ) : (
    <span className={cls}>
      {icon}
      {value}
    </span>
  )
}
