/**
 * Shared date/time formatters.
 *
 * The admin used to render dates with the browser default locale, producing
 * ambiguous strings like `08/04/2026` where DD/MM and MM/DD are
 * indistinguishable. Everything here uses an explicit day + abbreviated month
 * so `8 Apr 2026` can only be read one way.
 */

export type DateInput = string | number | Date | null | undefined

/** Shown when a timestamp is absent. Override per call site (e.g. "Never"). */
export const NO_DATE_PLACEHOLDER = "Not set"

const LOCALE = "en-IN"

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** `"8 Apr 2026"` — unambiguous, no time. */
export function formatDate(value: DateInput, fallback = NO_DATE_PLACEHOLDER): string {
  const date = toDate(value)
  if (!date) return fallback
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" })
}

/** `"8 Apr 2026, 4:30 pm"` — use where the time of day matters. */
export function formatDateTime(value: DateInput, fallback = NO_DATE_PLACEHOLDER): string {
  const date = toDate(value)
  if (!date) return fallback
  return date.toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/** `"4:30 pm"` — time only. */
export function formatTime(value: DateInput, fallback = NO_DATE_PLACEHOLDER): string {
  const date = toDate(value)
  if (!date) return fallback
  return date.toLocaleTimeString(LOCALE, { hour: "numeric", minute: "2-digit" })
}

/** `"8 Apr"` / `"8 Apr 2025"` — year is dropped when it is the current year. */
export function formatDateShort(value: DateInput, fallback = NO_DATE_PLACEHOLDER): string {
  const date = toDate(value)
  if (!date) return fallback
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  })
}

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

/**
 * `"just now"`, `"5 minutes ago"`, `"in 3 days"`.
 *
 * Falls back to an absolute `formatDate` beyond ~4 weeks, where "37 days ago"
 * stops being more useful than the actual date.
 */
export function formatRelative(value: DateInput, fallback = NO_DATE_PLACEHOLDER): string {
  const date = toDate(value)
  if (!date) return fallback

  const diffSeconds = (date.getTime() - Date.now()) / 1000
  const abs = Math.abs(diffSeconds)

  if (abs < 45) return "just now"
  if (abs >= 4 * WEEK) return formatDate(date, fallback)

  const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" })
  const sign = diffSeconds < 0 ? -1 : 1

  if (abs < HOUR) return rtf.format(sign * Math.round(abs / MINUTE), "minute")
  if (abs < DAY) return rtf.format(sign * Math.round(abs / HOUR), "hour")
  if (abs < WEEK) return rtf.format(sign * Math.round(abs / DAY), "day")
  return rtf.format(sign * Math.round(abs / WEEK), "week")
}

/**
 * Relative headline with the exact timestamp kept as a `title` tooltip.
 * Returns the pieces so callers can spread them onto an element.
 */
export function relativeWithTooltip(value: DateInput, fallback = NO_DATE_PLACEHOLDER) {
  const date = toDate(value)
  return {
    label: date ? formatRelative(date) : fallback,
    title: date ? formatDateTime(date) : undefined,
  }
}

/** `"8 Apr 2026 — 12 Apr 2026"`. */
export function formatDateRange(from: DateInput, to: DateInput, fallback = NO_DATE_PLACEHOLDER): string {
  const start = toDate(from)
  const end = toDate(to)
  if (!start && !end) return fallback
  if (!start) return `until ${formatDate(end)}`
  if (!end) return `from ${formatDate(start)}`
  return `${formatDate(start)} — ${formatDate(end)}`
}

/**
 * @deprecated Use {@link formatRelative}, which handles future dates and
 * falls back to an absolute date for anything older than a month.
 */
export const timeSince = (date: DateInput) => formatRelative(date)
