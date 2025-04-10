import { memo, useMemo, useRef } from "react"

import { type VirtualItem } from "@tanstack/react-virtual"

import { TableBodyCell, MemoTableBodyCell } from "./tableBodyCell"
import { TableDetailPanel } from "./tableDetailPanel"
import {
  type TCell,
  type TColumnVirtualizer,
  type TRow,
  type TRowData,
  type TRowVirtualizer,
  type TTableInstance,
} from "../../types"
import { getIsRowSelected } from "../../utils/row.utils"
import { cn } from "@common/utils"

/* type TableBodyRowProps = TableRowProps &
  RowExpandState &
  Pick<ReactTableProps, "onRowClick" | "wrapRowInLink" | "getLinkHref"> & {
    virtualColumns?: VirtualItem<any>[]
    virtualPaddingLeft?: number
    virtualPaddingRight?: number
  }
const TableBodyRow = ({
  table,
  row,
  onRowClick,
  expandedRowId,
  setExpandedRowId,
  wrapRowInLink,
  getLinkHref,
  virtualRow,
  rowVirtualizer,
  // columnVirtualizer,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
}: TableBodyRowProps) => {
  const {
    options: { renderRowExpandDetails, initialState },
  } = table
  const visibleCells = row.getVisibleCells()
  const overflow = initialState?.overflow || "truncate"
  const handleRowClick = useCallback(() => {
    onRowClick?.(row.original, expandedRowId === row.id)
    if (renderRowExpandDetails) setExpandedRowId(row.id)
    if (row.getCanExpand() && !row.getIsExpanded()) row.toggleExpanded(true)
  }, [onRowClick, row, expandedRowId, renderRowExpandDetails, setExpandedRowId])

  const rowLink = useMemo(
    () => (wrapRowInLink ? getLinkHref?.(row.original) : undefined),
    [wrapRowInLink, getLinkHref, row],
  )

  const isRowClickable = useMemo(
    () => !!rowLink || isFunction(onRowClick),
    [rowLink, onRowClick],
  )

  return (
    <>
      <tr
        key={row.id}
        data-index={virtualRow?.index}
        ref={virtualRow ? rowVirtualizer?.measureElement : undefined}
        className={joinClassNames(
          "table-row group",
          isRowClickable ? "cursor-pointer" : "",
        )}
        onClick={handleRowClick}
        style={
          virtualRow && {
            display: "flex",
            position: "absolute",
            top: 0,
            width: "100%",
            height:
              overflow === "truncate" ? `${virtualRow.size}px` : undefined,
            transform: `translateY(${virtualRow.start}px)`,
          }
        }
      >
        {virtualPaddingLeft ? (
          <td style={{ display: "flex", width: virtualPaddingLeft }} />
        ) : null}
        {(virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as Cell<any, any>
            if (virtualColumns) {
              staticColumnIndex = (cellOrVirtualCell as VirtualItem<any>).index
              cell = visibleCells[staticColumnIndex]
            }
            return (
              <BodyCell
                key={cell.id}
                cell={cell}
                table={table}
                row={row}
                colIndex={staticColumnIndex}
                rowLink={rowLink}
                expandedRowId={expandedRowId}
              />
            )
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: "flex", width: virtualPaddingRight }} />
        ) : null}
      </tr>
      {renderRowExpandDetails && expandedRowId === row.id && (
        <TableDetailPanel
          table={table}
          row={row}
          expandedRowId={expandedRowId}
        />
      )}
    </>
  )
}

export default TableBodyRow */

export interface TableBodyRowProps<TData extends TRowData> {
  /*  extends TableRowProps */
  columnVirtualizer?: TColumnVirtualizer
  numRows?: number
  pinnedRowIds?: string[]
  row: TRow<TData>
  rowVirtualizer?: TRowVirtualizer
  staticRowIndex: number
  table: TTableInstance<TData>
  virtualRow?: VirtualItem
}

