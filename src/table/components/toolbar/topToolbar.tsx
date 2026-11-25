// import useMediaQuery from "@mui/material/useMediaQuery"
// import { MRT_LinearProgressBar } from "./MRT_LinearProgressBar"
// import { MRT_TablePagination } from "./MRT_TablePagination"
// import { MRT_ToolbarAlertBanner } from "./MRT_ToolbarAlertBanner"
// import { MRT_ToolbarDropZone } from "./MRT_ToolbarDropZone"
import { useMediaQuery } from "../../../hooks/useMediaQuery"
import { type TRowData, type TTableInstance } from "../../types"
import { commonToolbarClassNames, getCommonToolbarStyles } from "../../utils/style.utils"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { GlobalFilterTextField } from "../inputs/globalFilterTextField"
import { Box } from "../shared/box"
import { ToolbarInternalButtons } from "./toolbarInternalButtons"
import { cn } from "../../../lib/utils"

export interface TopToolbarProps<TData extends TRowData> {
  table: TTableInstance<TData>
}

export const TopToolbar = <TData extends TRowData>({ table }: TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      topToolbarProps,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
      toolbarFilters,
      toolbarActions,
    },
    refs: { topToolbarRef },
  } = table

  const filtersNode = parseFromValuesOrFunc(toolbarFilters, { table })
  const actionsNode = parseFromValuesOrFunc(toolbarActions, { table })

  const { isFullScreen, showGlobalFilter } = getState()

  const isMobile = useMediaQuery("(max-width:720px)")
  const isTablet = useMediaQuery("(max-width:1024px)")

  const toolbarProps = parseFromValuesOrFunc(topToolbarProps, { table })

  const stackAlertBanner = isMobile || !!renderTopToolbarCustomActions || (showGlobalFilter && isTablet)

  const globalFilterProps = {
    sx: !isTablet
      ? {
          zIndex: 2,
        }
      : undefined,
    table,
  }

  return (
    <Box
      // {...toolbarProps}
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref
        // if (toolbarProps?.ref) {
        //   // @ts-expect-error
        //   toolbarProps.ref.current = ref
        // }
      }}
      className={cn(commonToolbarClassNames, isFullScreen ? "sticky" : "relative", toolbarProps?.className)}
    >
      {/* {positionToolbarAlertBanner === "top" && (
        <MRT_ToolbarAlertBanner stackAlertBanner={stackAlertBanner} table={table} />
      )} */}
      {/* {["both", "top"].includes(positionToolbarDropZone ?? "") && <MRT_ToolbarDropZone table={table} />} */}
      <Box
        className={cn(
          "flex items-start box-border gap-2 justify-between pt-2 pb-0 top-0 right-0 w-full",
          "relative",
        )}
      >
        {enableGlobalFilter && positionGlobalFilter === "left" && <GlobalFilterTextField {...globalFilterProps} />}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <Box className="flex flex-wrap-reverse gap-2 justify-end items-center">
            {enableGlobalFilter && positionGlobalFilter === "right" && <GlobalFilterTextField {...globalFilterProps} />}
            {filtersNode}
            <ToolbarInternalButtons table={table} />
            {actionsNode}
          </Box>
        ) : (
          <Box className="flex flex-wrap-reverse gap-2 justify-end items-center">
            {enableGlobalFilter && positionGlobalFilter === "right" && <GlobalFilterTextField {...globalFilterProps} />}
            {filtersNode}
            {actionsNode}
          </Box>
        )}
      </Box>
      {/* {enablePagination && ["both", "top"].includes(positionPagination ?? "") && (
        <MRT_TablePagination position="top" table={table} />
      )} */}
      {/* <MRT_LinearProgressBar isTopToolbar table={table} /> */}
    </Box>
  )
}
