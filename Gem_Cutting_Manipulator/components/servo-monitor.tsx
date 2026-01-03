"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import type { ServoStatus } from "@/types/hardware"

interface ServoMonitorProps {
  servos: ServoStatus[]
}

export function ServoMonitor({ servos }: ServoMonitorProps) {
  const getStatusIcon = (status: ServoStatus["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: ServoStatus["status"]) => {
    switch (status) {
      case "ok":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
    }
  }

  const getLoadColor = (load: number) => {
    if (load < 50) return "bg-green-500"
    if (load < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTempColor = (temp: number) => {
    if (temp < 50) return "text-green-500"
    if (temp < 70) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Servo Motors</CardTitle>
          <Badge variant="secondary" className="font-mono">
            MG996R × 6
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {servos.map((servo) => (
            <Card key={servo.id} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(servo.status)}`} />
                  <span className="text-sm font-medium text-foreground">{servo.joint}</span>
                </div>
                {getStatusIcon(servo.status)}
              </div>

              <div className="space-y-2">
                {/* Angle */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Angle</span>
                    <span className="font-mono font-semibold text-foreground">{servo.angle.toFixed(1)}°</span>
                  </div>
                </div>

                {/* Load */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Load</span>
                    <span className="font-mono text-foreground">{servo.load}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${getLoadColor(servo.load)}`} style={{ width: `${servo.load}%` }} />
                  </div>
                </div>

                {/* Temperature & Voltage */}
                <div className="flex justify-between text-xs pt-1">
                  <span className={`font-mono ${getTempColor(servo.temperature)}`}>{servo.temperature}°C</span>
                  <span className="font-mono text-muted-foreground">{servo.voltage.toFixed(1)}V</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
