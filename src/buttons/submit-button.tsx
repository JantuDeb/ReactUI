import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "./button"
import { cn } from "../lib/utils"

export type ButtonSubmitProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  // Async submit handler (required)
  submitFunction: (event?: React.MouseEvent<HTMLButtonElement>) => Promise<unknown>
  // Callbacks
  onSuccess?: (result: unknown) => void
  onError?: (error: unknown) => void

  // Loading state (uncontrolled by default, can be controlled)
  loading?: boolean
  disableWhileLoading?: boolean
  showSpinner?: boolean
  spinner?: React.ReactNode
  spinnerPosition?: "start" | "end"
  loadingLabel?: React.ReactNode

  // Click behavior
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export const ButtonSubmit: React.FC<ButtonSubmitProps> = ({
  submitFunction,
  onSuccess,
  onError,

  // Loading behavior
  loading,

  // Click behavior
  onClick,
  preventDefault = true,
  stopPropagation = false,

  // Button props
  className,
  children,
  disabled,
  ...buttonProps
}) => {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = typeof loading === "boolean" ? loading : internalLoading
  const [error, setError] = useState<any>()
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) e.preventDefault()
    if (stopPropagation) e.stopPropagation()
    onClick?.(e)
    setError(undefined)
    if (isLoading) return
    try {
      setInternalLoading(true)
      const result = await submitFunction(e)
      onSuccess?.(result)
    } catch (err) {
      onError?.(err)
      setError(err)
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <div className="py-2 space-y-2">
      <p className="text-destructive text-sm">{error?.message}</p>
      <Button
        {...buttonProps}
        onClick={handleClick}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        className={cn(className, "w-full")}
      >
        {children}
      </Button>
    </div>
  )
}

export default ButtonSubmit
