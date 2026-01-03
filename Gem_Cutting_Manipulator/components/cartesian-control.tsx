"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Move3d, RotateCcw, Send } from "lucide-react"
import type { CartesianPosition } from "@/lib/robot-kinematics"

interface CartesianControlProps {
  currentPosition: CartesianPosition
  onMove: (position: CartesianPosition) => void
}

export function CartesianControl({ currentPosition, onMove }: CartesianControlProps) {
  const [targetPosition, setTargetPosition] = useState(currentPosition)

  const handleInputChange = (axis: keyof CartesianPosition, value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return

    setTargetPosition({ ...targetPosition, [axis]: numValue })
  }

  const handleMove = () => {
    onMove(targetPosition)
  }

  const handleReset = () => {
    setTargetPosition(currentPosition)
  }

  const axes = [
    { key: "x" as const, label: "X Position", unit: "mm", color: "text-red-500" },
    { key: "y" as const, label: "Y Position", unit: "mm", color: "text-green-500" },
    { key: "z" as const, label: "Z Position", unit: "mm", color: "text-blue-500" },
    { key: "roll" as const, label: "Roll", unit: "rad", color: "text-purple-500" },
    { key: "pitch" as const, label: "Pitch", unit: "rad", color: "text-cyan-500" },
    { key: "yaw" as const, label: "Yaw", unit: "rad", color: "text-yellow-500" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Move3d className="w-5 h-5" />
            Cartesian Control
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleMove} variant="default" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Move
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {axes.map(({ key, label, unit, color }) => (
            <div key={key} className="space-y-2">
              <Label className={`text-sm font-medium ${color}`}>{label}</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={targetPosition[key].toFixed(2)}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="font-mono text-foreground"
                  step={key.includes("roll") || key.includes("pitch") || key.includes("yaw") ? 0.01 : 1}
                />
                <span className="text-sm text-muted-foreground min-w-[40px]">{unit}</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                Current: {currentPosition[key].toFixed(2)} {unit}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
