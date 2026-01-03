"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { rosConnection } from "@/lib/ros-connection"
import { useRosConnection } from "@/hooks/use-ros-connection"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function SettingsPage() {
  const [rosUrl, setRosUrl] = useState("ws://localhost:9090")
  const [showLabels, setShowLabels] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [autoReconnect, setAutoReconnect] = useState(false)
  const { status: connectionStatus, isConnected } = useRosConnection()

  useEffect(() => {
    rosConnection.setAutoReconnect(autoReconnect)
  }, [autoReconnect])

  const handleConnect = () => {
    rosConnection.disconnect()
    rosConnection.setUrl(rosUrl)
    rosConnection.resetReconnectAttempts()
    rosConnection.connect()
  }

  const handleDisconnect = () => {
    rosConnection.disconnect()
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <PageHeader title="Settings" description="Configure system parameters and preferences" />

        <div className="space-y-4">
          {/* ROS Connection Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">ROS 2 Connection</h3>
              <Badge
                variant={
                  connectionStatus === "connected"
                    ? "default"
                    : connectionStatus === "connecting"
                      ? "secondary"
                      : "destructive"
                }
              >
                {connectionStatus}
              </Badge>
            </div>

            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Setup Instructions:</strong> On your Ubuntu system with ROS 2 Jazzy, install and run rosbridge:
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">sudo apt install ros-jazzy-rosbridge-suite</code>
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  ros2 launch rosbridge_server rosbridge_websocket_launch.xml
                </code>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ros-url">ROSbridge WebSocket URL</Label>
                <Input
                  id="ros-url"
                  type="text"
                  value={rosUrl}
                  onChange={(e) => setRosUrl(e.target.value)}
                  placeholder="ws://localhost:9090"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the IP address of your Ubuntu machine if not running locally (e.g., ws://192.168.1.100:9090)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Reconnect</Label>
                  <p className="text-xs text-muted-foreground">Automatically reconnect if connection is lost</p>
                </div>
                <Switch checked={autoReconnect} onCheckedChange={setAutoReconnect} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleConnect} disabled={connectionStatus === "connected" || isConnected}>
                  Connect
                </Button>
                <Button onClick={handleDisconnect} variant="outline" disabled={!isConnected}>
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Display Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Joint Labels</Label>
                  <p className="text-xs text-muted-foreground">Display labels on 3D robot joints and links</p>
                </div>
                <Switch checked={showLabels} onCheckedChange={setShowLabels} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Grid</Label>
                  <p className="text-xs text-muted-foreground">Display reference grid in 3D viewer</p>
                </div>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
            </div>
          </Card>

          <Separator />

          {/* Robot Parameters */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Robot Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-velocity">Max Velocity (deg/s)</Label>
                <Input id="max-velocity" type="number" defaultValue="45" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-acceleration">Max Acceleration (deg/s²)</Label>
                <Input id="max-acceleration" type="number" defaultValue="90" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jog-step">Jog Step Size (deg)</Label>
                <Input id="jog-step" type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position-tolerance">Position Tolerance (deg)</Label>
                <Input id="position-tolerance" type="number" defaultValue="0.5" step="0.1" />
              </div>
            </div>
          </Card>

          <Separator />

          {/* Servo Configuration */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Servo Configuration (MG996R)</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servo-min-pulse">Min Pulse Width (μs)</Label>
                  <Input id="servo-min-pulse" type="number" defaultValue="544" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servo-max-pulse">Max Pulse Width (μs)</Label>
                  <Input id="servo-max-pulse" type="number" defaultValue="2400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pwm-frequency">PWM Frequency (Hz)</Label>
                <Input id="pwm-frequency" type="number" defaultValue="50" />
                <p className="text-xs text-muted-foreground">Standard servo PWM frequency is 50Hz</p>
              </div>
            </div>
          </Card>

          <Separator />

          {/* System Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application Version</span>
                <span className="font-mono">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROS 2 Version</span>
                <span className="font-mono">Jazzy Jalisco</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gazebo Version</span>
                <span className="font-mono">Harmony</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Robot Model</span>
                <span className="font-mono">6DOF DIY Kit</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
