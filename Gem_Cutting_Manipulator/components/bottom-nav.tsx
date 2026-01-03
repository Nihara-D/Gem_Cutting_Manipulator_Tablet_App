"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Move, Gem, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/control", icon: Move, label: "Control" },
  { href: "/simulation", icon: Gem, label: "Simulation" },
  { href: "/hardware", icon: Activity, label: "Hardware" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-24 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 px-6 py-3 rounded-xl transition-all min-w-[90px]",
              isActive
                ? "text-[#A17F66] bg-[#D7BFA8]/30 font-bold"
                : "text-[#A17F66]/70 hover:text-[#A17F66] hover:bg-[#D7BFA8]/10",
            )}
          >
            <Icon className="w-7 h-7" />
            <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
