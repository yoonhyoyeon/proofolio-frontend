import { AlertTriangle, Info, ScanFace, AudioLines } from 'lucide-react'
import { realtimeFeedback } from '@/lib/mock'
import type { FeedbackItem } from '@/lib/feedback'

export function RealtimeFeedbackPanel({ items }: { items?: FeedbackItem[] }) {
  const list: FeedbackItem[] = items ?? realtimeFeedback

  if (list.length === 0) {
    return (
      <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-3 py-4 text-center text-[11px] text-[var(--color-fg-subtle)]">
        피드백을 분석하는 중입니다...
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {list.map((f) => {
        const isWarning = f.severity === 'warning'
        return (
          <li
            key={f.id}
            className={
              'flex items-start gap-2.5 rounded-[var(--radius-md)] border p-3 ' +
              (isWarning
                ? 'border-amber-200 bg-amber-50/70'
                : 'border-sky-200 bg-sky-50/70')
            }
          >
            <span
              className={
                'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ' +
                (isWarning
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-sky-100 text-sky-700')
              }
            >
              {isWarning ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Info className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {f.source && (
                  <span
                    className={
                      'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ' +
                      (f.source === 'posture'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-violet-100 text-violet-700')
                    }
                  >
                    {f.source === 'posture' ? (
                      <ScanFace className="h-2.5 w-2.5" />
                    ) : (
                      <AudioLines className="h-2.5 w-2.5" />
                    )}
                    {f.source === 'posture' ? '자세' : '음성'}
                  </span>
                )}
                <p
                  className={
                    'truncate text-xs font-semibold ' +
                    (isWarning ? 'text-amber-900' : 'text-sky-900')
                  }
                >
                  {f.title}
                </p>
              </div>
              <p
                className={
                  'mt-0.5 text-[11px] leading-relaxed ' +
                  (isWarning ? 'text-amber-800/90' : 'text-sky-800/90')
                }
              >
                {f.detail}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
