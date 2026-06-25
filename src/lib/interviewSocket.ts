import { io, type Socket } from 'socket.io-client'
import { GITHUB_TOKEN_KEY } from '@/lib/api'

const BACKEND_URL = 'http://43.202.227.251:3000'

export type InterviewQuestion = {
  id: string
  question: string
  category: string
  kind: 'MAIN' | 'FOLLOW_UP'
  sortKey: string
  rationale?: string
  parentQuestionId: string | null
}

export type InterviewInterviewer = {
  interviewerKey: 'kind' | 'strict' | 'normal'
  displayName: string
  personality: string
  order: number
}

export type SessionStartedPayload = {
  type: 'session.started'
  sessionId: string
  interviewers: InterviewInterviewer[]
  questions: InterviewQuestion[]
}

type NewSessionOptions = {
  portfolioId: string
  sessionNo: string
}

type ExistingSessionOptions = {
  sessionId: string
}

// Survive Vite HMR: store on globalThis so module reload doesn't create a duplicate socket
type SocketGlobal = {
  __interviewSocket: Socket | null
  __interviewSocketKey: string | null
}
const g = globalThis as unknown as SocketGlobal
if (g.__interviewSocket === undefined) g.__interviewSocket = null
if (g.__interviewSocketKey === undefined) g.__interviewSocketKey = null

function keyFor(options: NewSessionOptions | ExistingSessionOptions): string {
  return 'sessionId' in options
    ? `session:${options.sessionId}`
    : `new:${options.portfolioId}:${options.sessionNo}`
}

export function initInterviewSocket(options: NewSessionOptions | ExistingSessionOptions): Socket {
  const key = keyFor(options)

  // Reuse if same session is already connected (or in the middle of connecting)
  if (g.__interviewSocket && g.__interviewSocketKey === key) {
    console.log(`[socket] reuse existing id=${g.__interviewSocket.id ?? '(pending)'} key=${key}`)
    return g.__interviewSocket
  }

  // Different session → tear down the old socket
  if (g.__interviewSocket) {
    console.log(`[socket] disconnect old id=${g.__interviewSocket.id} key=${g.__interviewSocketKey}`)
    g.__interviewSocket.disconnect()
    g.__interviewSocket = null
  }

  const token = localStorage.getItem(GITHUB_TOKEN_KEY) ?? ''
  const query = 'sessionId' in options
    ? { sessionId: options.sessionId }
    : { portfolioId: options.portfolioId, sessionNo: options.sessionNo }

  const sock = io(`${BACKEND_URL}/interviews`, {
    auth: { token },
    query,
    transports: ['websocket'],
    forceNew: false,
  })

  sock.on('connect', () => console.log(`[socket] connected id=${sock.id} key=${key}`))
  sock.on('disconnect', (reason) => console.log(`[socket] disconnected id=${sock.id} reason=${reason}`))

  // Log all outgoing emits (with socket id so duplicates are visible)
  const _emit = sock.emit.bind(sock)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(sock as any).emit = (event: string, ...args: unknown[]) => {
    console.log(`[socket ↑ ${sock.id ?? '?'}] ${event}`, ...args)
    return _emit(event, ...args)
  }

  g.__interviewSocket = sock
  g.__interviewSocketKey = key
  return sock
}

export function getInterviewSocket(): Socket {
  if (!g.__interviewSocket) throw new Error('Interview socket not initialized. Call initInterviewSocket first.')
  return g.__interviewSocket
}

export function disconnectInterviewSocket() {
  g.__interviewSocket?.disconnect()
  g.__interviewSocket = null
  g.__interviewSocketKey = null
}
