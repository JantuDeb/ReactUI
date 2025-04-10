// import React, { useMemo } from "react"
// import { joinClassNames } from "@common/lib/util"
// import ActionMenuButton from "@common/table/components/buttons/rowActionMenu"
// import { getCommonCellStyles } from "@common/table/column.util"
// import { RTable } from "@common/table/types"
// import { flexRender, Cell, Row } from "@tanstack/react-table"
// import { useTheme } from "next-themes"
// import Link from "next/link"

// type BodyCellProps = {
//   cell: Cell<any, any>
//   table: RTable
//   row: Row<any>
//   colIndex: number
//   rowLink?: string
//   expandedRowId?: string
// }

// const BodyCell = ({
//   cell,
//   table,
//   row,
//   colIndex,
//   rowLink,
//   expandedRowId,
// }: BodyCellProps) => {
//   const { column } = cell
//   const { theme } = useTheme()

//   const {
//     options: {
//       rowActions,
//       initialState,
//       themes: { tdClasses, tdSpacingClasses, tdSelectedBgClasses, tdBgClasses },
//     },
//   } = table
//   const overflow = initialState?.overflow || "truncate"
//   const actions = rowActions?.actions ?? row.original.rowActions
//   const columnDef = column.columnDef as any
//   const isDisplayColumn = columnDef.type === "display"
//   const computedStyles = useMemo(
//     () =>
//       getCommonCellStyles({
//         column,
//         table,
//         theme,
//         header: undefined,
//         colSpan: 1,
//         isDisplayColumn,
//       }),
//     [column, isDisplayColumn, table, theme],
//   ) as Record<string, any>

//   return (
//     // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
//     <td
//       key={cell.id}
//       className={joinClassNames(
//         tdClasses,
//         column.id === "row-actions" || isDisplayColumn ? "" : tdSpacingClasses,
//         row.getIsSelected() || expandedRowId === row.id
//           ? tdSelectedBgClasses
//           : tdBgClasses,
//         isDisplayColumn && column.id !== "row-expand" ? "justify-center" : "",
//       )}
//       style={computedStyles}
//       /* Prevent row click on checkbox cell */
//       onClick={(e) => column.id === "row-select" && e.stopPropagation()}
//     >
//       {column.id === "row-actions" ? (
//         <ActionMenuButton
//           key={cell.id}
//           row={row}
//           actions={actions}
//           onRowActionClick={rowActions?.onRowActionClick}
//         />
//       ) : /* Don't wrap cell with a div if it's row selection checkbox */ column.id ===
//           "row-select" && column.columnDef.cell instanceof Function ? (
//         column.columnDef.cell?.(cell.getContext())
//       ) : cell.getIsPlaceholder() ? null : (
//         <div
//           style={{
//             paddingLeft: colIndex < 2 ? `${row.depth * 1}rem` : undefined,
//           }}
//           className={joinClassNames(
//             isDisplayColumn ? "" : "h-full w-full text-xs-r",
//             overflow === "truncate" ? "truncate" : "text-wrap",
//           )}
//         >
//           {rowLink ? (
//             <Link href={rowLink} className="block h-full">
//               {renderCell()}{" "}
//             </Link>
//           ) : (
//             renderCell()
//           )}
//         </div>
//       )}
//     </td>
//   )

//   function renderCell() {
//     return flexRender(column.columnDef.cell, cell.getContext())
//   }
// }

// export default BodyCell

