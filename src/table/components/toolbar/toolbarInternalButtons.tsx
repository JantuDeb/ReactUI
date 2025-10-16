import { type TRowData, type TTableInstance } from "../../types"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { ShowHideColumnsButton } from "../buttons/showHideColumnButton"
import { ToggleGlobalFilterButton } from "../buttons/toogleGlobalFilterButton"
// import { ToggleDensePaddingButton } from "../buttons/toggleDensePaddingButton"
// import { ToggleFiltersButton } from "../buttons/toggleFiltersButton"
// import { ToggleFullScreenButton } from "../buttons/toggleFullScreenButton"
// import { ToggleGlobalFilterButton } from "../buttons/toggleGlobalFilterButton"
import { Box } from "../shared/box"

export interface ToolbarInternalButtonsProps<TData extends TRowData> {
  table: TTableInstance<TData>
}

export const ToolbarInternalButtons = <TData extends TRowData>({
  table,
  ...rest
}: ToolbarInternalButtonsProps<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      initialState,
      renderToolbarInternalActions,
    },
  } = table

  return (
    <Box className="flex items-center z-30">
      {renderToolbarInternalActions?.({
        table,
      }) ?? (
        <>
          {enableFilters && enableGlobalFilter && !initialState?.showGlobalFilter && (
            <ToggleGlobalFilterButton table={table} />
          )}
          {/* {enableFilters && enableColumnFilters && columnFilterDisplayMode !== "popover" && (
            <ToggleFiltersButton table={table} />
          )} */}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && <ShowHideColumnsButton table={table} />}
          {/* {enableDensityToggle && <ToggleDensePaddingButton table={table} />} */}
          {/* {enableFullScreenToggle && <MRT_ToggleFullScreenButton table={table} />} */}
        </>
      )}
    </Box>
  )
}
