import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export type TooltipProps = {
  children: React.ReactNode
  className?: string
  delayDuration?: number
  isEnabled?: boolean
  offset?: [number, number]
}

function Tooltip({
  children,
  delayDuration = 200,
  isEnabled = true,
}: TooltipProps) {
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

function Trigger({ children, className }: TriggerProps) {
  return (
    <TooltipPrimitive.Trigger className={className} asChild>
      {children}
    </TooltipPrimitive.Trigger>
  )
}

interface ContentProps extends TooltipPrimitive.TooltipContentProps {
  children: React.ReactNode
  className?: string
}

function Content({ children, className, side = "top" }: ContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        className={
          className ||
          "p-2 text-xs bg-background dark:bg-zinc-800 rounded-md shadow-md"
        }
        sideOffset={5}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-background dark:fill-zinc-800" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

Tooltip.Trigger = Trigger
Tooltip.Content = Content

export default Tooltip
