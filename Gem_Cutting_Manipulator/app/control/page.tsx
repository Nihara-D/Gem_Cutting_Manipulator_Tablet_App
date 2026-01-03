"use client"

import { useState } from "react"
import { RobotArm3D } from "@/components/robot-arm-3d"
import { JointControlPanel } from "@/components/joint-control-panel"
import { CartesianControl } from "@/components/cartesian-control"
import { TeachPendant } from "@/components/teach-pendant"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import type { JointAngles } from "@/lib/robot-kinematics"
import { forwardKinematics } from "@/lib/robot-kinematics"

export default function ControlPage() {
  const [jointAngles, setJointAngles] = useState<JointAngles>({
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0,
    joint5: 0,
    joint6: 0,
  })

  const cartesianPosition = forwardKinematics(jointAngles)

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

  const handleStop = () => {
    console.log("[v0] Emergency stop triggered")
  }

  const handleExecute = () => {
    console.log("[v0] Executing movement with angles:", jointAngles)
  }

  return (
    <div className="min-h-screen bg-background pb-24 p-4">
      <div className="max-w-[1920px] mx-auto space-y-4">
        <PageHeader title="Robot Control" description="Manual control and teach pendant" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-none bg-zinc-950 shadow-2xl">
            <CardContent className="p-0 h-[650px] relative">
              <RobotArm3D jointAngles={jointAngles} showLabels={true} showGrid={true} />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-medium">REAL-TIME SIMULATION ACTIVE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Panels */}
          <div className="space-y-4">
            <JointControlPanel
              jointAngles={jointAngles}
              onJointChange={setJointAngles}
              onHome={handleHome}
              onStop={handleStop}
              onExecute={handleExecute}
            />

            <CartesianControl currentPosition={cartesianPosition} onMove={(pos) => console.log("[v0] Move to:", pos)} />

            <TeachPendant currentAngles={jointAngles} onLoadPosition={setJointAngles} />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
