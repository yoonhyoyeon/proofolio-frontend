import { Check, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface FeedbackBlockProps {
  name: string
  role: string
  initials: string
  accent: string
  strengths: string[]
  weaknesses: string[]
}

export function FeedbackBlock({
  name,
  role,
  initials,
  accent,
  strengths,
  weaknesses,
}: FeedbackBlockProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar initials={initials} size="md" accent={accent} />
          <div>
            <CardTitle>{name}</CardTitle>
            <p className="mt-0.5 text-[11px] text-[var(--color-fg-muted)]">
              {role}
            </p>
          </div>
        </div>
        <Badge tone="brand" size="sm">
          AI 면접관
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" />
            강점
          </div>
          <ul className="space-y-1.5">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-[var(--color-fg)]"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            보완할 점
          </div>
          <ul className="space-y-1.5">
            {weaknesses.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-[var(--color-fg)]"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
