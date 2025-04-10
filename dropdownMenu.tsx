import { ReactNode } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Option } from "@common/types"
import DropdownOptionMenu from "@common/dropDownOption"
import { cn } from "@common/utils"
import Svg from "@common/svg"

type DropdownMenuStyledProps = {
  options: Record<string, Option>
  showCheckbox?: boolean
  onSelect?: (key: string) => void
  disabled?: boolean
  width?: "full" | "fit"
  children?: ReactNode
  align?: "start" | "center" | "end"
}

export default function DropdownMenuStyled({
  options,
  onSelect,
  disabled,
  children,
  width = "full",
  showCheckbox,
  align = "end",
}: DropdownMenuStyledProps) {
  const optionsArray = Object.values(options || {})

  function handleSelect(selected: Option) {
    if (onSelect) onSelect(selected.key)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(width === "full" ? "w-full" : "w-fit", "outline-none")}
        disabled={disabled}
      >
        {children || (
          <div
            className={cn(
              "list-button",
              disabled ? "opacity-50 cursor-not-allowed" : "",
            )}
          >
            <Svg name="arrow-down-short" className="w-5 h-5" />
          </div>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="list-option min-w-36 rounded-md bg-white shadow-lg p-1"
          align={align}
          sideOffset={4}
        >
          {optionsArray?.map((option) => (
            <DropdownMenu.Item
              key={option.key}
              className={cn(
                "outline-none cursor-default select-none",
                "rounded px-2 py-1.5",
                option.disabled ? "opacity-50 pointer-events-none" : "",
              )}
              disabled={option.disabled}
              onSelect={() => handleSelect(option)}
            >
              <DropdownOptionMenu
                display={option.display}
                icon={option.icon}
                showCheckbox={showCheckbox}
                selected={option.selected}
              />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
