"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, Environment, Html } from "@react-three/drei"
import type * as THREE from "three"
import type { JointAngles } from "@/lib/robot-kinematics"
import { DH_PARAMS } from "@/lib/robot-kinematics"

interface RobotArm3DProps {
  jointAngles: JointAngles
  showLabels?: boolean
  showGrid?: boolean
  showAxes?: boolean
}

function RobotLink({
  length,
  position,
  rotation,
  color = "#6366f1",
  label,
}: {
  length: number
  position: [number, number, number]
  rotation: [number, number, number]
  color?: string
  label?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[8, 8, length, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {label && (
        <Html position={[0, length / 2 + 15, 0]} center>
          <div className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground border border-border">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

function RobotJoint({
  position,
  rotation,
  label,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  label?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <sphereGeometry args={[12, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
      </mesh>
      {label && (
        <Html position={[20, 0, 0]} center>
          <div className="bg-primary/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-primary-foreground">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

function RobotArmModel({ jointAngles, showLabels }: { jointAngles: JointAngles; showLabels: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const { joint1, joint2, joint3, joint4, joint5, joint6 } = jointAngles
  const [l0, l1, l2, l3, l4, l5] = DH_PARAMS.links

  const r1 = (joint1 * Math.PI) / 180
  const r2 = (joint2 * Math.PI) / 180
  const r3 = (joint3 * Math.PI) / 180
  const r4 = (joint4 * Math.PI) / 180
  const r5 = (joint5 * Math.PI) / 180
  const r6 = (joint6 * Math.PI) / 180

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh position={[0, -20, 0]} receiveShadow>
        <cylinderGeometry args={[50, 60, 40, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Joint 1 - Base rotation */}
      <group rotation={[0, r1, 0]}>
        <RobotJoint position={[0, 0, 0]} rotation={[0, 0, 0]} label={showLabels ? "J1" : undefined} />

        {/* Link 1 */}
        <RobotLink
          length={l1}
          position={[0, l1 / 2, 0]}
          rotation={[0, 0, 0]}
          color="#6366f1"
          label={showLabels ? "Link 1" : undefined}
        />

        {/* Joint 2 - Shoulder */}
        <group position={[0, l1, 0]} rotation={[0, 0, r2]}>
          <RobotJoint position={[0, 0, 0]} rotation={[0, 0, 0]} label={showLabels ? "J2" : undefined} />

          {/* Link 2 */}
          <RobotLink
            length={l2}
            position={[0, l2 / 2, 0]}
            rotation={[0, 0, 0]}
            color="#8b5cf6"
            label={showLabels ? "Link 2" : undefined}
          />

          {/* Joint 3 - Elbow */}
          <group position={[0, l2, 0]} rotation={[0, 0, r3]}>
            <RobotJoint position={[0, 0, 0]} rotation={[0, 0, 0]} label={showLabels ? "J3" : undefined} />

            {/* Link 3 */}
            <RobotLink
              length={l3}
              position={[0, l3 / 2, 0]}
              rotation={[0, 0, 0]}
              color="#06b6d4"
              label={showLabels ? "Link 3" : undefined}
            />

            {/* Joint 4 - Wrist pitch */}
            <group position={[0, l3, 0]} rotation={[0, 0, r4]}>
              <RobotJoint position={[0, 0, 0]} rotation={[0, 0, 0]} label={showLabels ? "J4" : undefined} />

              {/* Link 4 */}
              <RobotLink
                length={l4}
                position={[0, l4 / 2, 0]}
                rotation={[0, 0, 0]}
                color="#10b981"
                label={showLabels ? "Link 4" : undefined}
              />

              {/* Joint 5 - Wrist roll */}
              <group position={[0, l4, 0]} rotation={[r5, 0, 0]}>
                <RobotJoint position={[0, 0, 0]} rotation={[0, 0, 0]} label={showLabels ? "J5" : undefined} />

                <RobotLink
                  length={l5}
                  position={[0, l5 / 2, 0]}
                  rotation={[0, 0, 0]}
                  color="#f59e0b"
                  label={showLabels ? "Link 5" : undefined}
                />

                {/* Joint 6 - End effector rotation */}
                <group position={[0, l5, 0]} rotation={[0, r6, 0]}>
                  <RobotJoint position={[0, 0, 0]} rotation={[0, 0, 0]} label={showLabels ? "J6" : undefined} />

                  <group position={[0, 15, 0]}>
                    {/* Finger base/palm */}
                    <mesh castShadow>
                      <boxGeometry args={[15, 10, 15]} />
                      <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
                    </mesh>

                    {/* Single finger */}
                    <mesh position={[0, 5, 8]} rotation={[0.3, 0, 0]} castShadow>
                      <boxGeometry args={[8, 30, 8]} />
                      <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.4} />
                    </mesh>

                    {/* Finger tip */}
                    <mesh position={[0, 18, 18]} rotation={[0.3, 0, 0]} castShadow>
                      <coneGeometry args={[4, 10, 8]} />
                      <meshStandardMaterial color="#b91c1c" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {showLabels && (
                      <Html position={[0, 35, 0]} center>
                        <div className="bg-destructive/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-destructive-foreground">
                          Single Finger
                        </div>
                      </Html>
                    )}
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Work surface */}
      <mesh position={[0, -40, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#334155" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  )
}

export function RobotArm3D({ jointAngles, showLabels = true, showGrid = true, showAxes = true }: RobotArm3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [300, 200, 300], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0f172a"]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-10, 10, -5]} intensity={0.5} />
        <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

        {/* Environment */}
        <Environment preset="warehouse" />

        {/* Grid */}
        {showGrid && (
          <Grid args={[500, 500]} cellSize={50} cellThickness={0.5} cellColor="#334155" fadeDistance={800} />
        )}

        {/* Robot Arm */}
        <RobotArmModel jointAngles={jointAngles} showLabels={showLabels} />

        {/* Controls */}
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
