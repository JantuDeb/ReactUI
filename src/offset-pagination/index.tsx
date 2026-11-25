import { useMemo } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "../buttons/button"
import { cn } from "../lib/utils"

export interface OffsetPaginationProps {
  /** Current 1-based page number. */
  page: number
  onPageChange: (page: number) => void
  /** Rows per page, used to derive the "Showing X–Y" range. */
  pageSize: number
  /** Total rows across all pages, as reported by the API. */
  totalCount?: number
  /** Total page count, when the API reports one directly. Derived from totalCount otherwise. */
  totalPages?: number
  /** Suppresses the count line and disables every button while a page is in flight. */
  isLoading?: boolean
  /** Noun used in the count line, e.g. "users". Defaults to "rows". */
  label?: string
  className?: string
}

/**
 * Offset (page-number) pagination footer, the counterpart to `CursorPagination`:
 * row count on the left, First / Previous / "Page X of Y" / Next / Last on the right.
 *
 * Unlike the hand-rolled bars this replaces, it always renders — a single-page or empty
 * result still reports its count, which is the only place the app surfaces a total. Every
 * button is disabled when it cannot do anything, including on an empty result set.
 */
export function OffsetPagination({
  page,
  onPageChange,
  pageSize,
  totalCount,
  totalPages,
  isLoading,
  label = "rows",
  className,
}: OffsetPaginationProps) {
  const pageCount = useMemo(() => {
    if (typeof totalPages === "number" && totalPages > 0) return totalPages
    if (typeof totalCount === "number" && totalCount > 0) return Math.ceil(totalCount / pageSize)
    return 0
  }, [pageSize, totalCount, totalPages])

  const hasRows = pageCount > 0
  const canPrevious = hasRows && page > 1 && !isLoading
  const canNext = hasRows && page < pageCount && !isLoading

  const countText = useMemo(() => {
    if (isLoading) return "Loading…"
    if (!hasRows) return `No ${label}`
    if (typeof totalCount !== "number") return `Page ${page} of ${pageCount}`
    const firstRow = (page - 1) * pageSize + 1
    const lastRow = Math.min(totalCount, page * pageSize)
    return `Showing ${firstRow}–${lastRow} of ${totalCount} ${label}`
  }, [hasRows, isLoading, label, page, pageCount, pageSize, totalCount])

  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      <span className="text-xs text-muted-foreground">{countText}</span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!canPrevious}
          onClick={() => onPageChange(1)}
          tooltip="First page"
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!canPrevious}
          onClick={() => onPageChange(page - 1)}
          tooltip="Previous page"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums px-1">
          {hasRows ? `Page ${page} of ${pageCount}` : "Page 0 of 0"}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          tooltip="Next page"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(pageCount)}
          tooltip="Last page"
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default OffsetPagination
