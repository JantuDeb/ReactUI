import { isString, cn } from "@common/utils"
import Svg from "@common/svg"
import Checkbox from "@common/inputs/checkbox"
import { ReactNode } from "react"

export default function SelectOption({
  icon,
  display,
  selected,
  disabled,
  showCheckbox,
}: {
  icon?: ReactNode
  display: ReactNode
  selected?: boolean
  disabled?: boolean
  /**@description if this is true then we won't show right ✅ and vise versa  */
  showCheckbox?: boolean
}) {
  return (
    <>
      <div className="flex justify-start items-center gap-2 w-full">
        {showCheckbox && <Checkbox checked={selected} disabled={disabled} />}
        {icon &&
          (isString(icon) ? (
            <Svg
              className="w-4 h-4 text-secondary"
              name={icon}
              strokeWidth={2}
            />
          ) : (
            icon
          ))}

        {display && (
          <span
            className={cn(
              "block truncate my-auto text-primary w-full",
              selected && "font-semibold",
            )}
          >
            {display}
          </span>
        )}
      </div>
      {selected && !showCheckbox && (
        <div className="my-auto flex justify-end">
          <Svg name="check" className="w-4 h-4" strokeWidth={2} />
        </div>
      )}
    </>
  )
}
