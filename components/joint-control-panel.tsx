"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Move, RotateCw, Play, Square, ChevronUp, ChevronDown } from "lucide-react"
import type { JointAngles } from "@/lib/robot-kinematics"
import { DH_PARAMS, clampJointAngle } from "@/lib/robot-kinematics"
import { publishToTopic } from "@/hooks/use-ros-topic"

interface JointControlPanelProps {
  jointAngles: JointAngles
  onJointChange: (angles: JointAngles) => void
  onHome: () => void
  onStop: () => void
  onExecute: () => void
  isExecuting?: boolean
}

export function JointControlPanel({
  jointAngles,
  onJointChange,
  onHome,
  onStop,
  onExecute,
  isExecuting = false,
}: JointControlPanelProps) {
  const [jogStep, setJogStep] = useState(1)

  const handleJointSliderChange = (joint: keyof JointAngles, value: number[]) => {
    const newAngles = { ...jointAngles, [joint]: value[0] }
    onJointChange(newAngles)

    // Publish to ROS topic
    publishToTopic("/joint_commands", "sensor_msgs/JointState", {
      name: ["joint1", "joint2", "joint3", "joint4", "joint5", "joint6"],
      position: [
        (newAngles.joint1 * Math.PI) / 180,
        (newAngles.joint2 * Math.PI) / 180,
        (newAngles.joint3 * Math.PI) / 180,
        (newAngles.joint4 * Math.PI) / 180,
        (newAngles.joint5 * Math.PI) / 180,
        (newAngles.joint6 * Math.PI) / 180,
      ],
    })
  }

  const handleJointInput = (joint: keyof JointAngles, value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return

    const clampedValue = clampJointAngle(joint, numValue)
    onJointChange({ ...jointAngles, [joint]: clampedValue })
  }

  const handleJog = (joint: keyof JointAngles, direction: 1 | -1) => {
    const currentAngle = jointAngles[joint]
    const newAngle = clampJointAngle(joint, currentAngle + direction * jogStep)
    onJointChange({ ...jointAngles, [joint]: newAngle })
  }

  const joints = [
    { key: "joint1" as const, label: "Base", icon: RotateCw, color: "text-blue-500" },
    { key: "joint2" as const, label: "Shoulder", icon: Move, color: "text-purple-500" },
    { key: "joint3" as const, label: "Elbow", icon: Move, color: "text-cyan-500" },
    { key: "joint4" as const, label: "Wrist Pitch", icon: Move, color: "text-green-500" },
    { key: "joint5" as const, label: "Wrist Roll", icon: RotateCw, color: "text-yellow-500" },
    { key: "joint6" as const, label: "End Effector", icon: RotateCw, color: "text-orange-500" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Robot Control</CardTitle>
          <div className="flex gap-2">
            <Button onClick={onHome} variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button onClick={onExecute} variant="default" size="sm" disabled={isExecuting}>
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
            <Button onClick={onStop} variant="destructive" size="sm">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sliders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sliders">Sliders</TabsTrigger>
            <TabsTrigger value="jog">Jog Control</TabsTrigger>
          </TabsList>

          <TabsContent value="sliders" className="space-y-4">
            {joints.map(({ key, label, color }) => {
              const angle = jointAngles[key]
              const limits = DH_PARAMS.limits[key]

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className={`text-sm font-medium ${color}`}>{label}</Label>
                    <Input
                      type="number"
                      value={angle.toFixed(1)}
                      onChange={(e) => handleJointInput(key, e.target.value)}
                      className="w-20 h-8 text-right font-mono text-foreground"
                      step={0.1}
                      min={limits.min}
                      max={limits.max}
                    />
                  </div>
                  <Slider
                    value={[angle]}
                    onValueChange={(value) => handleJointSliderChange(key, value)}
                    min={limits.min}
                    max={limits.max}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>{limits.min}°</span>
                    <span>{limits.max}°</span>
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="jog" className="space-y-4">
            <div className="mb-4">
              <Label className="text-sm font-medium text-foreground">Jog Step Size</Label>
              <div className="flex gap-2 mt-2">
                {[0.1, 1, 5, 10].map((step) => (
                  <Button
                    key={step}
                    onClick={() => setJogStep(step)}
                    variant={jogStep === step ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    {step}°
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {joints.map(({ key, label, color }) => {
                const Icon = joints.find((j) => j.key === key)?.icon || Move

                return (
                  <Card key={key} className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleJog(key, -1)} variant="outline" size="sm" className="flex-1">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <span className="flex items-center justify-center min-w-[60px] text-sm font-mono font-semibold text-foreground">
                        {jointAngles[key].toFixed(1)}°
                      </span>
                      <Button onClick={() => handleJog(key, 1)} variant="outline" size="sm" className="flex-1">
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
