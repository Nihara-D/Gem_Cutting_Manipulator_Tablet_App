"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react"
import type { RosConnectionStatus } from "@/lib/ros-connection"

interface ConnectionStatusProps {
  status: RosConnectionStatus
  onReconnect?: () => void
}

export function ConnectionStatus({ status, onReconnect }: ConnectionStatusProps) {
  const statusConfig = {
    connected: {
      icon: Wifi,
      label: "Connected",
      color: "bg-green-500",
      badgeVariant: "default" as const,
      description: "ROS 2 bridge active",
    },
    connecting: {
      icon: RefreshCw,
      label: "Connecting",
      color: "bg-yellow-500",
      badgeVariant: "secondary" as const,
      description: "Establishing connection...",
    },
    disconnected: {
      icon: WifiOff,
      label: "Disconnected",
      color: "bg-muted-foreground",
      badgeVariant: "outline" as const,
      description: "Not connected to ROS bridge",
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      color: "bg-destructive",
      badgeVariant: "destructive" as const,
      description: "Connection failed",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${config.color}`}>
              {status === "connected" && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${status === "connecting" ? "animate-spin" : ""}`} />
              <span className="font-semibold text-foreground">{config.label}</span>
              <Badge variant={config.badgeVariant} className="text-xs">
                ROS 2
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
          </div>
        </div>
        {(status === "disconnected" || status === "error") && onReconnect && (
          <Button onClick={onReconnect} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reconnect
          </Button>
        )}
      </div>
    </Card>
  )
}
