import { type TRowData, type TTableInstance } from "../../types"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { TopToolbar } from "../toolbar/topToolbar"
import { TablePagination } from "../tablePagination"
import { TableContainer } from "./tableContainer"

export interface TableWrapper<TData extends TRowData> {
  table: TTableInstance<TData>
}

export const TableWrapper = <TData extends TRowData>({ table }: TableWrapper<TData>) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
      enablePagination,
      positionPagination,
      enableTopToolbar,
      //   theme: { baseBackgroundColor },
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tableWrapperRef },
  } = table
  //   const { isFullScreen } = getState()

  return (
    <div
      className="overflow-visible transition-all duration-100 ease-in-out bg-background"
      //   elevation={2}
      //   onKeyDown={(e) => e.key === "Escape" && table.setIsFullScreen(false)}
      //   {...paperProps}
      ref={tableWrapperRef}
    >
      {enableTopToolbar && (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? <TopToolbar table={table} />)}
      <TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ??
          (enablePagination && ["both", "bottom"].includes(positionPagination ?? "bottom") ? (
            <TablePagination table={table} />
          ) : null))}
    </div>
  )
}
