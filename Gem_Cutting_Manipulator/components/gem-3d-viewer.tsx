"use client"

import { useRef, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"
import type { GemPattern, Facet } from "@/lib/gem-patterns"

interface Gem3DViewerProps {
  pattern: GemPattern
  currentFacet?: number
  showLabels?: boolean
}

function FacetMesh({ facet, isActive }: { facet: Facet; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert facet parameters to 3D geometry
  const angleRad = (facet.angle * Math.PI) / 180
  const rotationRad = (facet.rotation * Math.PI) / 180
  const depthScale = facet.depth / 100

  return (
    <group rotation={[0, rotationRad, 0]}>
      <mesh ref={meshRef} position={[0, -depthScale * 50, 0]} rotation={[angleRad, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshPhysicalMaterial
          color={isActive ? "#60a5fa" : "#e0e7ff"}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={isActive ? 1 : 0.6}
          side={2}
        />
      </mesh>
      {isActive && (
        <Html position={[0, -depthScale * 50 + 20, 0]} center>
          <div className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-mono text-primary-foreground whitespace-nowrap">
            {facet.name}: {facet.angle}° @ {facet.rotation}°
          </div>
        </Html>
      )}
    </group>
  )
}

function GemModel({ pattern, currentFacet }: { pattern: GemPattern; currentFacet?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  // Create gem base shape
  const facetsToRender = useMemo(() => {
    if (currentFacet === undefined) return pattern.facets
    return pattern.facets.slice(0, currentFacet + 1)
  }, [pattern, currentFacet])

  return (
    <group ref={groupRef}>
      {/* Base gem volume */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[40, 30, 80, 32]} />
        <meshPhysicalMaterial
          color="#c7d2fe"
          metalness={0.1}
          roughness={0.05}
          transmission={0.95}
          thickness={10}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Render facets */}
      {facetsToRender.map((facet, index) => (
        <FacetMesh key={facet.id} facet={facet} isActive={index === currentFacet} />
      ))}
    </group>
  )
}

export function Gem3DViewer({ pattern, currentFacet, showLabels = true }: Gem3DViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <color attach="background" args={["#0f172a"]} />

        <PerspectiveCamera makeDefault position={[120, 80, 120]} fov={45} />

        {/* Lighting for gem */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#60a5fa" />
        <pointLight position={[10, -10, 5]} intensity={0.8} color="#a78bfa" />
        <spotLight position={[0, 15, 0]} angle={0.4} penumbra={1} intensity={1} castShadow />

        <Environment preset="studio" />

        <GemModel pattern={pattern} currentFacet={currentFacet} />

        {/* Platform */}
        <mesh position={[0, -50, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[80, 64]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={100}
          maxDistance={300}
        />
      </Canvas>
    </div>
  )
}
