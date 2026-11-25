import React, { useMemo, useState } from "react"
import { Loader2, TriangleAlertIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"

const headerVariants = cva("", {
  variants: {
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
  },
  defaultVariants: {
    align: "center",
  },
})

const descriptionVariants = cva("", {
  variants: {
    align: {
      start: "text-left",
      center: "text-center",
      end: "text-right",
    },
  },
  defaultVariants: {
    align: "center",
  },
})

const iconWrapperVariants = cva(
  "mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10",
  {
    variants: {
      align: {
        start: "mx-0 self-start",
        center: "mx-auto self-center",
        end: "ml-auto self-end",
      },
    },
    defaultVariants: {
      align: "center",
    },
  },
)

const footerVariants = cva("flex-col-reverse sm:flex-row", {
  variants: {
    align: {
      start: "sm:justify-start",
      center: "sm:justify-center",
      end: "sm:justify-end",
      between: "sm:justify-between",
    },
  },
  defaultVariants: {
    align: "end",
  },
})

type HeaderAlign = NonNullable<VariantProps<typeof headerVariants>["align"]>
type FooterAlign = NonNullable<VariantProps<typeof footerVariants>["align"]>

export type ConfirmationDialogProps = {
  // Trigger and controlled state
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // Content
  header: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode

  // Buttons
  submitLabel?: string
  cancelLabel?: string
  // Keys: 'submit' (primary) and 'cancel' (secondary)
  buttonVariantProps?: {
    submit?: React.ComponentProps<typeof AlertDialogAction>
    cancel?: React.ComponentProps<typeof AlertDialogCancel>
  }

  // Behavior
  submitFunction: () => Promise<any>
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
  closeOnSuccess?: boolean

  // Layout/alignment via cva
  align?: HeaderAlign // aligns header + description + icon
  footerAlign?: FooterAlign

  // Optional className overrides
  contentClassName?: string
  headerClassName?: string
  descriptionClassName?: string
  footerClassName?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  trigger,
  open: controlledOpen,
  onOpenChange,
  header: title,
  description,
  icon,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  buttonVariantProps,
  submitFunction,
  onSuccess,
  onError,
  closeOnSuccess = true,
  align = "center",
  footerAlign = "end",
  contentClassName,
  headerClassName,
  descriptionClassName,
  footerClassName,
}) => {
  const isControlled = typeof controlledOpen === "boolean"
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (next: boolean) => {
    onOpenChange?.(next)
    if (!isControlled) setUncontrolledOpen(next)
  }

  const defaultIcon = useMemo(() => <TriangleAlertIcon className="size-6 text-destructive" />, [])

  const defaultSubmitClass =
    "bg-destructive text-white hover:bg-destructive focus-visible:ring-destructive dark:bg-destructive/60"

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault?.()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const result = await submitFunction()
      onSuccess?.(result)
      if (closeOnSuccess) setOpen(false)
    } catch (err) {
      onError?.(err)
      // keep dialog open on error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent className={contentClassName}>
        <AlertDialogHeader className={cn(headerVariants({ align }), headerClassName)}>
          <div className={iconWrapperVariants({ align })}>{icon ?? defaultIcon}</div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className={cn(descriptionVariants({ align }), descriptionClassName)}>
              {description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(footerVariants({ align: footerAlign }), footerClassName)}>
          <AlertDialogCancel
            {...buttonVariantProps?.cancel}
            disabled={isSubmitting || buttonVariantProps?.cancel?.disabled}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            {...buttonVariantProps?.submit}
            onClick={handleSubmit}
            disabled={!submitFunction || isSubmitting || buttonVariantProps?.submit?.disabled}
            className={cn(defaultSubmitClass, buttonVariantProps?.submit?.className)}
          >
            {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {submitLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmationDialog
