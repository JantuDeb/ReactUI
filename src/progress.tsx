import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@common/utils"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion } from "framer-motion"
// Define size variants for the root element
const progressRootVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        small: "h-1",
        medium: "h-2",
        large: "h-4",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
)

// Define variant styles for the indicator element
const progressIndicatorVariants = cva("h-full transition-all w-full", {
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      danger: "bg-destructive",
      accent: "bg-accent",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressRootVariants> &
  VariantProps<typeof progressIndicatorVariants> & {
    value?: number
  }

export default function Progress({
  className,
  size,
  variant,
  value,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn(progressRootVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressIndicatorVariants({ variant })}
        // style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        asChild
      >
        <motion.div
          initial={{ transform: `translateX(-100%)` }}
          animate={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          transition={{ duration: 0.5 }} // Adjust the duration as needed
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

Progress.displayName = ProgressPrimitive.Root.displayName
