"use client"

import { useState } from "react"
import { RobotArm3D } from "@/components/robot-arm-3d"
import { JointAngleDisplay } from "@/components/joint-angle-display"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHardwareStatus } from "@/hooks/use-hardware-status"
import type { JointAngles } from "@/lib/robot-kinematics"
import { Activity, Cpu, Thermometer, Zap } from "lucide-react"

export default function DashboardPage() {
  const hardwareStatus = useHardwareStatus()
  const [jointAngles, setJointAngles] = useState<JointAngles>({
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0,
    joint5: 0,
    joint6: 0,
  })

  const handleHome = () => {
    setJointAngles({
      joint1: 0,
      joint2: 0,
      joint3: 0,
      joint4: 0,
      joint5: 0,
      joint6: 0,
    })
  }

  const avgServoTemp =
    hardwareStatus?.servos && hardwareStatus.servos.length > 0
      ? (
          hardwareStatus.servos.reduce((sum, s) => sum + (s?.temperature || 0), 0) / hardwareStatus.servos.length
        ).toFixed(1)
      : "0.0"

  const powerVoltage = hardwareStatus?.powerSupply?.voltage5v ? hardwareStatus.powerSupply.voltage5v.toFixed(1) : "0.0"

  const esp32Status = hardwareStatus?.esp32?.connected ? "online" : "offline"
  const piStatus = hardwareStatus?.raspberryPi?.connected ? "online" : "offline"

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1920px] mx-auto space-y-4">
        <PageHeader title="Gem Cutting Manipulator" description="6DOF Precision Control System Dashboard" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 3D Robot Viewer */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-[500px] overflow-hidden">
              <RobotArm3D jointAngles={jointAngles} showLabels={true} showGrid={true} />
            </Card>

            <JointAngleDisplay jointAngles={jointAngles} />
          </div>

          {/* Status Overview */}
          <div className="space-y-4">
            <Card className="p-6 border-none shadow-sm bg-[#D7BFA8]/10">
              <h3 className="text-lg font-bold mb-4 text-[#A17F66] uppercase tracking-tight">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#F1872D]" />
                    <span className="text-sm font-medium">Robot Status</span>
                  </div>
                  <Badge className="bg-[#F1872D] hover:bg-[#F1872D]/90 border-none">Ready</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">ESP32 S3</span>
                  </div>
                  <Badge variant={esp32Status === "online" ? "default" : "destructive"}>{esp32Status}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Raspberry Pi 4</span>
                  </div>
                  <Badge variant={piStatus === "online" ? "default" : "destructive"}>{piStatus}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-[#F1872D]" />
                    <span className="text-sm font-medium">Avg Servo Temp</span>
                  </div>
                  <span className="text-sm font-bold text-[#F1872D]">{avgServoTemp}°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Power Supply</span>
                  </div>
                  <Badge variant={Number.parseFloat(powerVoltage) > 4.8 ? "default" : "destructive"}>
                    {powerVoltage}V
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#A17F66] uppercase tracking-tight">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-[#F1872D] border-[#F1872D] hover:bg-[#F1872D]/10 bg-transparent"
                  variant="outline"
                >
                  Valuation
                </Button>
                <Button
                  className="w-full h-12 text-[#F1872D] border-[#F1872D] hover:bg-[#F1872D]/10 bg-transparent"
                  variant="outline"
                >
                  Identify
                </Button>
                <Button
                  className="w-full h-12 text-[#F1872D] border-[#F1872D] hover:bg-[#F1872D]/10 bg-transparent"
                  variant="outline"
                >
                  Services
                </Button>
                <Button className="w-full h-12 bg-[#F1872D] hover:bg-[#F1872D]/90 text-white font-bold">
                  Start Cutting
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Simulation Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Pattern</span>
                  <span className="text-sm font-medium">Round Brilliant</span>
                </div>
                <Button
                  className="w-full bg-[#F1872D] hover:bg-[#F1872D]/90"
                  onClick={() => (window.location.href = "/simulation")}
                >
                  Enter Simulation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
