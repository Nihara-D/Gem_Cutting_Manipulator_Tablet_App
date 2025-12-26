"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"
import type { GemPattern } from "@/lib/gem-patterns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CuttingSequenceViewerProps {
  pattern: GemPattern
  currentStep: number
  onStepChange: (step: number) => void
  isPlaying?: boolean
  onPlayPause?: () => void
}

export function CuttingSequenceViewer({
  pattern,
  currentStep,
  onStepChange,
  isPlaying = false,
  onPlayPause,
}: CuttingSequenceViewerProps) {
  const sortedFacets = [...pattern.facets].sort((a, b) => a.order - b.order)
  const progress = ((currentStep + 1) / sortedFacets.length) * 100

  const handlePrevious = () => {
    if (currentStep > 0) onStepChange(currentStep - 1)
  }

  const handleNext = () => {
    if (currentStep < sortedFacets.length - 1) onStepChange(currentStep + 1)
  }

  const handleReset = () => {
    onStepChange(0)
  }

  const currentFacet = sortedFacets[currentStep]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Cutting Sequence</CardTitle>
          <Badge variant="secondary" className="font-mono">
            {currentStep + 1} / {sortedFacets.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Step Info */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Current Facet</span>
              <Badge variant="default">{currentFacet.name}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div>
                <div className="text-xs text-muted-foreground">Angle</div>
                <div className="text-lg font-mono font-semibold text-foreground">{currentFacet.angle}°</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Rotation</div>
                <div className="text-lg font-mono font-semibold text-foreground">{currentFacet.rotation}°</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Depth</div>
                <div className="text-lg font-mono font-semibold text-foreground">{currentFacet.depth}%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span className="font-mono">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={handlePrevious} variant="outline" size="sm" disabled={currentStep === 0}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button onClick={onPlayPause} variant="default" size="sm" className="flex-1">
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleNext} variant="outline" size="sm" disabled={currentStep === sortedFacets.length - 1}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Facet List */}
        <ScrollArea className="h-[300px] rounded-md border border-border p-2">
          <div className="space-y-2">
            {sortedFacets.map((facet, index) => (
              <button
                key={facet.id}
                onClick={() => onStepChange(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                      ? "bg-muted/50 text-muted-foreground"
                      : "bg-card hover:bg-muted/30 text-card-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={index === currentStep ? "secondary" : "outline"} className="text-xs">
                      {facet.order}
                    </Badge>
                    <span className="text-sm font-medium">{facet.name}</span>
                  </div>
                  {index < currentStep && (
                    <Badge variant="secondary" className="text-xs">
                      Done
                    </Badge>
                  )}
                </div>
                <div className="flex gap-4 mt-1 text-xs font-mono opacity-80">
                  <span>∠{facet.angle}°</span>
                  <span>↻{facet.rotation}°</span>
                  <span>↓{facet.depth}%</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
