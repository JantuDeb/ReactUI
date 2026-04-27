import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "../lib/utils"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  children?: React.ReactNode
  className?: string
}

export const EmptyState = ({ title, description, icon: Icon, children, className }: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500",
        className,
      )}
    >
      <div className="max-w-[420px] text-center flex flex-col items-center">
        {/* Icon Container */}
        {Icon && (
          <div className="mb-6 relative">
            {/* Subtle glow effect for dark mode */}
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
              <Icon size={40} className="text-primary/80" />
            </div>
          </div>
        )}

        {/* Text Content */}
        <h3 className="text-xl font-semibold text-primary tracking-tight">{title}</h3>

        {description && <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{description}</p>}

        {/* Action Element (The children) */}
        {children && <div className="mt-8 w-full flex justify-center">{children}</div>}
      </div>
    </div>
  )
}
