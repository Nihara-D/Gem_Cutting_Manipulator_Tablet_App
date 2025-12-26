"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cpu, Thermometer, Wifi, Zap, Activity } from "lucide-react"
import type { HardwareStatus } from "@/types/hardware"

interface HardwareStatusPanelProps {
  status: HardwareStatus
}

export function HardwareStatusPanel({ status }: HardwareStatusPanelProps) {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-4">
      {/* ESP32 S3 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">ESP32 S3</CardTitle>
            <Badge variant={status.esp32.connected ? "default" : "destructive"}>
              {status.esp32.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="text-sm font-mono font-semibold text-foreground">
                  {formatUptime(status.esp32.uptime)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">WiFi Signal</div>
                <div className="text-sm font-mono font-semibold text-foreground">{status.esp32.wifiSignal} dBm</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Free Memory</span>
              <span className="font-mono text-foreground">{(status.esp32.freeMemory / 1024).toFixed(1)} KB</span>
            </div>
            <Progress value={(status.esp32.freeMemory / (520 * 1024)) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Raspberry Pi 4 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">Raspberry Pi 4</CardTitle>
            <Badge variant={status.raspberryPi.connected ? "default" : "destructive"}>
              {status.raspberryPi.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">CPU Usage</div>
                <div className="text-sm font-mono font-semibold text-foreground">
                  {status.raspberryPi.cpuUsage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Temperature</div>
                <div
                  className={`text-sm font-mono font-semibold ${
                    status.raspberryPi.temperature > 70 ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {status.raspberryPi.temperature.toFixed(1)}°C
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Memory Usage</span>
              <span className="font-mono text-foreground">{status.raspberryPi.memoryUsage.toFixed(1)}%</span>
            </div>
            <Progress value={status.raspberryPi.memoryUsage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Disk Usage</span>
              <span className="font-mono text-foreground">{status.raspberryPi.diskUsage.toFixed(1)}%</span>
            </div>
            <Progress value={status.raspberryPi.diskUsage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* PCA9685 Servo Controller */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">PCA9685 Controller</CardTitle>
            <Badge variant={status.pca9685.connected ? "default" : "destructive"}>
              {status.pca9685.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground">I2C Address</div>
              <div className="text-sm font-mono font-semibold text-foreground">{status.pca9685.i2cAddress}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">PWM Frequency</div>
              <div className="text-sm font-mono font-semibold text-foreground">{status.pca9685.frequency} Hz</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Power Supply */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Zap className="w-4 h-4" />
            Power Supply
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">5V Rail</div>
              <div className="text-lg font-mono font-semibold text-foreground">
                {status.powerSupply.voltage5v.toFixed(2)}V
              </div>
              <div className="text-xs font-mono text-muted-foreground">{status.powerSupply.current5v.toFixed(2)}A</div>
            </Card>

            <Card className="p-3 bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">20V Rail</div>
              <div className="text-lg font-mono font-semibold text-foreground">
                {status.powerSupply.voltage20v.toFixed(2)}V
              </div>
              <div className="text-xs font-mono text-muted-foreground">{status.powerSupply.current20v.toFixed(2)}A</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
