import { Button, ButtonProps } from "../buttons/button"
import { Calendar, CalendarProps } from "../calender/calendar"
import { cn } from "../lib/utils"
import { Popover, PopoverContent, PopoverProps, PopoverTrigger, PopoverContentProps } from "../popover"
import { format } from "date-fns/format"
import { ChevronDownIcon, ClockIcon } from "lucide-react"
import * as React from "react"

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
    <Popover modal={modal}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full max-w-[16rem] justify-start text-left font-normal",
            !displayValue && "text-muted-foreground",
            className,
          )}
          {...{ size, variant, tooltip }}
        >
          {icon}
          {<span className="truncate">{displayValue || placeholder}</span>}
          {showTimeInput && (
            <>
              <ClockIcon className="ml-2" />
              <span className="ml-1">{timeValue}</span>
            </>
          )}
          <span className="ml-auto">
            <ChevronDownIcon />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" {...{ side, align: align || "start", alignOffset, sideOffset }}>
        {/* @ts-expect-error*/}
        <Calendar mode={mode} selected={selected} autoFocus {...calendarProps} />
        {/* {showTimeInput && (
          <div className="mt-4 flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            <input
              type="time"
              value={timeValue}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        )} */}
      </PopoverContent>
    </Popover>
  )
}
