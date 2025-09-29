import { io, Socket } from 'socket.io-client'

export class WebSocketService {
  private static instance: WebSocketService
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  connect(userId: string): void {
    if (this.socket) return
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'
    const url = base.replace(/\/api$/, '')
    this.socket = io(url, { transports: ['websocket'] })
    this.socket.on('connect', () => {
      this.emitLocal('connected', { userId })
    })
    this.socket.onAny((event, ...args) => {
      this.emitLocal(event, args[0])
    })
  }

  disconnect(): void {
    this.socket?.disconnect()
    this.socket = null
    this.listeners.clear()
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  emit(event: string, data: any): void {
    this.socket?.emit(event, data)
    this.emitLocal(event, data)
  }

  private emitLocal(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }
}
