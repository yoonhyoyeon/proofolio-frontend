import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mic,
  MicOff,
  PersonStanding,
  PhoneOff,
  ScanFace,
  Sparkles,
  VideoOff,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  PoseMeshOverlay,
  type OverlayLayers,
  type LiveMetrics,
} from '@/components/domain/PoseMeshOverlay'
import { RealtimeFeedbackPanel } from '@/components/domain/RealtimeFeedbackPanel'
import { LiveScoreGrid, type LiveScoreItem } from '@/components/domain/LiveScoreGrid'
import { interviewers, interviewMeta, currentUser } from '@/lib/mock'
import { useInterviewAudio, type ConnectionStatus } from '@/hooks/useInterviewAudio'

export function InterviewRoomPage() {
  const [params] = useSearchParams()
  const mode: 'practice' | 'real' =
    params.get('mode') === 'real' ? 'real' : 'practice'
  const navigate = useNavigate()
  const isReal = mode === 'real'

  const activeInterviewerId = 'sr-eng'

  // Elapsed timer
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const elapsedLabel = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`

  const { status, micOn, toggleMic, transcriptText } = useInterviewAudio()

  // Live vision metrics from the MediaPipe overlay
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null)
  const liveScores: LiveScoreItem[] | undefined = metrics
    ? [
        { label: '정면 응시', value: Math.round(metrics.gaze), color: 'indigo' },
        { label: '자세 안정성', value: Math.round(metrics.posture), color: 'sky' },
        { label: '움직임 안정', value: Math.round(metrics.stability), color: 'violet' },
        { label: '종합 자신감', value: Math.round(metrics.confidence), color: 'emerald' },
      ]
    : undefined

  return (
    <div className="flex h-screen w-full flex-col bg-[#0b0f19] text-slate-100">
      <RoomHeader
        mode={mode}
        elapsed={elapsedLabel}
        connectionStatus={status}
        onExit={() => navigate('/reports')}
      />

      <div className="flex flex-1 min-h-0">
        {/* Video stage */}
        <div className="flex flex-1 min-w-0 flex-col gap-3 p-4">
          {/* Top: 3 interviewer tiles */}
          <section className="grid grid-cols-3 gap-3" style={{ height: '22%', minHeight: 132 }}>
            {interviewers.map((it) => (
              <InterviewerTile
                key={it.id}
                name={it.name}
                roleKo={it.roleKo}
                initials={it.initials}
                accent={it.accent}
                active={it.id === activeInterviewerId}
              />
            ))}
          </section>

          {/* Middle: my video */}
          <section className="flex-1 min-h-0">
            <MyVideoTile
              name={currentUser.name}
              initials={currentUser.initials}
              isReal={isReal}
              micOn={micOn}
              onToggleMic={toggleMic}
              onMetrics={setMetrics}
            />
          </section>

          {/* Bottom: STT live caption */}
          <section>
            <SpeechCaptionBar
              text={transcriptText || '음성을 인식 중입니다...'}
              elapsed={elapsedLabel}
              micOn={micOn}
            />
          </section>
        </div>

        {/* Right side bar — practice mode only */}
        {!isReal && (
          <aside className="hidden w-[340px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/10 bg-white px-5 py-5 text-[var(--color-fg)] lg:flex">
            <SidePanelSection title="실시간 피드백" badge="4 new">
              <RealtimeFeedbackPanel />
            </SidePanelSection>
            <SidePanelSection title="실시간 점수" badge={metrics ? 'LIVE' : undefined}>
              <LiveScoreGrid scores={liveScores} />
            </SidePanelSection>
          </aside>
        )}
      </div>
    </div>
  )
}

function RoomHeader({
  mode,
  elapsed,
  connectionStatus,
  onExit,
}: {
  mode: 'practice' | 'real'
  elapsed: string
  connectionStatus: ConnectionStatus
  onExit: () => void
}) {
  const isReal = mode === 'real'
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0f19]/95 px-6 py-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-white"
        >
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          Proofolio
        </Link>
        <Badge
          tone="dark"
          className={
            isReal
              ? 'border-rose-500/30 bg-rose-500/15 text-rose-300'
              : 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300'
          }
        >
          {isReal ? '실전 모드' : '연습 모드'}
        </Badge>
        <Badge tone="dark" className="border-slate-700 bg-slate-800/70 text-slate-300">
          {interviewMeta.company} · {interviewMeta.position}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Socket connection status */}
        <ConnectionPill status={connectionStatus} />

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
          REC · {elapsed}
        </span>
        <Button variant="danger" size="sm" className="gap-1" onClick={onExit}>
          <PhoneOff className="h-3.5 w-3.5" />
          면접 종료
        </Button>
      </div>
    </header>
  )
}

function ConnectionPill({ status }: { status: ConnectionStatus }) {
  const config = {
    connecting: { label: '연결 중...', color: 'text-slate-400', icon: <Wifi className="h-3 w-3 animate-pulse" /> },
    connected: { label: '연결됨', color: 'text-emerald-400', icon: <Wifi className="h-3 w-3" /> },
    disconnected: { label: '연결 끊김', color: 'text-rose-400', icon: <WifiOff className="h-3 w-3" /> },
    error: { label: '오류', color: 'text-rose-400', icon: <WifiOff className="h-3 w-3" /> },
  }[status]

  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium', config.color)}>
      {config.icon}
      {config.label}
    </span>
  )
}

function InterviewerTile({
  name,
  roleKo,
  initials,
  accent,
  active,
}: {
  name: string
  roleKo: string
  initials: string
  accent: string
  active?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] border bg-slate-900',
        active
          ? 'border-indigo-400 ring-2 ring-indigo-500/50'
          : 'border-white/10',
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(140px 100px at 50% 45%, rgba(99,102,241,0.30), transparent 65%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        }}
      />
      <div className="relative flex h-full w-full items-center justify-center">
        <Avatar initials={initials} size="lg" accent={accent} />
      </div>
      {active && (
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-indigo-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
          Speaking
        </span>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
        <Mic className="h-3 w-3 text-emerald-400" />
        <span className="truncate">
          {name}
          <span className="ml-1 text-[10px] text-slate-400">{roleKo}</span>
        </span>
      </div>
    </div>
  )
}

function MyVideoTile({
  name,
  initials,
  isReal,
  micOn,
  onToggleMic,
  onMetrics,
}: {
  name: string
  initials: string
  isReal: boolean
  micOn: boolean
  onToggleMic: () => void
  onMetrics?: (metrics: LiveMetrics) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [camReady, setCamReady] = useState(false)
  const [camError, setCamError] = useState(false)
  const [layers, setLayers] = useState<OverlayLayers>({ mesh: true, skeleton: true })
  const [overlayStatus, setOverlayStatus] =
    useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setCamReady(true)
      } catch {
        if (!cancelled) setCamError(true)
      }
    })()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Real-time vision analysis is a practice-mode-only feature
  const analysisOn = !isReal
  const overlayActive = analysisOn && (layers.mesh || layers.skeleton)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-slate-950 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(280px 200px at 50% 45%, rgba(99,102,241,0.30), transparent 65%), linear-gradient(180deg, #0b1220 0%, #1e293b 100%)',
        }}
      />

      {/* Live camera feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          !camReady && 'invisible',
        )}
      />

      {/* Camera unavailable → fallback avatar */}
      {!camReady && (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
          {camError ? (
            <>
              <VideoOff className="h-10 w-10 text-slate-500" />
              <p className="text-sm font-medium text-slate-400">
                카메라를 사용할 수 없습니다
              </p>
            </>
          ) : (
            <Avatar initials={initials} size="xl" accent="from-indigo-500 to-violet-500" />
          )}
        </div>
      )}

      {/* MediaPipe face mesh + pose skeleton overlay — practice mode only */}
      {camReady && analysisOn && (
        <PoseMeshOverlay
          videoRef={videoRef}
          active={overlayActive}
          layers={layers}
          onStatusChange={setOverlayStatus}
          onMetrics={onMetrics}
        />
      )}

      {/* Layer toggles + AI status — practice mode only */}
      {camReady && analysisOn && (
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <LayerChip
              active={layers.mesh}
              onClick={() => setLayers(l => ({ ...l, mesh: !l.mesh }))}
              icon={<ScanFace className="h-3 w-3" />}
              label="얼굴 메쉬"
            />
            <LayerChip
              active={layers.skeleton}
              onClick={() => setLayers(l => ({ ...l, skeleton: !l.skeleton }))}
              icon={<PersonStanding className="h-3 w-3" />}
              label="스켈레톤"
            />
          </div>
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold backdrop-blur',
              overlayStatus === 'ready' && 'text-emerald-300',
              overlayStatus === 'loading' && 'text-slate-300',
              overlayStatus === 'error' && 'text-rose-300',
            )}
          >
            {overlayStatus === 'ready' && (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                AI 분석 중
              </>
            )}
            {overlayStatus === 'loading' && (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-600 border-t-slate-300" />
                모델 로딩 중...
              </>
            )}
            {overlayStatus === 'error' && '모델 로드 실패'}
          </span>
        </div>
      )}

      {/* Practice-mode label (real mesh replaces the old fake overlay) */}
      {!isReal && camReady && (
        <div className="absolute left-3 bottom-14 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-indigo-200 backdrop-blur">
          <Sparkles className="h-3 w-3 text-indigo-300" />
          자세·표정 실시간 분석
        </div>
      )}

      <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 font-mono text-[10px] text-slate-200">
        1080p · 24fps
      </div>

      {/* Bottom: name + mic toggle */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <Mic className={cn('h-3.5 w-3.5', micOn ? 'text-emerald-400' : 'text-rose-400')} />
          {name}
          <span className="ml-1 text-[11px] text-slate-400">(나)</span>
        </div>
        <button
          type="button"
          onClick={onToggleMic}
          aria-label={micOn ? '마이크 끄기' : '마이크 켜기'}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
            micOn
              ? 'border-white/15 bg-slate-700/70 text-white hover:bg-slate-700'
              : 'border-rose-500/40 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30',
          )}
        >
          {micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}

function LayerChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold backdrop-blur transition-colors',
        active
          ? 'border-indigo-400/50 bg-indigo-500/25 text-indigo-100 hover:bg-indigo-500/35'
          : 'border-white/15 bg-black/55 text-slate-400 hover:bg-black/70',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function SpeechCaptionBar({
  text,
  elapsed,
  micOn,
}: {
  text: string
  elapsed: string
  micOn: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-white/10 bg-slate-900/80 px-5 py-3 backdrop-blur">
      <div className="flex shrink-0 items-center gap-3">
        <div
          className={cn(
            'relative grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_6px_20px_rgba(99,102,241,0.45)]',
            micOn
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
              : 'bg-slate-700',
          )}
        >
          {micOn && <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/30" />}
          {micOn ? <Mic className="relative h-5 w-5" /> : <MicOff className="relative h-5 w-5 text-slate-400" />}
        </div>
        {micOn && <ListeningWave />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {micOn ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
              Listening
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Muted
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-400">내 음성 인식 중</span>
        </div>
        <p className="mt-1 truncate text-sm font-medium text-slate-100">
          {text}
          {micOn && (
            <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-indigo-300" />
          )}
        </p>
      </div>

      <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums text-slate-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
        {elapsed}
      </span>
    </div>
  )
}

function ListeningWave() {
  const bars = [4, 9, 14, 20, 24, 16, 10, 6, 12, 18, 14, 8, 4]
  return (
    <div className="flex h-6 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-full bg-indigo-400/80"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}

function SidePanelSection({
  title,
  badge,
  children,
}: {
  title: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
          {title}
        </p>
        {badge && (
          <Badge tone="warning" size="sm">
            {badge}
          </Badge>
        )}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}
