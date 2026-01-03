"use client"

import { useState, useEffect } from "react"
import { RobotArm3D } from "@/components/robot-arm-3d"
import { Gem3DViewer } from "@/components/gem-3d-viewer"
import { CuttingSequenceViewer } from "@/components/cutting-sequence-viewer"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GEM_PATTERNS } from "@/lib/gem-patterns"
import { Box, Terminal, Database, Gem } from "lucide-react"

export default function SimulationPage() {
  const [selectedPattern, setSelectedPattern] = useState(GEM_PATTERNS[0])
  const [currentStep, setCurrentStep] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [gazeboStatus, setGazeboStatus] = useState("Connected")

  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= selectedPattern.facets.length - 1) {
          setIsSimulating(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [isSimulating, selectedPattern])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground p-6 pb-32">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader title="Gazebo Simulation" description="ROS 2 Jazzy & Gazebo Harmony synchronization" />
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
              <Database className="w-3.5 h-3.5 mr-2" />
              Gazebo: {gazeboStatus}
            </Badge>
            <Badge variant="outline" className="border-border px-3 py-1">
              Sync: 12ms
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: 3D Visualization Grid */}
          <div className="col-span-12 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gazebo Viewport */}
              <Card className="bg-[#111] border-border shadow-2xl overflow-hidden aspect-video relative group">
                <CardHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <Box className="w-4 h-4 text-[#F1872D]" />
                      Gazebo Workspace
                    </CardTitle>
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-[10px]">
                      60 FPS
                    </Badge>
                  </div>
                </CardHeader>
                <RobotArm3D jointAngles={{ joint1: 0, joint2: 0, joint3: 0, joint4: 0, joint5: 0, joint6: 0 }} />
              </Card>

              {/* Gem Model Viewer */}
              <Card className="bg-[#111] border-border shadow-2xl overflow-hidden aspect-video relative">
                <CardHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <Gem className="w-4 h-4 text-[#F1872D]" />
                      Gem View: {selectedPattern.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-black/50 backdrop-blur-md text-[10px] border-[#F1872D]/50 text-[#F1872D]"
                    >
                      FACET: {currentStep + 1} / {selectedPattern.facets.length}
                    </Badge>
                  </div>
                </CardHeader>
                <Gem3DViewer pattern={selectedPattern} currentFacet={currentStep} />
              </Card>
            </div>

            {/* Simulation Controls */}
            <Card className="bg-[#111] border-border">
              <CardContent className="p-6">
                <CuttingSequenceViewer
                  pattern={selectedPattern}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  isPlaying={isSimulating}
                  onPlayPause={() => setIsSimulating(!isSimulating)}
                />
              </CardContent>
            </Card>

            {/* Console Output */}
            <Card className="bg-black border-border">
              <CardHeader className="py-3 border-b border-border">
                <CardTitle className="text-xs font-mono flex items-center gap-2 opacity-50">
                  <Terminal className="w-3 h-3" />
                  ROS 2 Log Output
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 font-mono text-[11px] text-green-500/80 h-32 overflow-y-auto space-y-1">
                <div>[INFO] [simulation_node]: Initializing Gazebo Harmony bridge...</div>
                <div>[INFO] [simulation_node]: Loading URDF for Gem Cutting Manipulator</div>
                <div>[INFO] [simulation_node]: Syncing with {selectedPattern.name} trajectory</div>
                <div>[DEBUG] [joint_state_publisher]: Published state for 6 links</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