import {
  type DragEvent,
  type MouseEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react"

// import { TableBodyCellValue } from './TableBodyCellValue';
import { type TCell, type TRowData, type TTableInstance } from "../../types"
import {
  isCellEditable,
  cellKeyboardShortcuts,
  openEditingCell,
} from "../../utils/cell.utils"
// import {
//   getCommonMRTCellStyles,
//   getCommonPinnedCellStyles,
// } from "../../utils/style.utils"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { cn } from "@common/utils"
import { TableBodyCellValue } from "./tableBodyCellValue"
import { getCommonCellStyles } from "../../utils/style.utils"

// import { CopyButton } from '../buttons/CopyButton';
// import { EditCellTextField } from '../inputs/EditCellTextField';

export interface TableBodyCellProps<TData extends TRowData> {
  /*  extends TableCellProps  */
  cell: TCell<TData>
  numRows?: number
  rowRef: RefObject<HTMLTableRowElement | null>
  staticColumnIndex?: number
  staticRowIndex: number
  table: TTableInstance<TData>
}

export const TableBodyCell = <TData extends TRowData>({
  cell,
  numRows,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
  ...rest
}: TableBodyCellProps<TData>) => {
  // const theme = useTheme()
  const {
    getState,
    options: {
      columnResizeDirection,
      columnResizeMode,
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableKeyboardShortcuts,
      layoutMode,
      theme: {
        draggingBorderColor,
        td,
        tdBackground,
        tdSpacing,
        tdSelectedBackground,
      },
      // muiSkeletonProps,
      // muiTableBodyCellProps,
    },
    setHoveredColumn,
  } = table
  const {
    actionCell,
    columnSizingInfo,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredColumn,
    hoveredRow,
    isLoading,
    showSkeletons,
  } = getState()
  const { column, row } = cell
  const { columnDef } = column
  const { columnDefType } = columnDef
  const isLastRow = numRows && staticRowIndex === numRows - 1
  // const args = { cell, column, row, table }
  // const tableCellProps = {
  //   ...parseFromValuesOrFunc(muiTableBodyCellProps, args),
  //   ...parseFromValuesOrFunc(columnDef.muiTableBodyCellProps, args),
  //   ...rest,
  // }

  // const skeletonProps = parseFromValuesOrFunc(muiSkeletonProps, {
  //   cell,
  //   column,
  //   row,
  //   table,
  // })

  // const [skeletonWidth, setSkeletonWidth] = useState(100)
  // useEffect(() => {
  //   if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return
  //   const size = column.getSize()
  //   setSkeletonWidth(
  //     columnDefType === "display"
  //       ? size / 2
  //       : Math.round(Math.random() * (size - size / 3) + size / 3),
  //   )
  // }, [isLoading, showSkeletons])

  const draggingBorders = useMemo(() => {
    const isDraggingColumn = draggingColumn?.id === column.id
    const isHoveredColumn = hoveredColumn?.id === column.id
    const isDraggingRow = draggingRow?.id === row.id
    const isHoveredRow = hoveredRow?.id === row.id
    const isFirstColumn = column.getIsFirstColumn()
    const isLastColumn = column.getIsLastColumn()
    const isLastRow = numRows && staticRowIndex === numRows - 1
    const isResizingColumn = columnSizingInfo.isResizingColumn === column.id
    const showResizeBorder = isResizingColumn && columnResizeMode === "onChange"

    const borderStyle = showResizeBorder
      ? `2px solid ${draggingBorderColor} !important`
      : isDraggingColumn || isDraggingRow
      ? `1px dashed var(--border) !important`
      : isHoveredColumn || isHoveredRow || isResizingColumn
      ? `2px dashed ${draggingBorderColor} !important`
      : undefined

    if (showResizeBorder) {
      return columnResizeDirection === "ltr"
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle }
    }

    return borderStyle
      ? {
          borderBottom:
            isDraggingRow || isHoveredRow || (isLastRow && !isResizingColumn)
              ? borderStyle
              : undefined,
          borderLeft:
            isDraggingColumn ||
            isHoveredColumn ||
            ((isDraggingRow || isHoveredRow) && isFirstColumn)
              ? borderStyle
              : undefined,
          borderRight:
            isDraggingColumn ||
            isHoveredColumn ||
            ((isDraggingRow || isHoveredRow) && isLastColumn)
              ? borderStyle
              : undefined,
          borderTop: isDraggingRow || isHoveredRow ? borderStyle : undefined,
        }
      : undefined
  }, [
    columnSizingInfo.isResizingColumn,
    draggingColumn,
    draggingRow,
    hoveredColumn,
    hoveredRow,
    staticRowIndex,
  ])

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== "group" &&
    column.getIsPinned()

  const isEditable = isCellEditable({ cell, table })

  // const isEditing =
  //   isEditable &&
  //   !["custom", "modal"].includes(editDisplayMode as string) &&
  //   (editDisplayMode === "table" ||
  //     editingRow?.id === row.id ||
  //     editingCell?.id === cell.id) &&
  //   !row.getIsGrouped()

  // const isCreating =
  //   isEditable && createDisplayMode === "row" && creatingRow?.id === row.id

  // const showClickToCopyButton =
  //   (parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
  //     parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
  //   !["context-menu", false].includes(
  //     // @ts-expect-error
  //     parseFromValuesOrFunc(columnDef.enableClickToCopy, cell),
  //   )

  const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell)

  const cellValueProps = {
    cell,
    table,
    staticColumnIndex,
    staticRowIndex,
  }

  const handleDoubleClick = (_event: MouseEvent<HTMLTableCellElement>) => {
    // tableCellProps?.onDoubleClick?.(event)
    openEditingCell({ cell, table })
  }

  const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
    // tableCellProps?.onDragEnter?.(e)
    if (enableGrouping && hoveredColumn?.id === "drop-zone") {
      setHoveredColumn(null)
    }
    if (enableColumnOrdering && draggingColumn) {
      setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault()
    }
  }

  const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
    // tableCellProps?.onContextMenu?.(e)
    if (isRightClickable) {
      e.preventDefault()
      table.setActionCell(cell)
      table.refs.actionCellRef.current = e.currentTarget
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    // tableCellProps?.onKeyDown?.(event)
    cellKeyboardShortcuts({
      cell,
      cellValue: cell.getValue<string>(),
      event,
      table,
    })
  }
  const isDisplayColumn = columnDefType === "display"

  return (
    <td
      className={cn(
        td,
        "table-cell relative",
        column.id === "row-actions" || isDisplayColumn ? "" : tdSpacing,
        row.getIsSelected() //|| expandedRowId === row.id
          ? tdSelectedBackground
          : tdBackground,
        isDisplayColumn && column.id !== "row-expand" ? "justify-center" : "",
      )}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      // {...tableCellProps}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      style={{
        // "&:hover": {
        //   outline:
        //     actionCell?.id === cell.id ||
        //     (editDisplayMode === "cell" && isEditable) ||
        //     (editDisplayMode === "table" && (isCreating || isEditing))
        //       ? `1px solid ${theme.palette.grey[500]}`
        //       : undefined,
        //   textOverflow: "clip",
        // },
        alignItems: layoutMode?.startsWith("grid") ? "center" : undefined,
        cursor: isRightClickable
          ? "context-menu"
          : isEditable && editDisplayMode === "cell"
          ? "pointer"
          : "inherit",
        outline:
          actionCell?.id === cell.id ? `1px solid var(--border)` : undefined,
        outlineOffset: "-1px",
        overflow: "hidden",
        padding:
          density === "compact"
            ? isDisplayColumn
              ? "0 0.5rem"
              : "0.5rem"
            : density === "comfortable"
            ? isDisplayColumn
              ? "0.5rem 0.75rem"
              : "1rem"
            : isDisplayColumn
            ? "1rem 1.25rem"
            : "1.5rem",

        textOverflow: isDisplayColumn ? undefined : "ellipsis",
        whiteSpace:
          row.getIsPinned() || density === "compact" ? "nowrap" : "normal",
        position: "relative",
        ...getCommonCellStyles({
          column,
          table,
          // header,
          // tableCellProps,
          // theme,
        }),
        borderWidth: isLastRow ? 0 : undefined,
        ...draggingBorders,
      }}
    >
      {
        <>
          {cell.getIsPlaceholder() ? (
            columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null
          ) : showSkeletons !== false && (isLoading || showSkeletons) ? (
            <div /* Skeleton */
              className="h-5 w-full animate-pulse"
              // {...skeletonProps}
            />
          ) : columnDefType === "display" &&
            (["row-expand", "row-numbers", "row-select"].includes(column.id) ||
              !row.getIsGrouped()) ? (
            columnDef.Cell?.({
              cell,
              column,
              renderedCellValue: cell.renderValue() as any,
              row,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            })
          ) : (
            //  isCreating || isEditing ? (
            //   <EditCellTextField cell={cell} table={table} />
            // ) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
            //   <CopyButton cell={cell} table={table}>
            //     <TableBodyCellValue {...cellValueProps} />
            //   </CopyButton>
            // ) : (

            <TableBodyCellValue {...cellValueProps} />
          )}
          {cell.getIsGrouped() && !columnDef.GroupedCell && (
            <> ({row.subRows?.length})</>
          )}
        </>
      }
    </td>
  )
}

export const MemoTableBodyCell = memo(
  TableBodyCell,
  (prev, next) => next.cell === prev.cell,
) as typeof TableBodyCell
