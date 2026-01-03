"use client"

import { useEffect, useState } from "react"
import { rosConnection } from "@/lib/ros-connection"

export function useROSTopic<T>(topic: string, messageType: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const unsubscribe = rosConnection.subscribe(topic, messageType, (msg: T) => {
      setData(msg)
      setLastUpdate(new Date())
    })

    return unsubscribe
  }, [topic, messageType])

  return { data, lastUpdate }
}

export function publishToTopic(topic: string, messageType: string, message: any) {
  rosConnection.publish(topic, messageType, message)
}
