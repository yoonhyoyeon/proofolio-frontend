import { useState, useRef, useEffect, useCallback } from 'react'
import { getInterviewSocket, disconnectInterviewSocket } from '@/lib/interviewSocket'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface TranscriptEntry {
  id: string
  text: string
  isFinal: boolean
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function getSupportedMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

export function useInterviewAudio() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [micOn, setMicOn] = useState(true)
  const [transcriptText, setTranscriptText] = useState('')

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const seqRef = useRef(0)
  const micOnRef = useRef(true)

  // Start MediaRecorder and begin sending audio chunks
  const startRecording = useCallback(async () => {
    if (recorderRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder

      const socket = getInterviewSocket()
      socket.emit('event', { type: 'user.speaking.start' })

      recorder.ondataavailable = async (e) => {
        if (e.data.size === 0 || !micOnRef.current) return
        const buffer = await e.data.arrayBuffer()
        socket.emit('event', {
          type: 'media.audio',
          sequence: seqRef.current++,
          mimeType: mimeType || 'audio/webm;codecs=opus',
          dataBase64: arrayBufferToBase64(buffer),
        })
      }

      recorder.start(500)
    } catch (err) {
      console.error('[interview-audio] Failed to start recording:', err)
    }
  }, [])

  // Stop MediaRecorder and notify server
  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return
    recorderRef.current.stop()
    recorderRef.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null

    getInterviewSocket().emit('event', { type: 'user.speaking.end' })
  }, [])

  // Toggle mic on/off
  const toggleMic = useCallback(() => {
    const next = !micOnRef.current
    micOnRef.current = next
    setMicOn(next)
    if (next) {
      void startRecording()
    } else {
      stopRecording()
    }
  }, [startRecording, stopRecording])

  // Connect socket and wire up events on mount
  useEffect(() => {
    const socket = getInterviewSocket()

    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')
    const onError = () => setStatus('error')
    const onTranscript = (data: unknown) => {
      const text = typeof data === 'string' ? data : (data as { text?: string }).text ?? ''
      if (text) setTranscriptText(text)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onError)
    socket.on('answer.transcript', onTranscript)

    if (socket.connected) setStatus('connected')

    // Auto-start audio capture
    void startRecording()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onError)
      socket.off('answer.transcript', onTranscript)
      stopRecording()
      disconnectInterviewSocket()
    }
  }, [startRecording, stopRecording])

  return { status, micOn, toggleMic, transcriptText }
}
