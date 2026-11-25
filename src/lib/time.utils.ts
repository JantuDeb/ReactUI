import { formatRelative } from "../utils/datetime"
import type { DateInput } from "../utils/datetime"

/**
 * @deprecated Import `formatRelative` from `src/utils/datetime` instead.
 * Kept as a thin re-export so existing call sites keep the same relative
 * wording as the rest of the app.
 */
export const timeSince = (date: DateInput) => formatRelative(date)
