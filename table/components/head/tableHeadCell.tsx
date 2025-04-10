// import { Header } from "@common/header/headerUnit"
// import { joinClassNames } from "@common/lib/util"
// import Svg from "@common/svg"
// import {
//   getCommonCellStyles,
//   getIsLastLeftPinnedColumn,
// } from "@common/table/column.util"
// import TableHeadCellResizeHandle from "@common/table/head/tableHeadCellResizeHandle"
// import { ColumnActionMenu } from "@common/table/components/menus/columnActionMenu"
// import { TableHeadCellProps } from "@common/table/types"
// import TooltipInfo from "@common/tooltip/tooltipInfo"
// import { Column, flexRender } from "@tanstack/react-table"
// import { useTheme } from "next-themes"
// import React, { memo, useMemo } from "react"

import { cn } from "@common/utils"
import { TColumn } from "../../types"
import Svg from "@common/svg"

// const HeadCell = ({ header, table }: TableHeadCellProps) => {
//   const { column, isPlaceholder, colSpan } = header
//   const {
//     options: { themes: tableThemes, showToolbar },
//   } = table

//   const columnDef = column.columnDef as any
//   const isDisplayColumn = columnDef.type === "display"
//   const textAlign = columnDef.text_align || "start"
//   const { theme } = useTheme()
//   const computedStyles = useMemo(
//     () =>
//       getCommonCellStyles({
//         column,
//         table,
//         theme,
//         header,
//         type: "head",
//         colSpan,
//         isDisplayColumn,
//         isPlaceholder,
//       }),
//     [column, table, theme, header, colSpan, isDisplayColumn, isPlaceholder],
//   ) as Record<string, any>

//   const { info } = columnDef
//   const isLastPinnedCol = getIsLastLeftPinnedColumn(table, column)

//   return (
//     <th
//       key={header.id}
//       colSpan={header.colSpan}
//       data-index={header.index}
//       onClick={column.getToggleSortingHandler()}
//       scope="col"
//       style={computedStyles}
//       className={joinClassNames(
//         tableThemes.tHeadClasses,
//         isLastPinnedCol ? "" : "border-r",
//         column.getCanSort() ? "cursor-pointer" : "",
//         isDisplayColumn ? "justify-center items-center" : "py-2",
//         "relative group",
//       )}
//     >
//       {isPlaceholder ? null : (
//         <div
//           className={joinClassNames(
//             "flex items-center gap-1 flex-grow",
//             isDisplayColumn ? "h-full" : "mx-2",
//           )}
//         >
//           <Header.ShortHeader
//             color="secondary"
//             width="full"
//             //TODO:need to change the alignment to "start", "end", "center"
//             alignment={
//               textAlign === "end"
//                 ? "right"
//                 : textAlign === "center"
//                 ? "center"
//                 : "left"
//             }
//           >
//             {flexRender(header.column.columnDef.header, header.getContext())}
//           </Header.ShortHeader>
//           {info && (
//             <div>
//               <TooltipInfo position={undefined}>{info}</TooltipInfo>
//             </div>
//           )}
//           {!isDisplayColumn && (
//             <div className="flex items-center ml-auto">
//               {showToolbar && (
//                 <ColumnActionMenu table={table} header={header} />
//               )}
//               {column.getCanSort() && <Sort column={header.column} />}
//               {column.getCanResize() && showToolbar && (
//                 <TableHeadCellResizeHandle header={header} table={table} />
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </th>
//   )
// }

function Sort({ column }: { column: TColumn<any, any> }) {
  const isSorted = column.getIsSorted() as string

  return (
    <span
      className={cn(
        "w-3 group-hover:opacity-100 ml-auto",
        !isSorted ? "opacity-0" : "",
      )}
    >
      <Svg
        name="arrow-up-short"
        viewBox="0 0 16 16"
        className={cn(
          "h-2 w-3",
          isSorted === "asc" ? "opacity-100" : "opacity-50",
        )}
      />
      <Svg
        name="arrow-down-short"
        viewBox="0 0 16 16"
        className={cn(
          "h-2 w-3 ",
          isSorted === "desc" ? "opacity-100" : "opacity-50",
        )}
      />
    </span>
  )
}

import { type DragEvent, useMemo } from "react"

import {
  type TColumnVirtualizer,
  type THeader,
  type TRowData,
  type TTableInstance,
} from "../../types"
import { getCommonCellStyles } from "../../utils/style.utils"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { cellKeyboardShortcuts } from "../../utils/cell.utils"

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
  const {
    columnSizingInfo,
    density,
    draggingColumn,
    grouping,
    hoveredColumn,
    showColumnFilters,
  } = getState()
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

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== "group" &&
    column.getIsPinned()

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
      columnSizingInfo.isResizingColumn === column.id &&
      columnResizeMode === "onChange" &&
      !header.subHeaders.length

    const borderStyle = showResizeBorder
      ? `2px solid ${draggingBorderColor} !important`
      : draggingColumn?.id === column.id
      ? `1px dashed var(--accent)`
      : hoveredColumn?.id === column.id
      ? `2px dashed ${draggingBorderColor}`
      : undefined

    if (showResizeBorder) {
      return columnResizeDirection === "ltr"
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle }
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

  return (
    <th
      // align={
      //   columnDefType === "group"
      //     ? "center"
      //     : theme.direction === "rtl"
      //     ? "right"
      //     : "left"
      // }
      aria-sort={
        column.getIsSorted()
          ? column.getIsSorted() === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
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
        column.getCanSort() ? "cursor-pointer" : "",
        // isDisplayColumn ? "justify-center items-center" : "py-2",
        "relative group",
        layoutMode?.startsWith("grid") ? "flex-col" : undefined,
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
            "flex items-center relative w-full",
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
              column.getCanSort() && columnDefType !== "group"
                ? "cursor-pointer"
                : "",
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
                columnDef.header?.length && columnDef.header.length < 20
                  ? "whitespace-nowrap"
                  : "whitespace-normal",
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
      {/* {columnFilterDisplayMode === "subheader" && column.getCanFilter() && (
        <MRT_TableHeadCellFilterContainer header={header} table={table} />
      )} */}
    </th>
  )
}
