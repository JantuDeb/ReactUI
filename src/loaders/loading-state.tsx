import { cn } from "../lib/utils"
import Spinner from "./spinner"

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center h-64 text-muted-foreground", className)}>
      <Spinner size="sm" />
      <span className="ml-2 text-sm">{message}</span>
    </div>
  )
}
