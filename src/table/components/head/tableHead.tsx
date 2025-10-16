
import { TableHeadRow } from "./tableHeadRow"
import { type TColumnVirtualizer, type TRowData, type TTableInstance } from "../../types"
import { cn } from "../../../lib/utils"
// import { parseFromValuesOrFunc } from "../../utils/utils"
// import { ToolbarAlertBanner } from '../toolbar/ToolbarAlertBanner';

export interface TableHeadProps<TData extends TRowData> /* extends TableHeadProps */ {
  columnVirtualizer?: TColumnVirtualizer
  table: TTableInstance<TData>
}

export const TableHead = <TData extends TRowData>({ columnVirtualizer, table, ...rest }: TableHeadProps<TData>) => {
  const {
    getState,
    options: {
      enableStickyHeader,
      layoutMode,
      // muiTableHeadProps,
      positionToolbarAlertBanner,
      // theme: { tHeadSticky, tHead },
    },
    refs: { tableHeadRef },
  } = table
  const { isFullScreen, showAlertBanner } = getState()

  const stickyHeader = enableStickyHeader || isFullScreen

  return (
    <thead
      className={cn(
        layoutMode?.startsWith("grid") && "grid",
        stickyHeader ? "sticky z-20" : "relative",
        stickyHeader && layoutMode?.startsWith("grid") ? 0 : undefined,
      )}
      ref={tableHeadRef}
    >
      {positionToolbarAlertBanner === "head-overlay" &&
      (showAlertBanner || table.getSelectedRowModel().rows.length > 0) ? (
        <tr
          style={{
            display: layoutMode?.startsWith("grid") ? "grid" : undefined,
          }}
        >
          <th
            colSpan={table.getVisibleLeafColumns().length}
            style={{
              display: layoutMode?.startsWith("grid") ? "grid" : undefined,
              padding: 0,
            }}
          >
            {/* <ToolbarAlertBanner table={table} /> */}
          </th>
        </tr>
      ) : (
        table
          .getHeaderGroups()
          .map((headerGroup) => (
            <TableHeadRow
              columnVirtualizer={columnVirtualizer}
              headerGroup={headerGroup as any}
              key={headerGroup.id}
              table={table}
            />
          ))
      )}
    </thead>
  )
}
