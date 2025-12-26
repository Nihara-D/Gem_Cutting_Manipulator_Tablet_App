// Robot arm kinematics and motion utilities
export interface JointAngles {
  joint1: number // Base rotation
  joint2: number // Shoulder
  joint3: number // Elbow
  joint4: number // Wrist pitch
  joint5: number // Wrist roll
  joint6: number // End effector
}

export interface CartesianPosition {
  x: number
  y: number
  z: number
  roll: number
  pitch: number
  yaw: number
}

// DH parameters for 6DOF arm (adjust based on your specific robot)
export const DH_PARAMS = {
  // Link lengths in mm
  links: [0, 105, 105, 130, 0, 50],
  // Joint limits in degrees
  limits: {
    joint1: { min: -170, max: 170 },
    joint2: { min: -90, max: 90 },
    joint3: { min: -90, max: 90 },
    joint4: { min: -90, max: 90 },
    joint5: { min: -170, max: 170 },
    joint6: { min: -170, max: 170 },
  },
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

export function clampJointAngle(joint: keyof JointAngles, angle: number): number {
  const limits = DH_PARAMS.limits[joint]
  return Math.max(limits.min, Math.min(limits.max, angle))
}

export function validateJointAngles(angles: JointAngles): boolean {
  return Object.entries(angles).every(([joint, angle]) => {
    const limits = DH_PARAMS.limits[joint as keyof JointAngles]
    return angle >= limits.min && angle <= limits.max
  })
}

// Forward kinematics - convert joint angles to end effector position
export function forwardKinematics(angles: JointAngles): CartesianPosition {
  const { joint1, joint2, joint3, joint4, joint5, joint6 } = angles
  const [l0, l1, l2, l3, l4, l5] = DH_PARAMS.links

  const r1 = degreesToRadians(joint1)
  const r2 = degreesToRadians(joint2)
  const r3 = degreesToRadians(joint3)
  const r4 = degreesToRadians(joint4)
  const r5 = degreesToRadians(joint5)
  const r6 = degreesToRadians(joint6)

  // Simplified forward kinematics
  const x = Math.cos(r1) * (l2 * Math.cos(r2) + l3 * Math.cos(r2 + r3) + l4 * Math.cos(r2 + r3 + r4))
  const y = Math.sin(r1) * (l2 * Math.cos(r2) + l3 * Math.cos(r2 + r3) + l4 * Math.cos(r2 + r3 + r4))
  const z = l1 + l2 * Math.sin(r2) + l3 * Math.sin(r2 + r3) + l4 * Math.sin(r2 + r3 + r4)

  return {
    x,
    y,
    z,
    roll: r5,
    pitch: r2 + r3 + r4,
    yaw: r1,
  }
}

// Servo angle conversion (MG996R servo range 0-180 degrees to joint angles)
export function servoAngleToJointAngle(servoAngle: number, joint: keyof JointAngles): number {
  const limits = DH_PARAMS.limits[joint]
  const range = limits.max - limits.min
  return limits.min + (servoAngle / 180) * range
}

export function jointAngleToServoAngle(jointAngle: number, joint: keyof JointAngles): number {
  const limits = DH_PARAMS.limits[joint]
  const range = limits.max - limits.min
  return ((jointAngle - limits.min) / range) * 180
}
