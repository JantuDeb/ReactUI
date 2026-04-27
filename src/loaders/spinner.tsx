import { LoaderCircleIcon } from "lucide-react"
import React from "react"
import { cva, VariantProps } from "class-variance-authority"

const spinnerVariants = cva("flex items-center justify-center animate-spin", {
  variants: {
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      danger: "text-destructive",
      success: "text-success",
    },
    size: {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

const colorMap: Record<string, string> = {
  primary: "#4F46E5",
  secondary: "#6B7280",
  danger: "#DC2626",
  success: "#16A34A",
}

const sizeMap: Record<string, number> = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
}

const Spinner = ({ color = "primary", size = "md", className = "" }: SpinnerProps) => (
  <span className={spinnerVariants({ color, size, className })} aria-label="Loading">
    <LoaderCircleIcon size={sizeMap[size as string]} color={colorMap[color as string]} />
  </span>
)

export default Spinner
