import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
  Video,
  VideoOff,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { currentUser } from '@/lib/mock'
import {
  initInterviewSocket,
  type InterviewQuestion,
  type InterviewInterviewer,
  type SessionStartedPayload,
} from '@/lib/interviewSocket'

const MIC_BARS = [2, 4, 6, 9, 12, 16, 20, 24, 20, 16, 12, 9, 6, 4, 2]

export function InterviewDeviceCheckPage() {
  const [params] = useSearchParams()
  const mode: 'practice' | 'real' = params.get('mode') === 'real' ? 'real' : 'practice'
  const portfolioId = params.get('portfolioId') ?? ''
  const sessionNo = params.get('sessionNo') ?? String(Math.floor(Math.random() * 1_000_000))
  const navigate = useNavigate()

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [mics, setMics] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState('')
  const [selectedMic, setSelectedMic] = useState('')
  const [camOn, setCamOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [micLevel, setMicLevel] = useState(0)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Socket / waiting state
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number>(0)
  const camOnRef = useRef(true)
  const micOnRef = useRef(true)

  function stopMicPoll() {
    cancelAnimationFrame(rafRef.current)
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
  }

  function startMicPoll(stream: MediaStream) {
    stopMicPoll()
    try {
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioCtxRef.current = ctx
      const data = new Uint8Array(analyser.frequencyBinCount)
      function tick() {
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        setMicLevel(Math.min(Math.round((avg / 128) * MIC_BARS.length), MIC_BARS.length))
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      // AudioContext unavailable
    }
  }

  async function setupStream(cameraId?: string, micId?: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraId ? { deviceId: { exact: cameraId } } : true,
        audio: micId ? { deviceId: { exact: micId } } : true,
      })

      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = stream

      stream.getVideoTracks().forEach((t) => { t.enabled = camOnRef.current })
      stream.getAudioTracks().forEach((t) => { t.enabled = micOnRef.current })

      if (videoRef.current) videoRef.current.srcObject = stream

      setReady(true)
      setPermissionError(null)

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === 'videoinput')
      const audioDevices = devices.filter((d) => d.kind === 'audioinput')
      setCameras(videoDevices)
      setMics(audioDevices)
      if (!cameraId && videoDevices[0]) setSelectedCamera(videoDevices[0].deviceId)
      if (!micId && audioDevices[0]) setSelectedMic(audioDevices[0].deviceId)

      startMicPoll(stream)
    } catch {
      setPermissionError('카메라 또는 마이크 접근 권한을 허용해 주세요.')
      setReady(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void setupStream()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      stopMicPoll()
    }
  }, [])

  function handleCamToggle() {
    const next = !camOn
    camOnRef.current = next
    setCamOn(next)
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = next })
  }

  function handleMicToggle() {
    const next = !micOn
    micOnRef.current = next
    setMicOn(next)
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = next })
  }

  function handleCameraChange(deviceId: string) {
    setSelectedCamera(deviceId)
    void setupStream(deviceId, selectedMic || undefined)
  }

  function handleMicChange(deviceId: string) {
    setSelectedMic(deviceId)
    void setupStream(selectedCamera || undefined, deviceId)
  }

  const handleEnter = useCallback(() => {
    if (!portfolioId) {
      setConnectError('포트폴리오 ID가 없습니다. 설정 페이지로 돌아가 다시 시도해 주세요.')
      return
    }
    setConnecting(true)
    setConnectError('')

    const socket = initInterviewSocket({ portfolioId, sessionNo })

    const cleanup = () => {
      socket.off('connect')
      socket.off('event')
      socket.off('connect_error')
    }

    socket.on('connect', () => {
      socket.emit('event', { type: 'session.start', portfolioId })
    })

    socket.on('event', (payload: { type: string } & Partial<SessionStartedPayload>) => {
      if (payload.type !== 'session.started') return
      cleanup()
      const questions: InterviewQuestion[] = payload.questions ?? []
      const interviewers: InterviewInterviewer[] = payload.interviewers ?? []
      const sessionId: string = payload.sessionId ?? ''
      navigate(`/interview/room?mode=${mode}`, {
        state: { questions, interviewers, sessionId, portfolioId, sessionNo },
        replace: true,
      })
    })

    socket.on('connect_error', (err: Error) => {
      cleanup()
      setConnectError(`연결 실패: ${err.message}`)
      setConnecting(false)
    })
  }, [portfolioId, sessionNo, mode, navigate])

  const barsLit = micOn ? micLevel : 0

  const cameraOptions =
    cameras.length > 0
      ? cameras.map((d, i) => ({ value: d.deviceId, label: d.label || `카메라 ${i + 1}` }))
      : [{ value: '', label: '장치를 불러오는 중...' }]

  const micOptions =
    mics.length > 0
      ? mics.map((d, i) => ({ value: d.deviceId, label: d.label || `마이크 ${i + 1}` }))
      : [{ value: '', label: '장치를 불러오는 중...' }]

  // Loading overlay while waiting for session.started
  if (connecting) {
    return (
      <div className="flex h-screen w-full flex-col bg-[#0b0f19] text-slate-100">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0f19]/95 px-6 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold tracking-tight text-white"
          >
            <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Proofolio
          </Link>
          <Badge tone="dark" className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
            {mode === 'real' ? '실전 모드' : '연습 모드'}
          </Badge>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/15">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">AI 면접관이 질문을 준비 중입니다</p>
            <p className="mt-2 text-sm text-slate-400">
              포트폴리오를 분석하여 맞춤 질문을 생성하고 있습니다. 잠시만 기다려 주세요.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            소켓 연결 중 · 약 18초 소요
          </div>
          {connectError && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-rose-400">{connectError}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => setConnecting(false)}
              >
                돌아가기
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#0b0f19] text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0f19]/95 px-6 py-3">
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
            mode === 'real'
              ? 'border-rose-500/30 bg-rose-500/15 text-rose-300'
              : 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300'
          }
        >
          {mode === 'real' ? '실전 모드' : '연습 모드'}
        </Badge>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 items-center justify-center gap-8 px-8 py-8">
        {/* Camera preview */}
        <div className="flex w-full max-w-[560px] flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            미리보기
          </p>
          <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-slate-950 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {permissionError ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-400" />
                <p className="text-sm font-medium text-amber-300">{permissionError}</p>
                <p className="text-xs text-slate-500">
                  브라우저 주소창 옆 잠금 아이콘을 클릭해 권한을 허용하세요.
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover',
                    (!camOn || !ready) && 'invisible',
                  )}
                />

                {(!camOn || !ready) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
                    {!ready ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-slate-300" />
                    ) : (
                      <>
                        <VideoOff className="h-10 w-10" />
                        <p className="text-sm font-medium">카메라가 꺼져 있습니다</p>
                      </>
                    )}
                  </div>
                )}

                {camOn && ready && (
                  <>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      <Mic
                        className={cn('h-3.5 w-3.5', micOn ? 'text-emerald-400' : 'text-rose-400')}
                      />
                      {currentUser.name}
                      <span className="ml-1 text-[11px] text-slate-400">(나)</span>
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 font-mono text-[10px] text-slate-200">
                      HD · Live
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Cam / Mic toggles */}
          <div className="flex items-center justify-center gap-3">
            <ToggleButton
              active={camOn}
              onToggle={handleCamToggle}
              icon={camOn ? <Video className="h-[18px] w-[18px]" /> : <VideoOff className="h-[18px] w-[18px]" />}
              label={camOn ? '카메라 끄기' : '카메라 켜기'}
            />
            <ToggleButton
              active={micOn}
              onToggle={handleMicToggle}
              icon={micOn ? <Mic className="h-[18px] w-[18px]" /> : <MicOff className="h-[18px] w-[18px]" />}
              label={micOn ? '마이크 끄기' : '마이크 켜기'}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-64 w-px self-center bg-white/10 lg:block" />

        {/* Device settings panel */}
        <div className="flex w-full max-w-[380px] flex-col gap-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">장치 설정</h1>
            <p className="mt-1 text-sm text-slate-400">
              면접 전에 카메라와 마이크를 확인하세요.
            </p>
          </div>

          <DeviceSelect
            label="카메라"
            icon={<Video className="h-4 w-4" />}
            options={cameraOptions}
            value={selectedCamera}
            onChange={handleCameraChange}
          />

          <div className="flex flex-col gap-3">
            <DeviceSelect
              label="마이크"
              icon={<Mic className="h-4 w-4" />}
              options={micOptions}
              value={selectedMic}
              onChange={handleMicChange}
            />

            <div className="rounded-[var(--radius-md)] border border-white/10 bg-slate-900/60 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-slate-400">입력 레벨</p>
                {micOn ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    입력 중
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">음소거됨</span>
                )}
              </div>
              <div className="mt-2.5 flex h-5 items-center gap-[3px]">
                {MIC_BARS.map((h, i) => (
                  <span
                    key={i}
                    className={cn(
                      'block w-[4px] rounded-full transition-colors duration-75',
                      micOn && i < barsLit
                        ? i < barsLit * 0.6
                          ? 'bg-emerald-400'
                          : i < barsLit * 0.85
                          ? 'bg-yellow-400'
                          : 'bg-rose-400'
                        : 'bg-slate-700',
                    )}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {connectError && (
            <p className="text-xs text-rose-400">{connectError}</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              size="xl"
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:from-indigo-600 hover:to-violet-700"
              onClick={handleEnter}
              disabled={!ready}
            >
              <Sparkles className="h-4 w-4" />
              면접 입장하기
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full gap-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              설정으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleButton({
  active,
  onToggle,
  icon,
  label,
}: {
  active: boolean
  onToggle: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className={cn(
        'flex h-12 w-12 flex-col items-center justify-center rounded-full border transition-colors',
        active
          ? 'border-white/15 bg-slate-700/60 text-white hover:bg-slate-700'
          : 'border-rose-500/40 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25',
      )}
    >
      {icon}
    </button>
  )
}

function DeviceSelect({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[var(--radius-md)] border border-white/10 bg-slate-900/70 py-2.5 pl-4 pr-9 text-sm text-slate-100 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}
