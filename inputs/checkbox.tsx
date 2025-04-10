import { useRef, useEffect, ComponentProps } from "react"
import { isFunction, cn } from "@common/utils"
import Label, { LabelProps } from "@common/forms/label"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import Svg from "../svg"

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  indeterminate?: boolean
  id?: string
  required?: boolean
  label?: LabelProps
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

const Checkbox = ({
  indeterminate,
  label = {},
  required,
  // isRadio = false,
  id,
  onChange,
  disabled = false,
  className,
  ...rest
}: CheckboxProps) => {
  const handleChange = (checked: boolean) => {
    onChange?.(checked)
  }

  return (
    <Label
      cursor="pointer"
      {...label}
      disabled={disabled}
      font="normal"
      id={id}
    >
      <div className="flex items-center justify-center">
        {/* <input
          {...rest}
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-accent shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground",
            isRadio
              ? "rounded-full radio-checkmark checked:bg-primary checked:focus:bg-primary checked:hover:bg-primary "
              : "",
          )}
          type="checkbox"
          id={id}
          required={required}
          onChange={handleChange}
          readOnly={!isFunction(onChange)}
          disabled={disabled}
        /> */}
        <CheckboxPrimitive.Root
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent data-[state=checked]:text-accent",
            className,
          )}
          onCheckedChange={handleChange}
          // onChange={handleChange}
          {...rest}
          // checked={indeterminate ? "indeterminate" : rest.checked}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-accent")}
          >
            <Svg name="check" className="size-3 font-medium" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </div>
    </Label>
  )
}

export default Checkbox
