import React from "react"
import { Card } from "../cards"
import { Button } from "../buttons/button"
import { cn } from "../lib/utils"

interface EmptyStateProps {
  /**
   * The main heading text
   */
  header: string
  /**
   * The description or subtitle text
   */
  description: string
  /**
   * Primary action button text
   */
  primaryActionText?: string
  /**
   * Primary action button click handler
   */
  onPrimaryAction?: () => void
  /**
   * Secondary action button text (optional)
   */
  secondaryActionText?: string
  /**
   * Secondary action button click handler (optional)
   */
  onSecondaryAction?: () => void
  /**
   * Custom icon to display (optional)
   */
  icon?: React.ReactNode
  /**
   * Additional className for the container
   */
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  header,
  description,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  icon,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center w-full h-full min-h-[400px]", className)}>
      <Card className="max-w-md w-full">
        <div className="flex flex-col items-center justify-center text-center p-6">
          {/* Icon */}
          <div className="mb-4">
            {icon ? (
              icon
            ) : (
              <svg
                className="mx-auto h-16 w-16 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            )}
          </div>

          {/* Header */}
          <h3 className="text-lg font-semibold text-foreground mb-2">{header}</h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>

          {/* Action Buttons */}
          {(primaryActionText || secondaryActionText) && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {primaryActionText && onPrimaryAction && (
                <Button onClick={onPrimaryAction} size="default" className="w-full sm:w-auto">
                  {primaryActionText}
                </Button>
              )}
              {secondaryActionText && onSecondaryAction && (
                <Button onClick={onSecondaryAction} variant="outline" size="default" className="w-full sm:w-auto">
                  {secondaryActionText}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default EmptyState
