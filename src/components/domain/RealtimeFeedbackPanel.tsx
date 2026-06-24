import { AlertTriangle, Info } from 'lucide-react'
import { realtimeFeedback } from '@/lib/mock'

export function RealtimeFeedbackPanel() {
  return (
    <ul className="flex flex-col gap-2">
      {realtimeFeedback.map((f) => {
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
            <div>
              <p
                className={
                  'text-xs font-semibold ' +
                  (isWarning ? 'text-amber-900' : 'text-sky-900')
                }
              >
                {f.title}
              </p>
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
