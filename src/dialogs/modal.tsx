import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog"
import { Button, ButtonProps } from "../buttons/button"
import { DialogProps, DialogContentProps } from "@radix-ui/react-dialog"
import { cn } from "../lib/utils"
import React from "react"

export type ModalAction = {
  id: string
  label: string
} & Omit<ButtonProps, "onClick" | "children">

export type ModalProps = {
  header?: React.ReactNode
  description?: React.ReactNode
  actions?: ModalAction[]
  actionsWidth?: "full" | "fit"
  actionsALign?: "start" | "center" | "end"
  children?: React.ReactNode
  onActionClick?: (actionId: string) => void
  trigger?: React.ReactElement
} & DialogProps &
  DialogContentProps

const ACTIONS_ALIGN_CLASSES = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
}

export function Modal({
  open,
  onOpenChange,
  header,
  description,
  actions = [],
  onActionClick,
  children,
  actionsWidth = "fit",
  actionsALign = "start",
  defaultOpen,
  modal,
  className,
  trigger,
  ...contentProps
}: ModalProps) {
  const handleActionClick = (action: ModalAction) => {
    if (action.id === "close") {
      onOpenChange?.(false)
    }
    onActionClick?.(action.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={modal} defaultOpen={defaultOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className={cn("p-4", className)} {...contentProps}>
        <DialogHeader>
          {header && <DialogTitle>{header}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {actions.length > 0 && (
          <DialogFooter className={ACTIONS_ALIGN_CLASSES[actionsALign]}>
            {actions.map((action) => (
              <Button
                key={action.id}
                className={actionsWidth === "full" ? "flex-1" : "w-fit"}
                type="button"
                onClick={() => handleActionClick(action)}
                {...action}
              >
                {action.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
