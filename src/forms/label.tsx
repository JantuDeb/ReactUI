import Svg from "@common/svg"
import Tooltip from "@common/tooltip"
import { ReactNode } from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@common/utils"

interface LabelBaseProps {
  id?: string
  label?: ReactNode
  children?: ReactNode
  description?: string
  position?: "top" | "left" | "right"
  required?: boolean
  info?: ReactNode
  disabled?: boolean
}
// Position Variants
const labelPositionVariants = cva("gap-2 flex", {
  variants: {
    position: {
      top: "flex-col",
      left: "items-center grid grid-cols-6",
      right: "items-center flex-row-reverse justify-end",
    },
  },
  defaultVariants: {
    position: "top",
  },
})

// Font Variants
const labelFontVariants = cva(
  "items-center text-primary flex text-sm space-x-2 select-none w-full",
  {
    variants: {
      font: {
        normal: "font-normal",
        semibold: "font-semibold",
      },
      cursor: {
        default: "cursor-default",
        pointer: "cursor-pointer",
      },
    },
    defaultVariants: {
      font: "semibold",
      cursor: "default",
    },
  },
)

export type LabelProps = VariantProps<typeof labelPositionVariants> &
  VariantProps<typeof labelFontVariants> &
  LabelBaseProps

export default function Label({
  id,
  label,
  children,
  description,
  position,
  required,
  info,
  disabled = false,
  font,
  cursor,
}: LabelProps) {
  return (
    <div className={labelPositionVariants({ position: position })}>
      {label && (
        <div className="relative col-span-2">
          <label
            htmlFor={id}
            style={{
              overflowWrap: "anywhere",
            }}
            className={cn(
              disabled ? "disabled" : "",
              labelFontVariants({ font, cursor }),
            )}
          >
            {label}
            {required && typeof label == "string" && (
              <span className="mx-1">*</span>
            )}
            {info && <span className="mx-1">{renderTooltip()}</span>}
          </label>
        </div>
      )}
      <div className={position === "left" ? "col-span-4" : ""}>{children}</div>
      {description && renderDescription(description)}
    </div>
  )

  function renderTooltip() {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <Svg name="question-mark-circle" className="w-4 h-4 text-secondary" />
        </Tooltip.Trigger>
        <Tooltip.Content>{info}</Tooltip.Content>
      </Tooltip>
    )
  }

  function renderDescription(description?: string) {
    return (
      <div className="text-sm font-normal text-secondary max-w-full">
        {description}
      </div>
    )
  }
}
