"use client"

import { useState, useEffect } from "react"
import { Gem3DViewer } from "@/components/gem-3d-viewer"
import { CuttingSequenceViewer } from "@/components/cutting-sequence-viewer"
import { FacetParametersTable } from "@/components/facet-parameters-table"
import { PatternInfoCard } from "@/components/pattern-info-card"
import { PatternLibrary } from "@/components/pattern-library"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { GEM_PATTERNS } from "@/lib/gem-patterns"

export default function PatternsPage() {
  const [selectedPattern, setSelectedPattern] = useState(GEM_PATTERNS[0])
  const [currentCuttingStep, setCurrentCuttingStep] = useState(0)
  const [isCuttingPlaying, setIsCuttingPlaying] = useState(false)

  useEffect(() => {
    if (!isCuttingPlaying) return

    const interval = setInterval(() => {
      setCurrentCuttingStep((prev) => {
        if (prev >= selectedPattern.facets.length - 1) {
          setIsCuttingPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isCuttingPlaying, selectedPattern])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1920px] mx-auto space-y-4">
        <PageHeader title="Gem Patterns" description="Pattern library and cutting sequences" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pattern Library */}
          <div className="lg:col-span-1">
            <PatternLibrary onSelectPattern={setSelectedPattern} selectedPattern={selectedPattern} />
          </div>

          {/* Gem Viewer and Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[500px] rounded-lg border border-border overflow-hidden bg-card">
              <Gem3DViewer pattern={selectedPattern} currentFacet={currentCuttingStep} showLabels={true} />
            </div>

            <PatternInfoCard pattern={selectedPattern} />

            <CuttingSequenceViewer
              pattern={selectedPattern}
              currentStep={currentCuttingStep}
              onStepChange={setCurrentCuttingStep}
              isPlaying={isCuttingPlaying}
              onPlayPause={() => setIsCuttingPlaying(!isCuttingPlaying)}
            />

            <FacetParametersTable pattern={selectedPattern} currentFacet={currentCuttingStep} />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
