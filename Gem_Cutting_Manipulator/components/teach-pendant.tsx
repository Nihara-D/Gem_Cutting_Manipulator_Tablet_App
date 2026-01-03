"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Play, BookMarked } from "lucide-react"
import type { JointAngles } from "@/lib/robot-kinematics"

interface TeachPoint {
  id: string
  name: string
  angles: JointAngles
  timestamp: Date
}

interface TeachPendantProps {
  currentAngles: JointAngles
  onLoadPosition: (angles: JointAngles) => void
}

export function TeachPendant({ currentAngles, onLoadPosition }: TeachPendantProps) {
  const [teachPoints, setTeachPoints] = useState<TeachPoint[]>([])
  const [newPointName, setNewPointName] = useState("")

  const handleSavePoint = () => {
    if (!newPointName.trim()) return

    const newPoint: TeachPoint = {
      id: Date.now().toString(),
      name: newPointName,
      angles: { ...currentAngles },
      timestamp: new Date(),
    }

    setTeachPoints([...teachPoints, newPoint])
    setNewPointName("")
  }

  const handleDeletePoint = (id: string) => {
    setTeachPoints(teachPoints.filter((p) => p.id !== id))
  }

  const handleLoadPoint = (point: TeachPoint) => {
    onLoadPosition(point.angles)
  }

  const handlePlaySequence = () => {
    console.log("[v0] Playing sequence:", teachPoints)
    // Implement sequence playback
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BookMarked className="w-5 h-5" />
            Teach Pendant
          </CardTitle>
          <Badge variant="secondary" className="font-mono">
            {teachPoints.length} Points
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Position name..."
            value={newPointName}
            onChange={(e) => setNewPointName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSavePoint()}
            className="text-foreground"
          />
          <Button onClick={handleSavePoint} disabled={!newPointName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        {teachPoints.length > 0 && (
          <Button onClick={handlePlaySequence} variant="secondary" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Play Sequence
          </Button>
        )}

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {teachPoints.map((point, index) => (
            <Card key={point.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{point.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    J1:{point.angles.joint1.toFixed(1)}° J2:{point.angles.joint2.toFixed(1)}° J3:
                    {point.angles.joint3.toFixed(1)}°
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleLoadPoint(point)} variant="outline" size="sm">
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button onClick={() => handleDeletePoint(point.id)} variant="ghost" size="sm">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
