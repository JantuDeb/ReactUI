// import HeadCell from "@common/table/head/headCell"
// import { useColumnVirtualizer } from "@common/table/hooks/useColumnVirtualizer"
// import { RTable } from "@common/table/types"
// import { Header, HeaderGroup } from "@tanstack/react-table"
// import { VirtualItem } from "@tanstack/react-virtual"
// import React, { memo } from "react"

// function TableHeadRow({
//   table,
//   headerGroup,
// }: {
//   table: RTable
//   headerGroup: HeaderGroup<any>
// }) {
//   const { enableRowVirtualization, enableColumnVirtualization } = table.options

//   const { headers } = headerGroup

//   const headerVirtual = useColumnVirtualizer(table, headers)
//   const virtualHeaders = headerVirtual?.virtualColumns
//   const hVirtualPaddingLeft = headerVirtual?.virtualPaddingLeft
//   const hVirtualPaddingRight = headerVirtual?.virtualPaddingRight

//   return (
//     <tr
//       key={headerGroup.id}
//       className={enableRowVirtualization ? "flex" : "table-row"}
//     >
//       {hVirtualPaddingLeft ? (
//         <th style={{ display: "flex", width: hVirtualPaddingLeft }} />
//       ) : null}
//       {(virtualHeaders ?? headers).map(
//         (headerOrVirtualHeader, staticColumnIndex) => {
//           let header = headerOrVirtualHeader as Header<any, any>
//           if (enableColumnVirtualization && headerVirtual && header) {
//             const virtualHeader = headerOrVirtualHeader as VirtualItem<any>
//             staticColumnIndex = virtualHeader.index
//             header = headers[staticColumnIndex]
//           }
//           return header ? (
//             <HeadCell key={header.id} header={header} table={table} />
//           ) : null
//         },
//       )}
//       {hVirtualPaddingRight ? (
//         <th style={{ display: "flex", width: hVirtualPaddingRight }} />
//       ) : null}
//     </tr>
//   )
// }

// export default memo(TableHeadRow)

import { TableHeadCell } from "./tableHeadCell"
import {
  type TColumnVirtualizer,
  type THeader,
  type THeaderGroup,
  type TRowData,
  type TTableInstance,
  type TVirtualItem,
} from "../../types"
// import { parseFromValuesOrFunc } from "../../utils/utils"
import { cn } from "@common/utils"

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
