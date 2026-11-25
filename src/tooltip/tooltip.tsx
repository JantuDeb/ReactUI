import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../lib/utils"

export type TooltipProps = {
  children: React.ReactNode
  className?: string
  delayDuration?: number
  isEnabled?: boolean
  offset?: [number, number]
}

function Tooltip({ children, delayDuration = 200, isEnabled = true }: TooltipProps) {
  if (!isEnabled) {
    return <>{children}</>
  }

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

interface TriggerProps {
  children: React.ReactNode
  className?: string
}

export function Trigger({ children, className }: TriggerProps) {
  return (
    <TooltipPrimitive.Trigger className={className} asChild>
      {children}
    </TooltipPrimitive.Trigger>
  )
}

export interface ContentProps extends TooltipPrimitive.TooltipContentProps {
  children: React.ReactNode
  className?: string
}

export function Content({ children, className, side = "top", ...contentProps }: ContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={5}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...contentProps}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

Tooltip.Trigger = Trigger
Tooltip.Content = Content

export default Tooltip
