import { io } from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.eventListeners = new Map()
  }

  connect(url = 'http://localhost:5000') {
    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true
      })

      this.socket.on('connect', () => {
        console.log('🔌 WebSocket connected')
        this.isConnected = true
        this.emit('connection_status', { connected: true })
      })

      this.socket.on('disconnect', () => {
        console.log('🔌 WebSocket disconnected')
        this.isConnected = false
        this.emit('connection_status', { connected: false })
      })

      this.socket.on('connect_error', (error) => {
        console.log('🔌 WebSocket connection error:', error)
        this.isConnected = false
        this.emit('connection_status', { connected: false, error })
      })

      // Listen for real-time events
      this.socket.on('customer_activity', (data) => {
        this.emit('customer_activity', data)
      })

      this.socket.on('cart_update', (data) => {
        this.emit('cart_update', data)
      })

      this.socket.on('message_received', (data) => {
        this.emit('message_received', data)
      })

      this.socket.on('analytics_update', (data) => {
        this.emit('analytics_update', data)
      })

      this.socket.on('platform_integration', (data) => {
        this.emit('platform_integration', data)
      })

    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.isConnected = false
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error)
        }
      })
    }
  }

  // Send data to server
  send(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected, cannot send:', event, data)
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }
}

// Create singleton instance
const websocketService = new WebSocketService()

export default websocketService