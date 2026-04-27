import * as React from "react"
import { DatePicker, DateRange } from "../date-picker"
import { CalendarDays, CalendarRange, CalendarIcon } from "lucide-react"

export function DatePickerDocs() {
  // Single date picker
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(new Date(2025, 7, 29))

  // Range date picker
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 7, 20),
    to: new Date(2025, 7, 24),
  })

  // Date picker with icon
  const [iconDate, setIconDate] = React.useState<Date | undefined>(new Date(2025, 7, 13))

  // Date picker with time input
  const [dateWithTime, setDateWithTime] = React.useState<Date | undefined>(new Date(2025, 7, 18))
  const [timeValue, setTimeValue] = React.useState("12:00")

  // Multiple select
  const [multiDates, setMultiDates] = React.useState<Date[]>([new Date(2025, 7, 12), new Date(2025, 7, 17)])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Date picker</h3>
        <DatePicker mode="single" selected={singleDate} onSelect={setSingleDate} placeholder="Pick a date" required />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Range date picker</h3>
        <DatePicker mode="range" selected={range} onSelect={(value) => setRange(value)} placeholder="Pick a date" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Date picker with icon</h3>
        <DatePicker
          mode="single"
          selected={iconDate}
          onSelect={setIconDate}
          icon={<CalendarIcon className="mr-2 size-4" />}
          formatString="d/M/yyyy"
        />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Date picker with time input</h3>
        <DatePicker
          mode="single"
          selected={dateWithTime}
          onSelect={setDateWithTime}
          showTimeInput
          timeValue={timeValue}
          onTimeChange={setTimeValue}
        />
        <p className="text-muted-foreground mt-2 text-xs">
          Selected: {dateWithTime ? dateWithTime.toLocaleDateString() : "None"} {timeValue}
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Date picker with short date</h3>
        <DatePicker mode="range" selected={range} onSelect={setRange} formatString="MMM d" required />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Multi date picker</h3>
        <DatePicker
          mode="multiple"
          selected={multiDates}
          onSelect={setMultiDates}
          max={5}
          formatString="MMM d"
          required
        />
      </div>
    </div>
  )
}
