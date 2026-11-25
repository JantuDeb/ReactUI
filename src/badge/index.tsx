import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm py-0.5 border px-2 text-xs leading-none font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        muted: "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
        success: "border-transparent bg-success text-success-foreground [a&]:hover:bg-success/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

/**
 * Semantic status tones shared by every table/list in the admin.
 * Use these instead of hand-picking a Badge variant per page so the same
 * semantic role always renders identically.
 */
export type StatusTone = "positive" | "negative" | "warning" | "neutral" | "info"

const statusToneVariant: Record<StatusTone, VariantProps<typeof badgeVariants>["variant"]> = {
  positive: "success",
  negative: "destructive",
  warning: "outline",
  neutral: "muted",
  info: "secondary",
}

export type StatusBadgeProps = Omit<React.ComponentProps<typeof Badge>, "variant"> & {
  tone?: StatusTone
}

/** Badge for a semantic status value (published/pending/closed/…). */
function StatusBadge({ tone = "neutral", ...props }: StatusBadgeProps) {
  return <Badge variant={statusToneVariant[tone]} {...props} />
}

export type BooleanBadgeProps = Omit<React.ComponentProps<typeof Badge>, "variant" | "children"> & {
  value: boolean | null | undefined
  trueLabel?: string
  falseLabel?: string
  /** Tone used when `value` is false. Defaults to a quiet "neutral". */
  falseTone?: StatusTone
}

/**
 * Badge for a boolean/flag column (Featured, Enabled, Public, Active…).
 * Always renders a badge for both states so columns stay visually aligned.
 */
function BooleanBadge({
  value,
  trueLabel = "Yes",
  falseLabel = "No",
  falseTone = "neutral",
  ...props
}: BooleanBadgeProps) {
  return (
    <StatusBadge tone={value ? "positive" : falseTone} {...props}>
      {value ? trueLabel : falseLabel}
    </StatusBadge>
  )
}

export { Badge, badgeVariants, StatusBadge, BooleanBadge, statusToneVariant }
