"use client"

import { useEffect, useState } from "react"
import { rosConnection, type ConnectionStatus } from "@/lib/ros-connection"

export function useROSConnection() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")

  useEffect(() => {
    const unsubscribe = rosConnection.onStatusChange(setStatus)
    rosConnection.connect()

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    status,
    isConnected: status === "connected",
    connect: () => rosConnection.connect(),
    disconnect: () => rosConnection.disconnect(),
  }
}

export const useRosConnection = useROSConnection
