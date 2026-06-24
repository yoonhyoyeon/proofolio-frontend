import { io, type Socket } from 'socket.io-client'

const BACKEND_URL = 'http://43.202.227.251:3000'

// Hardcoded until API issuance is implemented
const SESSION_ID = 'cmqrxyn7h00034mqmmthaiktq'
const SESSION_TOKEN =
  'eyJ1c2VySWQiOiJjbXFyd2k2c3YwMDAwM2pwZWwwanlqYnVmIn0.lYiNhHoYUQYmzmZ51aiJMwCwMq1hJnDGUZdl9HIgFvw'

let socket: Socket | null = null

export function getInterviewSocket(): Socket {
  if (!socket) {
    socket = io(`${BACKEND_URL}/interviews`, {
      auth: { token: SESSION_TOKEN },
      query: { sessionId: SESSION_ID },
      transports: ['websocket'],
    })
  }
  return socket
}

export function disconnectInterviewSocket() {
  socket?.disconnect()
  socket = null
}
