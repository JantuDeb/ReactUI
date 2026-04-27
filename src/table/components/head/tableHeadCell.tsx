import { TColumn } from "../../types"

function Sort({ column }: { column: TColumn<any, any> }) {
  const isSorted = column.getIsSorted() as string

  return (
    <span className={cn("ml-1 shrink-0 group-hover:opacity-100", !isSorted ? "opacity-40" : "opacity-100")}>
      {isSorted === "asc" ? (
        <ChevronUpIcon className="h-3.5 w-3.5" />
      ) : isSorted === "desc" ? (
        <ChevronDownIcon className="h-3.5 w-3.5" />
      ) : (
        <ChevronsUpDownIcon className="h-3.5 w-3.5" />
      )}
    </span>
  )
}

import { type DragEvent, useMemo } from "react"

import { type TColumnVirtualizer, type THeader, type TRowData, type TTableInstance } from "../../types"
import { TableHeadCellFilterContainer } from "./tableHeadCellFilterContainer"
import { getCommonCellStyles } from "../../utils/style.utils"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { cellKeyboardShortcuts } from "../../utils/cell.utils"
import { cn } from "../../../lib/utils"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react"

export interface TableHeadCellProps<TData extends TRowData> {
  columnVirtualizer?: TColumnVirtualizer
  header: THeader<TData>
  staticColumnIndex?: number
  table: TTableInstance<TData>
}

