import { cva, type VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "./utils"

const variants = {
  variant: {
    primary: "rounded-xl bg-primary border text-primary",
    secondary: "rounded-xl bg-muted text-primary",
    outline: "bg-background rounded-xl backdrop-blur-md border hover:bg-muted",
    minimal: "rounded-xl hover:bg-muted text-primary",
    ghost: "",
    destructive:
      "rounded-xl border hover:border-destructive hover:text-destructive",
    accent: "rounded-xl bg-accent text-background",
    tabSelected:
      "rounded-xl font-medium shadow-sm bg-background text-foreground border text-sm",
    tab: "rounded-xl text-muted-secondary border-transparent text-sm",
    rounded: "rounded-full hover:bg-muted",
  },
  size: {
    xs: "text-sm tracking-wide p-2",
    sm: "size-sm px-4 h-10",
    md: "text-base px-4 h-10",
    lg: "text-lg px-8 h-10",
    icon: "h-8 w-8",
    "icon-sm": "h-6 w-6",
    none: "",
  },
  alignment: {
    center: "justify-center text-center",
    left: "justify-start text-left",
  },
  width: {
    default: "inline-flex",
    full: "w-full flex",
  },
}

const buttonBaseStyles =
  "whitespace-nowrap overflow-x-hidden items-center gap-2 font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed group relative shrink-0 text-sm"

const buttonVariants = cva(buttonBaseStyles, {
  variants,
  defaultVariants: {
    variant: "primary",
    size: "sm",
    width: "default",
    alignment: "center",
  },
})

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  children?: ReactNode
}

export default function Button({
  children,
  variant,
  size,
  width,
  alignment,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, width, alignment }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
