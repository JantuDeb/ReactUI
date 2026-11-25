import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "../../buttons/button"
import SelectStyled from "../../inputs/select"
import { type TRowData, type TTableInstance } from "../types"

export interface TablePaginationProps<TData extends TRowData> {
  table: TTableInstance<TData>
}

/**
 * Bottom pagination bar: row count on the left, page-size select plus
 * First / Previous / "Page X of Y" / Next / Last on the right.
 *
 * Every navigation button is disabled when it cannot do anything — notably on an empty
 * result set, where the row count reads "No rows" and all four buttons are inert.
 * Only rendered when `enablePagination` is on, so existing tables are unaffected.
 */
export const TablePagination = <TData extends TRowData>({ table }: TablePaginationProps<TData>) => {
  const {
    getState,
    getPrePaginationRowModel,
    getPageCount,
    setPageIndex,
    setPageSize,
    options: { rowCount, paginationLabel = "rows", pageSizeOptions = [10, 25, 50, 100] },
  } = table

  const { pagination, isLoading, showSkeletons } = getState()
  const { pageIndex = 0, pageSize = 10 } = pagination ?? {}

  const totalCount = rowCount ?? getPrePaginationRowModel().rows.length
  const pageCount = Math.max(1, rowCount ? Math.ceil(rowCount / pageSize) : getPageCount())
  const loading = !!isLoading || !!showSkeletons

  const hasRows = totalCount > 0
  const canPrevious = hasRows && pageIndex > 0 && !loading
  const canNext = hasRows && pageIndex < pageCount - 1 && !loading

  const firstRow = hasRows ? pageIndex * pageSize + 1 : 0
  const lastRow = hasRows ? Math.min(totalCount, (pageIndex + 1) * pageSize) : 0

  const countText = loading
    ? "Loading…"
    : hasRows
      ? `Showing ${firstRow}–${lastRow} of ${totalCount} ${paginationLabel}`
      : `No ${paginationLabel}`

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pt-3">
      <span className="text-xs text-muted-foreground">{countText}</span>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground hidden sm:inline">Rows per page</span>
        <SelectStyled
          options={pageSizeOptions.map((n) => ({ id: String(n), label: String(n) }))}
          value={String(pageSize)}
          onValueChange={(val: string) => setPageSize(Number(val))}
          size="sm"
          width="fit"
        />

        <Button
          size="sm"
          variant="outline"
          disabled={!canPrevious}
          onClick={() => setPageIndex(0)}
          tooltip="First page"
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!canPrevious}
          onClick={() => setPageIndex(pageIndex - 1)}
          tooltip="Previous page"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <span className="text-xs text-muted-foreground tabular-nums px-1">
          {hasRows ? `Page ${pageIndex + 1} of ${pageCount}` : "Page 0 of 0"}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => setPageIndex(pageIndex + 1)}
          tooltip="Next page"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => setPageIndex(pageCount - 1)}
          tooltip="Last page"
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
