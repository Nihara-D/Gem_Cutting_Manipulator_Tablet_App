"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gem, Clock, TrendingUp, Package } from "lucide-react"
import type { GemPattern } from "@/lib/gem-patterns"

interface PatternInfoCardProps {
  pattern: GemPattern
}

export function PatternInfoCard({ pattern }: PatternInfoCardProps) {
  const difficultyColor = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-red-500",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gem className="w-5 h-5" />
            {pattern.name}
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {pattern.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{pattern.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Gem Type</div>
              <div className="text-sm font-medium text-foreground">{pattern.gemType}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Facets</div>
              <div className="text-sm font-medium text-foreground">{pattern.facets.length}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Est. Time</div>
              <div className="text-sm font-medium text-foreground">{pattern.estimatedTime} min</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${difficultyColor[pattern.difficulty]}`} />
            <div>
              <div className="text-xs text-muted-foreground">Difficulty</div>
              <div className="text-sm font-medium capitalize text-foreground">{pattern.difficulty}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
