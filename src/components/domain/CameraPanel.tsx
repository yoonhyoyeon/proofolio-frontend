import { Eye, ScanFace } from 'lucide-react'

export function CameraPanel() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-fg)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
          웹캠 분석
        </div>
        <span className="text-[10px] text-[var(--color-fg-muted)]">
          1080p · 24fps
        </span>
      </div>
      <div className="relative aspect-video w-full bg-slate-900">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120px 80px at 50% 42%, rgba(99,102,241,0.35), transparent 60%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          }}
        />

        {/* Face tracking box */}
        <div
          aria-hidden
          className="absolute left-[32%] top-[20%] h-[52%] w-[36%] rounded-[14%/22%] border border-emerald-400/80"
          style={{
            boxShadow: '0 0 0 2px rgba(16,185,129,0.18)',
          }}
        >
          <span className="absolute -left-1.5 -top-1.5 h-2 w-2 rounded-full bg-emerald-400" />
          <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-emerald-400" />
          <span className="absolute -left-1.5 -bottom-1.5 h-2 w-2 rounded-full bg-emerald-400" />
          <span className="absolute -right-1.5 -bottom-1.5 h-2 w-2 rounded-full bg-emerald-400" />
          <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
            <ScanFace className="h-2.5 w-2.5" />
            얼굴 인식
          </span>
        </div>

        {/* Pose body lines */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-70"
          viewBox="0 0 200 120"
          fill="none"
        >
          <circle cx="100" cy="40" r="3" fill="#60A5FA" />
          <circle cx="74" cy="68" r="2.5" fill="#60A5FA" />
          <circle cx="126" cy="68" r="2.5" fill="#60A5FA" />
          <circle cx="60" cy="98" r="2.5" fill="#60A5FA" />
          <circle cx="140" cy="98" r="2.5" fill="#60A5FA" />
          <path
            d="M100 40 L74 68 L60 98 M100 40 L126 68 L140 98 M74 68 L126 68"
            stroke="#60A5FA"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.85"
          />
        </svg>

        {/* Eye contact pulse */}
        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white">
          <Eye className="h-3 w-3" />
          시선 OK
        </div>

        {/* Live HUD timer */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 font-mono text-[10px] text-white">
          12:34
        </div>
      </div>
    </div>
  )
}