export const TableBodyRow = <TData extends TRowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
}: // ...tableRowProps
TableBodyRowProps<TData>) => {
  // const theme = useTheme()

  const {
    getState,
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      memoMode,
      theme: {
        // baseBackgroundColor,
        pinnedRowBackgroundColor,
        selectedRowBackgroundColor,
      },
      // muiTableBodyRowProps,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
    setHoveredRow,
  } = table
  const {
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredRow,
    isFullScreen,
    rowPinning,
  } = getState()

  const visibleCells = row.getVisibleCells()

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {}

  const isRowSelected = getIsRowSelected({ row, table })
  const isRowPinned = enableRowPinning && row.getIsPinned()
  const isDraggingRow = draggingRow?.id === row.id
  const isHoveredRow = hoveredRow?.id === row.id

  // const tableRowProps = {
  //   ...parseFromValuesOrFunc(muiTableBodyRowProps, {
  //     row,
  //     staticRowIndex,
  //     table,
  //   }),
  //   ...rest,
  // }

  const [bottomPinnedIndex, topPinnedIndex] = useMemo(() => {
    if (
      !enableRowPinning ||
      !rowPinningDisplayMode?.includes("sticky") ||
      !pinnedRowIds ||
      !row.getIsPinned()
    )
      return []
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ]
  }, [pinnedRowIds, rowPinning])

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0

  // const sx = parseFromValuesOrFunc(tableRowProps?.sx, theme as any)

  const defaultRowHeight =
    density === "compact" ? 37 : density === "comfortable" ? 53 : 69

  // const customRowHeight =
  //   // @ts-expect-error
  //   parseInt(tableRowProps?.style?.height ?? sx?.height, 10) || undefined

  const rowHeight = /* customRowHeight || */ defaultRowHeight

  const handleDragEnter = (_e: any) => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row)
    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const rowRef = useRef<HTMLTableRowElement | null>(null)

  const cellHighlightColor = isRowSelected
    ? selectedRowBackgroundColor
    : isRowPinned
    ? pinnedRowBackgroundColor
    : undefined

  // const cellHighlightColorHover =
  //   tableRowProps?.hover !== false
  //     ? isRowSelected
  //       ? cellHighlightColor
  //       : theme.palette.mode === "dark"
  //       ? `${lighten(baseBackgroundColor, 0.3)}`
  //       : `${darken(baseBackgroundColor, 0.3)}`
  //     : undefined

  return (
    <>
      <tr
        data-index={renderDetailPanel ? staticRowIndex * 2 : staticRowIndex}
        data-pinned={!!isRowPinned || undefined}
        data-selected={isRowSelected || undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        ref={(node: HTMLTableRowElement) => {
          if (node) {
            rowRef.current = node
            rowVirtualizer?.measureElement(node)
          }
        }}
        className={cn(
          "table-row group w-full box-border",
          isRowPinned
            ? "opacity-95"
            : isDraggingRow || isHoveredRow
            ? "opacity-50"
            : "opacity-100",
          rowPinningDisplayMode?.includes("sticky") && isRowPinned
            ? "z-[10]"
            : "z-0",
          virtualRow ? "transition-none" : "transition-all ease-in-out",
        )}
        style={{
          transform: virtualRow
            ? `translateY(${virtualRow.start}px)`
            : undefined,
          display: layoutMode?.startsWith("grid") ? "flex" : undefined,

          bottom:
            !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
              ? `${
                  bottomPinnedIndex * rowHeight +
                  (enableStickyFooter ? tableFooterHeight - 1 : 0)
                }px`
              : undefined,
          position: virtualRow
            ? "absolute"
            : rowPinningDisplayMode?.includes("sticky") && isRowPinned
            ? "sticky"
            : "relative",
          top: virtualRow
            ? 0
            : topPinnedIndex !== undefined && isRowPinned
            ? `${
                topPinnedIndex * rowHeight +
                (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
              }px`
            : undefined,
        }}

        //   "&:hover td:after": cellHighlightColorHover
        //     ? {
        //         backgroundColor: alpha(cellHighlightColorHover, 0.3),
        //         ...commonCellBeforeAfterStyles,
        //       }

        //   td: {
        //     ...getCommonPinnedCellStyles({ table }),
        //   },
        //   "td:after": cellHighlightColor
        //     ? {
        //         backgroundColor: cellHighlightColor,
        //         ...commonCellBeforeAfterStyles,
        //       }
        //     : undefined,
      >
        {virtualPaddingLeft ? (
          <td style={{ display: "flex", width: virtualPaddingLeft }} />
        ) : null}
        {(virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as TCell<TData>
            if (columnVirtualizer) {
              staticColumnIndex = (cellOrVirtualCell as VirtualItem).index
              cell = visibleCells[staticColumnIndex]
            }
            const props = {
              cell,
              numRows,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            }
            const key = `${cell.id}-${staticRowIndex}`
            return cell ? (
              memoMode === "cells" &&
              cell.column.columnDef.columnDefType === "data" &&
              !draggingColumn &&
              !draggingRow &&
              editingCell?.id !== cell.id &&
              editingRow?.id !== row.id ? (
                <MemoTableBodyCell key={key} {...props} />
              ) : (
                <TableBodyCell key={key} {...props} />
              )
            ) : null
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: "flex", width: virtualPaddingRight }} />
        ) : null}
      </tr>
      {renderDetailPanel && !row.getIsGrouped() && (
        <TableDetailPanel
          parentRowRef={rowRef}
          row={row}
          rowVirtualizer={rowVirtualizer}
          staticRowIndex={staticRowIndex}
          table={table}
          virtualRow={virtualRow}
        />
      )}
    </>
  )
}

export const MemoTableBodyRow = memo(
  TableBodyRow,
  (prev, next) =>
    prev.row === next.row && prev.staticRowIndex === next.staticRowIndex,
) as typeof TableBodyRow