export const TableHeadCell = <TData extends TRowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
}: // ...rest
TableHeadCellProps<TData>) => {
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableMultiSort,
      layoutMode,
      theme: { draggingBorderColor, tHead, tHeadSticky },
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table
  const { columnSizingInfo, density, draggingColumn, grouping, hoveredColumn, showColumnFilters } = getState()
  const { column } = header
  const { columnDef } = column
  const { columnDefType } = columnDef

  // const tableCellProps = {
  //   ...parseFromValuesOrFunc(muiTableHeadCellProps, { column, table }),
  //   ...parseFromValuesOrFunc(columnDef.muiTableHeadCellProps, {
  //     column,
  //     table,
  //   }),
  //   ...rest,
  // }

  const isColumnPinned = enableColumnPinning && columnDef.columnDefType !== "group" && column.getIsPinned()

  // const showColumnActions =
  //   (enableColumnActions || columnDef.enableColumnActions) &&
  //   columnDef.enableColumnActions !== false

  // const showDragHandle =
  //   enableColumnDragging !== false &&
  //   columnDef.enableColumnDragging !== false &&
  //   (enableColumnDragging ||
  //     (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
  //     (enableGrouping &&
  //       columnDef.enableGrouping !== false &&
  //       !grouping.includes(column.id)))

  // const headerPL = useMemo(() => {
  //   let pl = 0
  //   if (column.getCanSort()) pl += 1
  //   if (showColumnActions) pl += 1.75
  //   if (showDragHandle) pl += 1.5
  //   return pl
  // }, [showColumnActions, showDragHandle])

  const draggingBorders = useMemo(() => {
    const showResizeBorder =
      columnSizingInfo.isResizingColumn === column.id && columnResizeMode === "onChange" && !header.subHeaders.length

    const borderStyle = showResizeBorder
      ? `2px solid ${draggingBorderColor} !important`
      : draggingColumn?.id === column.id
        ? `1px dashed var(--accent)`
        : hoveredColumn?.id === column.id
          ? `2px dashed ${draggingBorderColor}`
          : undefined

    if (showResizeBorder) {
      return columnResizeDirection === "ltr" ? { borderRight: borderStyle } : { borderLeft: borderStyle }
    }
    const draggingBorders = borderStyle
      ? {
          borderLeft: borderStyle,
          borderRight: borderStyle,
          borderTop: borderStyle,
        }
      : undefined

    return draggingBorders
  }, [draggingColumn, hoveredColumn, columnSizingInfo.isResizingColumn])

  const handleDragEnter = (_e: DragEvent) => {
    if (enableGrouping && hoveredColumn?.id === "drop-zone") {
      setHoveredColumn(null)
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== "group") {
      setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    // tableCellProps?.onKeyDown?.(event)
    cellKeyboardShortcuts({
      event,
      cellValue: header.column.columnDef.header,
      table,
      header,
    })
  }

  const HeaderElement =
    parseFromValuesOrFunc(columnDef.Header, {
      column,
      header,
      table,
    }) ?? columnDef.header

  const padding =
    density === "compact"
      ? "0.5rem"
      : density === "comfortable"
        ? columnDefType === "display"
          ? "0.75rem"
          : "1rem"
        : columnDefType === "display"
          ? "1rem 1.25rem"
          : "1.5rem"
  const isDisplayColumn = columnDefType === "display"

  return (
    <th
      // align={
      //   columnDefType === "group"
      //     ? "center"
      //     : theme.direction === "rtl"
      //     ? "right"
      //     : "left"
      // }
      aria-sort={column.getIsSorted() ? (column.getIsSorted() === "asc" ? "ascending" : "descending") : "none"}
      colSpan={header.colSpan}
      data-can-sort={column.getCanSort() || undefined}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      data-sort={column.getIsSorted() || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      ref={(node: HTMLTableCellElement) => {
        if (node) {
          tableHeadCellRefs.current![column.id] = node
          if (columnDefType !== "group") {
            columnVirtualizer?.measureElement?.(node)
          }
        }
      }}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      // {...tableCellProps}
      onKeyDown={handleKeyDown}
      className={cn(
        tHead,
        tHeadSticky,
        // isLastPinnedCol ? "" : "border-r",
        column.getCanSort() ? "cursor-pointer hover:bg-muted transition-colors" : "",
        // isDisplayColumn ? "justify-center items-center" : "py-2",
        "relative group",
        layoutMode?.startsWith("grid") ? "flex-col" : undefined,
        column.id === "row-actions" || isDisplayColumn ? "text-center" : "",
      )}
      style={{
        // "& :hover": {
        //   ".MuiButtonBase-root": {
        //     opacity: 1,
        //   },
        // },
        flexDirection: layoutMode?.startsWith("grid") ? "column" : undefined,
        fontWeight: "bold",
        overflow: "visible",
        padding,
        // paddingBottom:
        //   columnDefType === "display"
        //     ? 0
        //     : showColumnFilters || density === "compact"
        //     ? "0.4rem"
        //     : "0.6rem",
        // paddingTop:
        //   columnDefType === "group" || density === "compact"
        //     ? "0.25rem"
        //     : density === "comfortable"
        //     ? "0.75rem"
        //     : "1.25rem",
        userSelect: enableMultiSort && column.getCanSort() ? "none" : undefined,
        position: "relative",
        ...getCommonCellStyles({
          column,
          header,
          table,
          // tableCellProps,
          // theme,
        }),
        ...draggingBorders,
      }}
    >
      {header.isPlaceholder ? null : (
        <div
          className={cn(
            "flex items-center relative w-full min-h-4",
            columnDefType === "group"
              ? "justify-center"
              : columnDefType === "display"
                ? "justify-center"
                : column.getCanResize()
                  ? "justify-between"
                  : "justify-start",
          )}

          // flexDirection:
          //   tableCellProps?.align === "right" ? "row-reverse" : "row",
        >
          <div
            onClick={column.getToggleSortingHandler()}
            className={cn(
              "flex items-center",
              column.getCanSort() && columnDefType !== "group" ? "cursor-pointer" : "",
              // tableCellProps?.align === "right"
              //   ? "flex-row-reverse"
              //   : "flex-row",
              columnDefType !== "display" && "w-full",
              columnDefType === "data" ? "overflow-hidden" : "",
              // tableCellProps?.align === "center" ? `pl-${headerPL}rem` : "",
            )}
          >
            {/* {column.getCanFilter() && (
              <MRT_TableHeadCellFilterLabel header={header} table={table} />
            )} */}
            <div
              className={cn(
                "min-w-[4ch] text-ellipsis",
                columnDefType === "data" ? "overflow-hidden" : "",
                columnDef.header?.length && columnDef.header.length < 20 ? "whitespace-nowrap" : "whitespace-normal",
              )}
              // style={{
              //   "&:hover": {
              //     textOverflow: "clip",
              //   },
              // }}
            >
              {HeaderElement}
            </div>
            {/* @ts-ignore */}
            {column.getCanSort() && <Sort column={column} />}
          </div>

          {/* {columnDefType !== "group" && (
                <div
                  className="Mui-TableHeadCell-Content-Actions"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {showDragHandle && (
                    <MRT_TableHeadCellGrabHandle
                      column={column}
                      table={table}
                      tableHeadCellRef={{
                        current: tableHeadCellRefs.current?.[column.id]!,
                      }}
                    />
                  )}
                  {showColumnActions && (
                    <MRT_TableHeadCellColumnActionsButton
                      header={header}
                      table={table}
                    />
                  )}
                </div>
              )} */}
          {/* {column.getCanResize() && (
                <MRT_TableHeadCellResizeHandle header={header} table={table} />
              )} */}
        </div>
      )}
      {columnFilterDisplayMode === "subheader" && column.getCanFilter() && showColumnFilters && (
        <TableHeadCellFilterContainer header={header} table={table} />
      )}
    </th>
  )
}
