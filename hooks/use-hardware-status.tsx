"use client"

import { useState, useEffect } from "react"
import type { HardwareStatus } from "@/types/hardware"
import { useROSTopic } from "./use-ros-topic"

const INITIAL_HARDWARE_STATUS: HardwareStatus = {
  esp32: {
    connected: false,
    uptime: 0,
    freeMemory: 0,
    wifiSignal: -70,
  },
  raspberryPi: {
    connected: false,
    cpuUsage: 0,
    temperature: 0,
    memoryUsage: 0,
    diskUsage: 0,
  },
  pca9685: {
    connected: false,
    i2cAddress: "0x40",
    frequency: 50,
  },
  powerSupply: {
    voltage5v: 5.0,
    current5v: 0,
    voltage20v: 20.0,
    current20v: 0,
  },
  servos: Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    joint: `Joint ${i + 1}`,
    angle: 0,
    load: 0,
    temperature: 25.0,
    voltage: 5.0,
    status: "ok" as const,
  })),
}
// </CHANGE>

export function useHardwareStatus() {
  const [status, setStatus] = useState<HardwareStatus>(INITIAL_HARDWARE_STATUS)

  // Subscribe to hardware status topic from ROS
  const { data: rosHardwareStatus } = useROSTopic<any>("/hardware_status", "std_msgs/String", {})

  useEffect(() => {
    if (rosHardwareStatus && Object.keys(rosHardwareStatus).length > 0) {
      setStatus(rosHardwareStatus)
    } else {
      // Generate mock data for demonstration
      const mockInterval = setInterval(() => {
        setStatus((prev) => ({
          esp32: {
            connected: true,
            uptime: prev.esp32.uptime + 1,
            freeMemory: 200000 + Math.random() * 50000,
            wifiSignal: -70 + Math.random() * 10,
          },
          raspberryPi: {
            connected: true,
            cpuUsage: 20 + Math.random() * 30,
            temperature: 45 + Math.random() * 10,
            memoryUsage: 40 + Math.random() * 20,
            diskUsage: 35 + Math.random() * 5,
          },
          pca9685: {
            connected: true,
            i2cAddress: "0x40",
            frequency: 50,
          },
          powerSupply: {
            voltage5v: 4.98 + Math.random() * 0.04,
            current5v: 2.1 + Math.random() * 0.5,
            voltage20v: 19.8 + Math.random() * 0.4,
            current20v: 1.5 + Math.random() * 0.8,
          },
          servos: prev.servos.map((servo, i) => ({
            ...servo,
            angle: 90 + Math.sin(Date.now() / 1000 + i) * 30,
            load: 30 + Math.random() * 40,
            temperature: 40 + Math.random() * 15,
            voltage: 4.8 + Math.random() * 0.4,
            status: servo.load > 80 ? ("warning" as const) : ("ok" as const),
          })),
        }))
      }, 1000)

      return () => clearInterval(mockInterval)
    }
  }, [rosHardwareStatus])

  return status
}
