import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetContentProps,
  SheetTrigger,
} from "./sheet"
import { Button, ButtonProps } from "../buttons/button"
import { DialogContentProps, DialogProps } from "@radix-ui/react-dialog"
import { cn } from "../lib/utils"

export type SidePanelAction = {
  id: string
  label: string
} & Omit<ButtonProps, "onClick" | "children">

type SidePanelProps = {
  header?: React.ReactNode
  description?: React.ReactNode
  actions?: SidePanelAction[]
  actionsOrientation?: "horizontal" | "vertical"
  children?: React.ReactNode
  onActionClick?: (actionId: string) => void
  trigger?: React.ReactNode
  showCloseIcon?: boolean
  showCloseButton?: boolean
} & DialogProps &
  SheetContentProps

const ORIENTATION_CLASSES = {
  horizontal: "flex-row",
  vertical: "flex-col",
}
export function SidePanel({
  open,
  onOpenChange,
  header,
  description,
  actions = [],
  onActionClick,
  children,
  actionsOrientation = "horizontal",
  defaultOpen,
  modal,
  className,
  trigger,
  showCloseIcon,
  showCloseButton,
  ...contentProps
}: SidePanelProps) {
  const handleActionClick = (action: SidePanelAction) => {
    if (action.id === "close") {
      onOpenChange?.(false)
    }
    onActionClick?.(action.id)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={modal} defaultOpen={defaultOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="p-2" showCloseButton={showCloseIcon || showCloseButton} {...contentProps}>
        <SheetHeader className="border-b pb-2">
          {header && <SheetTitle>{header}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div
          className={cn("flex-1 overflow-y-auto scroll-smooth", className)}
          style={{
            scrollbarGutter: "stable",
          }}
        >
          {children}
        </div>
        {actions.length > 0 && (
          <SheetFooter className={ORIENTATION_CLASSES[actionsOrientation]}>
            {actions.map((action) => (
              <Button
                key={action.id}
                className="flex-1"
                type="button"
                onClick={() => handleActionClick(action)}
                {...action}
              >
                {action.label}
              </Button>
            ))}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
