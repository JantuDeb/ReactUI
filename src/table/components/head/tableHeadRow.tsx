

import { TableHeadCell } from "./tableHeadCell"
import {
  type TColumnVirtualizer,
  type THeader,
  type THeaderGroup,
  type TRowData,
  type TTableInstance,
  type TVirtualItem,
} from "../../types"
import { cn } from "../../../lib/utils"
// import { parseFromValuesOrFunc } from "../../utils/utils"

export interface MRT_TableHeadRowProps<TData extends TRowData> {
  /* extends TableRowProps { */
  columnVirtualizer?: TColumnVirtualizer
  headerGroup: THeaderGroup<TData>
  table: TTableInstance<TData>
}

export const TableHeadRow = <TData extends TRowData>({
  columnVirtualizer,
  headerGroup,
  table,
  ...rest
}: MRT_TableHeadRowProps<TData>) => {
  const {
    options: {
      enableStickyHeader,
      layoutMode,
      // theme: { baseBackgroundColor },
    },
  } = table

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {}

  // const tableRowProps = {
  //   ...parseFromValuesOrFunc(muiTableHeadRowProps, {
  //     headerGroup,
  //     table,
  //   }),
  //   ...rest,
  // }

  return (
    <tr
      className={cn(
        layoutMode?.startsWith("grid") ? "flex" : undefined,
        enableStickyHeader && layoutMode === "semantic" ? "sticky" : "relative",
        "top-0",
      )}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: "flex", width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? headerGroup.headers).map(
        (headerOrVirtualHeader, staticColumnIndex) => {
          let header = headerOrVirtualHeader as THeader<TData>
          if (columnVirtualizer) {
            staticColumnIndex = (headerOrVirtualHeader as TVirtualItem).index
            header = headerGroup.headers[staticColumnIndex]
          }

          return header ? (
            <TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
              staticColumnIndex={staticColumnIndex}
              table={table}
            />
          ) : null
        },
      )}
      {virtualPaddingRight ? (
        <th style={{ display: "flex", width: virtualPaddingRight }} />
      ) : null}
    </tr>
  )
}
