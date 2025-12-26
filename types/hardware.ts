// Hardware monitoring types
export interface ServoStatus {
  id: number
  joint: string
  angle: number
  load: number // 0-100%
  temperature: number // Celsius
  voltage: number
  status: "ok" | "warning" | "error"
}

export interface HardwareStatus {
  esp32: {
    connected: boolean
    uptime: number
    freeMemory: number
    wifiSignal: number
  }
  raspberryPi: {
    connected: boolean
    cpuUsage: number
    temperature: number
    memoryUsage: number
    diskUsage: number
  }
  pca9685: {
    connected: boolean
    i2cAddress: string
    frequency: number
  }
  powerSupply: {
    voltage5v: number
    current5v: number
    voltage20v: number
    current20v: number
  }
  servos: ServoStatus[]
}
