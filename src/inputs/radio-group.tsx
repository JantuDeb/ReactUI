import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { Label } from "../form/label"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.RadioGroupProps) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export function RadioGroupStyled({
  options,
  layout = "vertical",
  className,
  itemVariant = "radio",
  itemVisibility = "visible", // applied to card and button variants
  ...radioGroupProps
}: RadioGroupStyledProps) {
  return (
    <RadioGroup {...radioGroupProps} className={cn(layoutVariants[layout], className)}>
      {options.map((option) => {
        const { container, label: labelClass, item: itemClass } = styleVariants[itemVariant]
        switch (itemVariant) {
          case "button": {
            const { id, label, disabled } = option
            return (
              <Label key={option.id} className={container} htmlFor={id} aria-disabled={disabled}>
                <RadioGroupItem
                  id={id}
                  value={id}
                  className={
                    itemVisibility === "hidden"
                      ? "sr-only after:absolute after:inset-0"
                      : "transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]"
                  }
                  disabled={disabled}
                />
                <p className={labelClass}>{label}</p>
              </Label>
            )
          }

          case "card": {
            const { id, label, description, disabled, badge } = option
            return (
              <div className={container} key={id}>
                <RadioGroupItem
                  value={id}
                  id={id}
                  disabled={disabled}
                  className={itemVisibility === "hidden" ? "sr-only after:absolute after:inset-0" : itemClass}
                  aria-label={`label-${id}`}
                />
                <div className="grid grow gap-2 items-center">
                  <Label htmlFor={id} className="justify-between">
                    {label} <span className="text-muted-foreground text-xs leading-[inherit] font-normal">{badge}</span>
                  </Label>
                  <p id={`${id}-1-description`} className="text-muted-foreground text-xs">
                    {description}
                  </p>
                </div>
              </div>
            )
          }
          default:
          case "radio":
            return (
              <div className="flex gap-2" key={option.id}>
                <RadioGroupItem value={option.id} id={option.id} disabled={option.disabled} />
                <div className="grid flex-1 space-y-2">
                  <Label htmlFor={option.id} aria-disabled={option.disabled}>
                    {option.label}
                  </Label>
                  <p className="text-muted-foreground text-xs">{option.description}</p>
                </div>
              </div>
            )
        }
      })}
    </RadioGroup>
  )
}

// Option type
type Option = {
  id: string
  label: string
  description?: string
  disabled?: boolean

  badge?: React.ReactNode
} // & Omit<VariantProps<typeof radioGroupItemVariants>, never>

// Layout variants
const layoutVariants = {
  vertical: "grid gap-2",
  horizontal: "flex flex-col items-center gap-4 flex-wrap sm:flex-row",
  grid2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  grid3: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  grid4: "grid grid-cols-1 sm:grid-cols-4 gap-4",
} as const

type ItemVariant = "radio" | "card" | "button"

// Style variants for different visual presentations
const styleVariants = {
  radio: {
    container: "flex items-center gap-2",
    item: "",
    label: "",
    description: "text-muted-foreground text-xs mt-1",
  },
  card: {
    container:
      "border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-center gap-2 rounded-md border p-2 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] w-full min-w-[20rem]",
    item: "size-5 after:absolute after:inset-0 [&_svg]:size-3",
    label: "font-medium",
    description: "text-muted-foreground text-sm mt-1",
  },
  button: {
    container:
      "border-input has-data-[state=checked]:border-primary/80 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
    item: "sr-only after:absolute after:inset-0 transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]",
    label: "text-foreground text-sm leading-none font-medium",
  },
  // compact: {
  //   container: "flex items-center gap-1.5",
  //   item: "size-3",
  //   label: "text-sm",
  //   description: "text-muted-foreground text-xs ml-4 mt-0.5",
  // },
} as const

export type RadioGroupStyledProps = {
  options: Option[]
  layout?: keyof typeof layoutVariants
  itemVariant?: ItemVariant
  itemVisibility?: "visible" | "hidden" // default is visible
} & RadioGroupPrimitive.RadioGroupProps
