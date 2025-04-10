import {
  TColumnVirtualizer,
  TRow,
  TRowData,
  TTableInstance,
} from "@common/table/types"
import { TableBodyRow, MemoTableBodyRow } from "./tableBodyRow"
import { type VirtualItem } from "@tanstack/react-virtual"
import { memo, useMemo } from "react"
import { useRows } from "../../hooks/useRows"
import { useRowVirtualizer } from "../../hooks/useRowVirtualizer"

// type TableBodyProps = {
//   table: RTable
//   virtualRows?: VirtualItem<any>[]
//   totalHeight?: number
//   rowVirtualizer?: Virtualizer<HTMLDivElement, Element>
//   columnVirtualizer?: ColumnVirtualizer
// } & RowExpandState &
//   Pick<ReactTableProps, "onRowClick" | "wrapRowInLink" | "getLinkHref">

// export function TableBody({
//   table,
//   onRowClick,
//   virtualRows,
//   totalHeight,
//   rowVirtualizer,
//   columnVirtualizer,
//   ...rest
// }: TableBodyProps) {
//   const tableRows = table.getRowModel().rows
//   const searchText = table.refs.searchInputRef.current
//   const isVirtual = !!(
//     table.options.enableRowVirtualization && virtualRows?.length
//   )
//   const rows = isVirtual ? virtualRows : tableRows
//   const virtualStyles = isVirtual
//     ? {
//         display: "grid",
//         height: `${totalHeight}px`,
//         width: "100%",
//         position: "relative",
//       }
//     : undefined

//   const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
//     columnVirtualizer ?? {}
//   return (
//     <tbody className="table-body" style={virtualStyles as any}>
//       {searchText && isEmpty(tableRows) && (
//         <tr className="table-row group">
//           <td className="px-4 py-2" colSpan={2}>
//             No results found!
//           </td>
//         </tr>
//       )}
//       {rows.map((virtualOrRow) => {
//         const row = isVirtual
//           ? tableRows[virtualOrRow.index]
//           : (virtualOrRow as TableRow)
//         const virtualRow = isVirtual
//           ? (virtualOrRow as VirtualItem<any>)
//           : undefined

//         return (
//           <TableBodyRow
//             key={isVirtual ? virtualRow?.key : row.id}
//             table={table}
//             row={row}
//             onRowClick={onRowClick}
//             virtualRow={virtualRow}
//             rowVirtualizer={rowVirtualizer}
//             virtualColumns={virtualColumns}
//             virtualPaddingLeft={virtualPaddingLeft}
//             virtualPaddingRight={virtualPaddingRight}
//             {...rest}
//           />
//         )
//       })}
//     </tbody>
//   )
// }

export interface TableBodyProps<
  TData extends TRowData,
> /* extends TableBodyProps */ {
  columnVirtualizer?: TColumnVirtualizer
  table: TTableInstance<TData>
}

export const TableBody = <TData extends TRowData>({
  columnVirtualizer,
  table,
  ...tableBodyProps
}: TableBodyProps<TData>) => {
  const {
    getBottomRows,
    getIsSomeRowsPinned,
    getRowModel,
    getState,
    getTopRows,
    options: {
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      localization,
      memoMode,
      // muiTableBodyProps,
      renderDetailPanel,
      renderEmptyRowsFallback,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
  } = table
  const { columnFilters, globalFilter, isFullScreen, rowPinning } = getState()

  // const tableBodyProps = {
  //   // ...parseFromValuesOrFunc(muiTableBodyProps, { table }),
  //   ...rest,
  // }

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0

  const pinnedRowIds = useMemo(() => {
    if (!rowPinning.bottom?.length && !rowPinning.top?.length) return []
    return getRowModel()
      .rows.filter((row) => row.getIsPinned())
      .map((r) => r.id)
  }, [rowPinning, getRowModel().rows])

  const rows = useRows(table)

  const rowVirtualizer = useRowVirtualizer(table, rows)

  const { virtualRows } = rowVirtualizer ?? {}

  const commonRowProps = {
    columnVirtualizer,
    numRows: rows.length,
    table,
  }

  return (
    <>
      {!rowPinningDisplayMode?.includes("sticky") &&
        getIsSomeRowsPinned("top") && (
          <tbody
            className="table-body"
            // {...tableBodyProps}
            style={{
              display: layoutMode?.startsWith("grid") ? "grid" : undefined,
              position: "sticky",
              top: tableHeadHeight - 1,
              zIndex: 1,
            }}
          >
            {getTopRows().map((row, staticRowIndex) => {
              const props = {
                ...commonRowProps,
                row,
                staticRowIndex,
              }
              return memoMode === "rows" ? (
                <MemoTableBodyRow key={row.id} {...props} />
              ) : (
                <TableBodyRow key={row.id} {...props} />
              )
            })}
          </tbody>
        )}
      <tbody
        {...tableBodyProps}
        style={{
          display: layoutMode?.startsWith("grid") ? "grid" : undefined,
          height: rowVirtualizer
            ? `${rowVirtualizer.getTotalSize()}px`
            : undefined,
          minHeight: !rows.length ? "100px" : undefined,
          position: "relative",
        }}
        className="table-body relative"
      >
        {!rows.length ? (
          <tr
            style={{
              display: layoutMode?.startsWith("grid") ? "grid" : undefined,
            }}
          >
            <td
              colSpan={table.getVisibleLeafColumns().length}
              style={{
                display: layoutMode?.startsWith("grid") ? "grid" : undefined,
              }}
            >
              {renderEmptyRowsFallback?.({ table }) ?? (
                <div className="text-secondary italic py-8 text-center w-full">
                  {globalFilter || columnFilters.length
                    ? localization.noResultsFound
                    : localization.noRecordsToDisplay}
                </div>
              )}
            </td>
          </tr>
        ) : (
          <>
            {(virtualRows ?? rows).map((rowOrVirtualRow, staticRowIndex) => {
              let row = rowOrVirtualRow as TRow<TData>
              if (rowVirtualizer) {
                if (renderDetailPanel) {
                  if (rowOrVirtualRow.index % 2 === 1) {
                    return null
                  } else {
                    staticRowIndex = rowOrVirtualRow.index / 2
                  }
                } else {
                  staticRowIndex = rowOrVirtualRow.index
                }
                row = rows[staticRowIndex]
              }
              const props = {
                ...commonRowProps,
                pinnedRowIds,
                row,
                rowVirtualizer,
                staticRowIndex,
                virtualRow: rowVirtualizer
                  ? (rowOrVirtualRow as VirtualItem)
                  : undefined,
              }
              const key = `${row.id}-${row.index}`
              return memoMode === "rows" ? (
                <MemoTableBodyRow key={key} {...props} />
              ) : (
                <TableBodyRow key={key} {...props} />
              )
            })}
          </>
        )}
      </tbody>
      {!rowPinningDisplayMode?.includes("sticky") &&
        getIsSomeRowsPinned("bottom") && (
          <tbody
            {...tableBodyProps}
            style={{
              bottom: tableFooterHeight - 1,
              display: layoutMode?.startsWith("grid") ? "grid" : undefined,
              position: "sticky",
              zIndex: 1,
            }}
          >
            {getBottomRows().map((row, staticRowIndex) => {
              const props = {
                ...commonRowProps,
                row,
                staticRowIndex,
              }
              return memoMode === "rows" ? (
                <MemoTableBodyRow key={row.id} {...props} />
              ) : (
                <TableBodyRow key={row.id} {...props} />
              )
            })}
          </tbody>
        )}
    </>
  )
}

export const MemoTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody
