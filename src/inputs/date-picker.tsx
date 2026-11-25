import { Button, ButtonProps } from "../buttons/button"
import { Calendar, CalendarProps } from "../calendar/calendar"
import { cn } from "../lib/utils"
import { Popover, PopoverContent, PopoverProps, PopoverTrigger, PopoverContentProps } from "../popover"
import { format } from "date-fns/format"
import { ChevronDownIcon, ClockIcon } from "lucide-react"
import * as React from "react"
import { Input } from "./input"
import { Label } from "../form/label"

export type { DateRange } from "react-day-picker"

export type DatePickerProps = Pick<PopoverContentProps, "side" | "align" | "alignOffset" | "sideOffset"> &
  Pick<ButtonProps, "size" | "variant" | "tooltip" | "className"> &
  Pick<PopoverProps, "modal"> &
  CalendarProps & {
    icon?: React.ReactNode
    placeholder?: string
    formatString?: string
    showTimeInput?: boolean
    timeValue?: string
    onTimeChange?: (value: string) => void
  }

export function DatePicker({
  // input button props
  icon,
  placeholder = "Pick a date",
  formatString,
  size,
  variant = "outline",
  tooltip,
  showTimeInput = false,
  timeValue,
  onTimeChange,
  className,

  // popover props
  side,
  align,
  alignOffset,
  sideOffset,
  modal,

  //input button props

  //calendar props
  mode = "single",
  ...calendarProps
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  // @ts-expect-error
  const { selected } = calendarProps
  const displayValue = React.useMemo(() => {
    if (mode === "single" && selected) {
      return format(selected, formatString || "PPP")
    }
    if (mode === "range" && selected?.from && selected?.to) {
      return `${format(selected.from, formatString || "MMM d")} - ${format(selected.to, formatString || "MMM d")}`
    }
    if (mode === "multiple" && Array.isArray(selected) && selected.length > 0) {
      return selected.map((d: Date) => format(d, formatString || "MMM d")).join(", ")
    }
    return null
  }, [selected, mode, formatString])

  return (
    <Popover modal={modal} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild inert={open}>
        <Button
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayValue && "text-muted-foreground",
            className,
          )}
          {...{ size, variant, tooltip }}
        >
          {icon}
          {<span className="truncate">{displayValue || placeholder}</span>}
          {showTimeInput && (
            <p className="ml-auto flex gap-1 w-fit items-center">
              <ClockIcon />
              <span>{timeValue}</span>
            </p>
          )}
          <span className={!showTimeInput ? "ml-auto" : ""}>
            <ChevronDownIcon />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" {...{ side, align: align || "start", alignOffset, sideOffset }}>
        {/* @ts-expect-error*/}
        <Calendar mode={mode} selected={selected} autoFocus {...calendarProps} />

        {showTimeInput && (
          <Label className="px-2 flex-col items-start pb-2">
            <span className="block">Time</span>
            <Input
              type="time"
              id="time-from"
              step="1"
              defaultValue="09:30:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              onChange={(e) => onTimeChange?.(e.target.value)}
            />
          </Label>
        )}
      </PopoverContent>
    </Popover>
  )
}
