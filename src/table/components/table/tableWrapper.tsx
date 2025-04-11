import { type TRowData, type TTableInstance } from "../../types"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { TableContainer } from "./tableContainer"
// import { BottomToolbar } from '../toolbar/BottomToolbar';
// import { TopToolbar } from '../toolbar/TopToolbar';

export interface TableWrapper<TData extends TRowData> {
  table: TTableInstance<TData>
}

export const TableWrapper = <TData extends TRowData>({
  table,
}: TableWrapper<TData>) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
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
      className="overflow-hidden transition-all duration-100 ease-in-out bg-background"
      //   elevation={2}
      //   onKeyDown={(e) => e.key === "Escape" && table.setIsFullScreen(false)}
      //   {...paperProps}
      ref={tableWrapperRef}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? <div />)}
      <TableContainer table={table} />
      {/* {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <BottomToolbar table={table} />
        ))} */}
    </div>
  )
}
