// ROS 2 Bridge WebSocket connection manager
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

export type RosConnectionStatus = ConnectionStatus

export interface ROSMessage {
  op: string
  topic?: string
  type?: string
  msg?: any
  service?: string
  args?: any
  id?: string
}

export interface JointState {
  name: string[]
  position: number[]
  velocity: number[]
  effort: number[]
}

export interface RobotPose {
  x: number
  y: number
  z: number
  roll: number
  pitch: number
  yaw: number
}

class ROSConnection {
  private ws: WebSocket | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set()
  private currentStatus: ConnectionStatus = "disconnected"
  private autoReconnect = false // Added flag to control auto-reconnect behavior

  constructor(private url = "ws://localhost:9090") {}

  setUrl(url: string) {
    this.url = url
  }

  setAutoReconnect(enabled: boolean) {
    this.autoReconnect = enabled
    if (!enabled && this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.setStatus("connecting")
    console.log("[v0] Connecting to ROS bridge:", this.url)

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("[v0] ROS bridge connected successfully")
        this.reconnectAttempts = 0
        this.setStatus("connected")
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.topic) {
            const listeners = this.listeners.get(data.topic)
            listeners?.forEach((callback) => callback(data.msg))
          }
        } catch (error) {
          console.error("[v0] Failed to parse ROS message:", error)
        }
      }

      this.ws.onerror = (error) => {
        console.error(
          "[v0] ROS WebSocket connection failed. Make sure rosbridge_server is running on your Ubuntu system.",
        )
        console.error("[v0] Run: ros2 launch rosbridge_server rosbridge_websocket_launch.xml")
        this.setStatus("error")
      }

      this.ws.onclose = () => {
        console.log("[v0] ROS bridge disconnected")
        this.setStatus("disconnected")
        if (this.autoReconnect) {
          this.attemptReconnect()
        }
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket:", error)
      this.setStatus("error")
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[v0] Max reconnect attempts reached. Please check your ROS bridge connection.")
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    console.log(
      `[v0] Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    )

    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    this.ws?.close()
    this.ws = null
    this.setStatus("disconnected")
  }

  subscribe(topic: string, messageType: string, callback: (data: any) => void) {
    console.log("[v0] Subscribing to topic:", topic)

    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set())

      // Send subscribe message to ROS bridge
      this.send({
        op: "subscribe",
        topic,
        type: messageType,
      })
    }

    this.listeners.get(topic)!.add(callback)

    return () => this.unsubscribe(topic, callback)
  }

  unsubscribe(topic: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(topic)
    if (!listeners) return

    listeners.delete(callback)

    if (listeners.size === 0) {
      this.listeners.delete(topic)
      this.send({
        op: "unsubscribe",
        topic,
      })
    }
  }

  publish(topic: string, messageType: string, message: any) {
    this.send({
      op: "publish",
      topic,
      type: messageType,
      msg: message,
    })
  }

  callService(service: string, serviceType: string, args: any = {}) {
    return new Promise((resolve, reject) => {
      const id = `service_call_${Date.now()}_${Math.random()}`

      const timeout = setTimeout(() => {
        reject(new Error("Service call timeout"))
      }, 5000)

      const handler = (data: any) => {
        if (data.id === id) {
          clearTimeout(timeout)
          this.ws?.removeEventListener("message", handler)
          resolve(data.values)
        }
      }

      this.ws?.addEventListener("message", handler)

      this.send({
        op: "call_service",
        service,
        type: serviceType,
        args,
        id,
      })
    })
  }

  private send(message: ROSMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn("[v0] Cannot send message: WebSocket not connected")
    }
  }

  onStatusChange(callback: (status: ConnectionStatus) => void) {
    this.statusListeners.add(callback)
    callback(this.currentStatus)

    return () => {
      this.statusListeners.delete(callback)
    }
  }

  private setStatus(status: ConnectionStatus) {
    this.currentStatus = status
    this.statusListeners.forEach((callback) => callback(status))
  }

  getStatus(): ConnectionStatus {
    return this.currentStatus
  }

  resetReconnectAttempts() {
    this.reconnectAttempts = 0
  }
}

// Singleton instance
export const rosConnection = new ROSConnection()
