"use client"

import { Card } from "@/components/ui/card"
import type { JointAngles } from "@/lib/robot-kinematics"
import { DH_PARAMS } from "@/lib/robot-kinematics"

interface JointAngleDisplayProps {
  jointAngles: JointAngles
  className?: string
}

export function JointAngleDisplay({ jointAngles, className }: JointAngleDisplayProps) {
  const joints = [
    { key: "joint1" as const, label: "Base", color: "bg-blue-500" },
    { key: "joint2" as const, label: "Shoulder", color: "bg-purple-500" },
    { key: "joint3" as const, label: "Elbow", color: "bg-cyan-500" },
    { key: "joint4" as const, label: "Wrist Pitch", color: "bg-green-500" },
    { key: "joint5" as const, label: "Wrist Roll", color: "bg-yellow-500" },
    { key: "joint6" as const, label: "End Effector", color: "bg-orange-500" },
  ]

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3">
        {joints.map(({ key, label, color }) => {
          const angle = jointAngles[key]
          const limits = DH_PARAMS.limits[key]
          const percentage = ((angle - limits.min) / (limits.max - limits.min)) * 100

          return (
            <Card key={key} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className="text-lg font-mono font-semibold text-foreground">{angle.toFixed(1)}°</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${color} transition-all duration-200`} style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>{limits.min}°</span>
                  <span>{limits.max}°</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
