import { formatDistanceToNow, format, DateArg } from "date-fns"

export const timeSince = (date: Date) => {
  if (!date) return
  const timeStamp = new Date(date)
  const secondsPast = (Date.now() - timeStamp.getTime()) / 1000

  if (secondsPast < 60) {
    const seconds = Math.floor(secondsPast)
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
  }
  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  }
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600)
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  }

  const now = new Date()
  const isSameYear = timeStamp.getFullYear() === now.getFullYear()
  return format(timeStamp, isSameYear ? "d MMM" : "d MMM yyyy")
}
