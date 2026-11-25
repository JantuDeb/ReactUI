import { GraduationCap } from "lucide-react"
import Spinner from "../loaders/spinner"
import { cn } from "../lib/utils"

export type AppLoadingScreenProps = {
  message?: string
  className?: string
}

/**
 * Full-viewport branded loading screen.
 * Used as the router's pending component so the app never paints an empty
 * black screen while the session/profile request is in flight.
 */
export function AppLoadingScreen({ message = "Loading…", className }: AppLoadingScreenProps) {
  return (
    <div
      className={cn("bg-background flex h-svh w-full flex-col items-center justify-center gap-4 px-6", className)}
      role="status"
      aria-live="polite"
    >
      <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl shadow-sm">
        <GraduationCap className="size-7" />
      </div>
      <p className="text-foreground text-lg font-semibold tracking-tight">StudyPath Admin</p>
      <Spinner size="md" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

export default AppLoadingScreen
