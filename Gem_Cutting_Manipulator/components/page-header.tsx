"use client"

import { ConnectionStatus } from "@/components/connection-status"
import { useROSConnection } from "@/hooks/use-ros-connection"

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const { status: rosStatus, connect } = useROSConnection()

  return (
    <div className="flex items-center justify-between pb-4 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <ConnectionStatus status={rosStatus} onReconnect={connect} />
    </div>
  )
}
