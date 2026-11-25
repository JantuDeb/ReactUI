import { useState } from "react"
import { Calendar } from "./calendar"
import { DateRange } from "react-day-picker"

const CalendarSingleSelectDemo = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Single Day Select Calendar</h3>
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
    </div>
  )
}

const CalendarRangeSelectDemo = () => {
  const [range, setRange] = useState<DateRange>({
    from: new Date(2025, 5, 10),
    to: new Date(2025, 5, 15),
  })

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Range Select Calendar</h3>
      <Calendar mode="range" required selected={range} onSelect={setRange} className="rounded-lg border" />
    </div>
  )
}

const CalendarMultiSelectDemo = () => {
  const [dates, setDates] = useState<Date[]>([new Date(2025, 5, 12), new Date(2025, 5, 17)])

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Multi Day Select Calendar</h3>
      <Calendar mode="multiple" required selected={dates} onSelect={setDates} max={5} className="rounded-lg border" />
    </div>
  )
}

export const CalendarExample = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 p-4">
      <CalendarSingleSelectDemo />
      <CalendarRangeSelectDemo />
      <CalendarMultiSelectDemo />
    </div>
  )
}
