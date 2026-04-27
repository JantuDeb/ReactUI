import React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "../buttons/button"
import { cn } from "../lib/utils"

interface PageHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  badges?: React.ReactNode
  actions?: React.ReactNode
  onBack?: () => void
  className?: string
}

export function PageHeader({ title, subtitle, badges, actions, onBack, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            {badges}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
    </div>
  )
}
