import { type RefObject } from "react"
// import TableCell, { type TableCellProps } from "@mui/material/TableCell"
// import TableRow from "@mui/material/TableRow"
import {
  type TRow,
  type TRowData,
  type TRowVirtualizer,
  type TTableInstance,
  type TVirtualItem,
} from "../../types"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { cn } from "@common/utils"
import { getIsRowSelected } from "../../utils/row.utils"

export interface TableDetailPanelProps<TData extends TRowData> {
  /* extends TableCellProps */ parentRowRef: RefObject<HTMLTableRowElement | null>
  row: TRow<TData>
  rowVirtualizer?: TRowVirtualizer
  staticRowIndex: number
  table: TTableInstance<TData>
  virtualRow?: TVirtualItem
}

export const TableDetailPanel = <TData extends TRowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
}: // ...rest
TableDetailPanelProps<TData>) => {
  const {
    getState,
    getVisibleLeafColumns,
    options: {
      layoutMode,
      theme: { td, tdBackground, tdSelectedBackground },
      // muiDetailPanelProps,
      // muiTableBodyRowProps,
      renderDetailPanel,
    },
  } = table
  const { isLoading } = getState()

  // const tableRowProps = parseFromValuesOrFunc(muiTableBodyRowProps, {
  //   isDetailPanel: true,
  //   row,
  //   staticRowIndex,
  //   table,
  // })

  // const tableCellProps = {
  //   ...parseFromValuesOrFunc(muiDetailPanelProps, {
  //     row,
  //     table,
  //   }),
  //   ...rest,
  // }

  const DetailPanel = !isLoading && renderDetailPanel?.({ row, table })
  const isRowSelected = getIsRowSelected({ row, table })
  return (
    <tr
      className="table-row group w-full"
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node: HTMLTableRowElement) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node)
        }
      }}
      // {...tableRowProps}
      style={{
        display: layoutMode?.startsWith("grid") ? "flex" : undefined,
        position: virtualRow ? "absolute" : undefined,
        top: virtualRow
          ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
          : undefined,
        transform: virtualRow
          ? `translateY(${virtualRow?.start}px)`
          : undefined,
      }}
    >
      <td
        className={cn(
          "table-cell",
          td,
          tdBackground,
          DetailPanel && row.getIsExpanded() && "py-4",
          virtualRow && "transition-all ease-in-out",
          isRowSelected && tdSelectedBackground,
        )}
        colSpan={getVisibleLeafColumns().length}
        // {...tableCellProps}
        style={{
          borderBottom: !row.getIsExpanded() ? "none" : undefined,
          display: layoutMode?.startsWith("grid") ? "flex" : undefined,
        }}
      >
        {/* {virtualRow ? ( */}
        {row.getIsExpanded() && DetailPanel}
        {/* 
          TODO: // implement it
           <Collapse in={row.getIsExpanded()} mountOnEnter unmountOnExit>
             {DetailPanel}
           </Collapse>
          */}
      </td>
    </tr>
  )
}
