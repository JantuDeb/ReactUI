import React from "react"
import { Separator } from "../separator"
import { cn } from "../lib/utils"

interface StatProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function Stat({ label, value, className }: StatProps) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cn("font-semibold", className)}>{value}</span>
    </div>
  )
}

export function StatsBar({ children, className }: { children: React.ReactNode; className?: string }) {
  const items = React.Children.toArray(children)
  return (
    <div className={cn("flex items-center gap-4 text-sm border-b border-border pb-3", className)}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Separator orientation="vertical" className="h-4" />}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}
