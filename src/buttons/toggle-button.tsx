import type { ReactNode } from "react"
import { Check } from "lucide-react"
import { Button, type ButtonProps } from "./button"
import { cn } from "../lib/utils"

export type ToggleButtonProps = Omit<ButtonProps, "onChange" | "children" | "variant"> & {
  /** Current on/off state. */
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: ReactNode
  /** Shown instead of `children` while pressed. Defaults to `children`. */
  pressedLabel?: ReactNode
  /** Hide the leading check mark shown in the pressed state. */
  hideCheck?: boolean
}

/**
 * A binary toggle styled as a button whose on/off state is unmistakable: when pressed it
 * switches to the filled `default` variant, gains a check mark, and reports `aria-pressed`.
 * Use instead of a plain `<Button>` for any "show only X" style filter.
 */
export function ToggleButton({
  pressed,
  onPressedChange,
  children,
  pressedLabel,
  hideCheck,
  className,
  size = "sm",
  ...rest
}: ToggleButtonProps) {
  return (
    <Button
      {...rest}
      size={size}
      variant={pressed ? "default" : "outline"}
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(pressed && "ring-1 ring-primary/40", className)}
      onClick={() => onPressedChange(!pressed)}
    >
      {pressed && !hideCheck && <Check className="size-4" />}
      {pressed ? (pressedLabel ?? children) : children}
    </Button>
  )
}
