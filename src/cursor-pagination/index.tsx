import { useCallback, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react"
import { Button } from "../buttons/button"
import { cn } from "../lib/utils"

interface CursorPaginationProps {
  cursor?: string
  nextCursor?: string | null
  onCursorChange: (cursor: string | undefined) => void
  /** Cursors already visited, oldest first — enables the Previous button. See `useCursorPagination`. */
  history?: string[]
  /** Number of rows on the current page, used for the "Showing N" count. */
  rowCount?: number
  /** Total rows across all pages, when the API reports one. */
  totalCount?: number
  /** Suppresses the count line and disables everything while the page is in flight. */
  isLoading?: boolean
  /** Noun used in the count line, e.g. "sessions". Defaults to "rows". */
  label?: string
  className?: string
}

/**
 * Cursor (keyset) pagination footer: row count on the left, First / Previous / page indicator /
 * Next on the right. Every button is disabled when it cannot do anything — including on an empty
 * result set, where only "First" stays available (and only if you are not already on page 1).
 */
export function CursorPagination({
  cursor,
  nextCursor,
  onCursorChange,
  history = [],
  rowCount,
  totalCount,
  isLoading,
  label = "rows",
  className,
}: CursorPaginationProps) {
  const pageNumber = history.length + 1
  const isFirstPage = !cursor && history.length === 0
  const hasRows = (rowCount ?? 0) > 0
  const canGoNext = !!nextCursor && !isLoading && hasRows

  const countText = useMemo(() => {
    if (isLoading) return "Loading…"
    if (!hasRows) return `No ${label}`
    if (typeof totalCount === "number") {
      return `Showing ${rowCount} of ${totalCount} ${label}`
    }
    return `Showing ${rowCount} ${label}`
  }, [hasRows, isLoading, label, rowCount, totalCount])

  const goPrevious = useCallback(() => {
    // Drop the current page's cursor and return to the one before it.
    const previous = history[history.length - 2]
    onCursorChange(previous)
  }, [history, onCursorChange])

  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      <span className="text-xs text-muted-foreground">{countText}</span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isFirstPage || isLoading}
          onClick={() => onCursorChange(undefined)}
          tooltip="First page"
        >
          <ChevronsLeft className="size-4" />
          First
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isFirstPage || history.length === 0 || isLoading}
          onClick={goPrevious}
          tooltip="Previous page"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums px-1">Page {pageNumber}</span>
        <Button
          size="sm"
          variant="outline"
          disabled={!canGoNext}
          onClick={() => onCursorChange(nextCursor!)}
          tooltip="Next page"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * State helper for cursor pagination — tracks the visited-cursor stack so `CursorPagination`
 * can offer a working Previous button.
 *
 * ```ts
 * const { cursor, history, setCursor, reset } = useCursorPagination()
 * ```
 * Call `reset()` whenever a filter changes so paging restarts at page 1.
 */
export function useCursorPagination() {
  const [cursor, setCursorState] = useState<string | undefined>()
  const [history, setHistory] = useState<string[]>([])

  const setCursor = useCallback((next: string | undefined) => {
    setCursorState(next)
    setHistory((prev) => {
      if (next === undefined) return []
      const existing = prev.indexOf(next)
      // Going back to an already-visited cursor truncates the stack instead of growing it.
      if (existing !== -1) return prev.slice(0, existing + 1)
      return [...prev, next]
    })
  }, [])

  const reset = useCallback(() => {
    setCursorState(undefined)
    setHistory([])
  }, [])

  return { cursor, history, setCursor, reset }
}
