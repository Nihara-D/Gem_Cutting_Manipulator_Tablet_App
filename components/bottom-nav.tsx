"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Move, Gem, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/control", icon: Move, label: "Control" },
  { href: "/patterns", icon: Gem, label: "Patterns" },
  { href: "/hardware", icon: Activity, label: "Hardware" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-20 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-colors min-w-[80px]",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
