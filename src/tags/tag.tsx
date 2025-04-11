
import * as React from "react"
import { isFunction, cn } from "@common/utils"
import Svg from "@common/svg"
import { cva, type VariantProps } from "class-variance-authority"

const tagVariants = cva(
  "truncate text-ellipsis break-all inline-flex gap-[4px] items-center px-[7px] py-[3px] rounded-xl font-semibold px-3 py-1",
  {
    variants: {
      size: {
        default: "text-sm",
        xs: "text-xs",
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
        xl: "text-xl",
      },
      color: {
        //NOTE: bg-cutomColor/opacity wont work: https://github.com/tailwindlabs/tailwindcss/issues/1692

        primary: "bg-primary text-primary-foreground",
        background: "bg-background text-secondary",
        accent: "bg-accent-foreground text-accent bg-opacity-50",
        muted: "bg-muted text-muted-foreground",

        gray: "text-secondary-dark bg-slate-100 dark:bg-gray-900",
        "gray-d-black":
          "bg-zinc-500 bg-opacity-10 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400",
        black: "bg-black text-gray-400",
        green:
          "bg-green-500/20 dark:bg-green-500/30 text-green-800 dark:text-green-400",
        "green-dark":
          "bg-green-100 dark:bg-green-250 dark:bg-opacity-70 text-green-800 dark:text-white",
        red: "bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-500 ",
        "red-light": "bg-red-400 bg-opacity-10 text-red-500",
        blue: "bg-blue-100  dark:bg-blue-500 text-blue-500 dark:text-blue-100",
        yellow:
          "bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-400",
        purple: "text-purple-600 bg-purple-100",
        transparent: " backdrop-blur-sm border text-primary ",
        none: "bg-transparent dark:bg-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      color: "background",
    },
  },
)

// Component interface
export interface TagProps extends VariantProps<typeof tagVariants> {
  children?: React.ReactNode
  icon?: string
  cross?: boolean
  url?: string
  onClick?: (e: any) => void
  onCrossClick?: () => void
}

// Component implementation
export default function Tag({
  children,
  icon,
  cross,
  url,
  onClick,
  onCrossClick,
  ...props
}: TagProps) {
  function handleCrossClick(e: any) {
    e.stopPropagation()
    if (onCrossClick) onCrossClick()
  }

  if (url)
    return (
      <a
        href={url}
        target="_blank"
        className={tagVariants(props)}
        onClick={(e) => e.stopPropagation()}
      >
        {renderTagContent()}
      </a>
    )
  else
    return (
      <div
        onClick={onClick}
        className={cn(
          tagVariants(props),
          isFunction(onClick) ? " cursor-pointer " : " cursor-default ",
        )}
        // className={isFunction(onClick) ? " cursor-pointer " : " cursor-default "}
      >
        {renderTagContent()}
      </div>
    )

  function renderTagContent() {
    return (
      <>
        {icon && (
          <Svg name={icon} className="h-4 w-4" tooltipContent={undefined} />
        )}
        {children}
        {cross && (
          <button
            type="button"
            className="cursor-pointer button-click-effect "
            onClick={(e) => handleCrossClick(e)}
          >
            <Svg
              name="cross"
              className="h-4 w-4 scale-100 hover:scale-110"
              tooltipContent={undefined}
            />
          </button>
        )}
      </>
    )
  }
}
