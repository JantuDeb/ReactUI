import { useEffect, useLayoutEffect, useState } from "react"

import { Table } from "./table"
import { type TRowData, type TTableInstance } from "../../types"
import Spinner from "@common/spinner"
// import { CellActionMenu } from '../menus/CellActionMenu';
// import { EditRowModal } from '../modals/EditRowModal';

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export interface TableContainerProps<TData extends TRowData> {
  table: TTableInstance<TData>
}

export const TableContainer = <TData extends TRowData>({
  table,
}: TableContainerProps<TData>) => {
  const {
    getState,
    options: {
      //   createDisplayMode,
      //   editDisplayMode,
      //   enableCellActions,
      //   enableStickyHeader,
      //   muiTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table
  const {
    // actionCell,
    // creatingRow,
    // editingRow,
    // isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = getState()

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay)

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0)

  //   const tableContainerProps = {
  //     ...parseFromValuesOrFunc(muiTableContainerProps, {
  //       table,
  //     }),
  //     ...rest,
  //   }

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== "undefined"
        ? topToolbarRef.current?.offsetHeight ?? 0
        : 0

    const bottomToolbarHeight =
      typeof document !== "undefined"
        ? bottomToolbarRef?.current?.offsetHeight ?? 0
        : 0

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight)
  })

  //   const createModalOpen = createDisplayMode === "modal" && creatingRow
  //   const editModalOpen = editDisplayMode === "modal" && editingRow

  return (
    <div
      className="w-full h-full overflow-auto relative max-w-full"
      aria-busy={loading}
      aria-describedby={loading ? "mrt-progress" : undefined}
      ref={(node: HTMLDivElement) => {
        if (node) {
          tableContainerRef.current = node
        }
      }}
      //   style={{
      //     maxHeight: isFullScreen
      //       ? `calc(100vh - ${totalToolbarHeight}px)`
      //       : undefined,
      //   }}
      //   sx={(theme) => ({
      //     maxHeight: enableStickyHeader
      //       ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
      //       : undefined,
      //   })}
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : null}
      <Table table={table} />
      {/* {(createModalOpen || editModalOpen) && (
        <EditRowModal open table={table} />
      )} */}
      {/* {enableCellActions && actionCell && <CellActionMenu table={table} />} */}
    </div>
  )
}
