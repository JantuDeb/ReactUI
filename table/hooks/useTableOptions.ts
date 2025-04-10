import { useId, useMemo } from "react"
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"

import { filterFns as _filterFns } from "../fns/filterFns"
import { sortingFns as _sortingFns } from "../fns/sortingFns"
import { aggregationFns as _aggregationFns } from "@tanstack/react-table"
// import { MRT_Default_Icons } from '../icons';
// import { MRT_Localization_EN } from '../locales/en';
import {
  TTheme,
  type TDefinedTableOptions,
  type TRowData,
  type TTableOptions,
} from "../types"
import { tableBaseThemes } from "../table.styles"
// import { getMRTTheme } from "../utils/style.utils"

export const DefaultColumn = {
  filterVariant: "text",
  maxSize: 1000,
  minSize: 40,
  size: 180,
} as const

export const DefaultDisplayColumn = {
  columnDefType: "display",
  enableClickToCopy: false,
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnFilter: false,
  enableColumnOrdering: false,
  enableEditing: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableResizing: false,
  enableSorting: false,
} as const

export const useTableOptions: <TData extends TRowData>(
  tableOptions: TTableOptions<TData>,
) => TDefinedTableOptions<TData> = <TData extends TRowData>({
  aggregationFns,
  autoResetExpanded = false,
  columnFilterDisplayMode = "subheader",
  columnResizeDirection,
  columnResizeMode = "onChange",
  createDisplayMode = "modal",
  defaultColumn,
  defaultDisplayColumn,
  editDisplayMode = "modal",
  enableBatchRowSelection = true,
  enableBottomToolbar = true,
  enableColumnActions = true,
  enableColumnFilters = true,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  enableColumnResizing = false,
  enableColumnVirtualization,
  enableDensityToggle = true,
  enableExpandAll = true,
  enableExpanding,
  enableFacetedValues = false,
  enableFilterMatchHighlighting = true,
  enableFilters = true,
  enableFullScreenToggle = true,
  enableGlobalFilter = true,
  enableGlobalFilterRankedResults = true,
  enableGrouping = false,
  enableHiding = true,
  enableKeyboardShortcuts = true,
  enableMultiRowSelection = true,
  enableMultiSort = true,
  enablePagination = true,
  enableRowPinning = false,
  enableRowSelection = false,
  enableRowVirtualization,
  enableSelectAll = true,
  enableSorting = true,
  enableStickyHeader = false,
  enableTableFooter = true,
  enableTableHead = true,
  enableToolbarInternalActions = true,
  enableTopToolbar = true,
  filterFns,
  // icons,
  id = useId(),
  layoutMode,
  localization,
  manualFiltering,
  manualGrouping,
  manualPagination,
  manualSorting,
  theme,
  paginationDisplayMode = "default",
  positionActionsColumn = "first",
  positionCreatingRow = "top",
  positionExpandColumn = "first",
  positionGlobalFilter = "right",
  positionPagination = "bottom",
  positionToolbarAlertBanner = "top",
  positionToolbarDropZone = "top",
  rowNumberDisplayMode = "static",
  rowPinningDisplayMode = "sticky",
  selectAllMode = "page",
  sortingFns,
  ...rest
}: TTableOptions<TData>) => {
  // const theme = useTheme()

  // icons = useMemo(() => ({ ...MRT_Default_Icons, ...icons }), [icons])
  // localization = useMemo(
  //   () => ({
  //     ...MRT_Localization_EN,
  //     ...localization,
  //   }),
  //   [localization],
  // )
  // mrtTheme = useMemo(() => getMRTTheme(mrtTheme, theme), [mrtTheme, theme])
  aggregationFns = useMemo(
    () => ({ ..._aggregationFns, ...aggregationFns }),
    [],
  )
  filterFns = useMemo(() => ({ ..._filterFns, ...filterFns }), [])
  sortingFns = useMemo(() => ({ ..._sortingFns, ...sortingFns }), [])
  defaultColumn = useMemo(
    () => ({ ...DefaultColumn, ...defaultColumn }),
    [defaultColumn],
  )
  defaultDisplayColumn = useMemo(
    () => ({
      ...DefaultDisplayColumn,
      ...defaultDisplayColumn,
    }),
    [defaultDisplayColumn],
  )
  //cannot be changed after initialization
  ;[enableColumnVirtualization, enableRowVirtualization] = useMemo(
    () => [enableColumnVirtualization, enableRowVirtualization],
    [],
  )

  if (!columnResizeDirection) {
    columnResizeDirection = "ltr"
  }

  layoutMode =
    layoutMode || (enableColumnResizing ? "grid-no-grow" : "semantic")
  if (
    layoutMode === "semantic" &&
    (enableRowVirtualization || enableColumnVirtualization)
  ) {
    layoutMode = "grid"
  }

  if (enableRowVirtualization) {
    enableStickyHeader = true
  }

  if (enablePagination === false && manualPagination === undefined) {
    manualPagination = true
  }

  if (!rest.data?.length) {
    manualFiltering = true
    manualGrouping = true
    manualPagination = true
    manualSorting = true
  }

  return {
    aggregationFns,
    autoResetExpanded,
    columnFilterDisplayMode,
    columnResizeDirection,
    columnResizeMode,
    createDisplayMode,
    defaultColumn,
    defaultDisplayColumn,
    editDisplayMode,
    enableBatchRowSelection,
    enableBottomToolbar,
    enableColumnActions,
    enableColumnFilters,
    enableColumnOrdering,
    enableColumnPinning,
    enableColumnResizing,
    enableColumnVirtualization,
    enableDensityToggle,
    enableExpandAll,
    enableExpanding,
    enableFacetedValues,
    enableFilterMatchHighlighting,
    enableFilters,
    enableFullScreenToggle,
    enableGlobalFilter,
    enableGlobalFilterRankedResults,
    enableGrouping,
    enableHiding,
    enableKeyboardShortcuts,
    enableMultiRowSelection,
    enableMultiSort,
    enablePagination,
    enableRowPinning,
    enableRowSelection,
    enableRowVirtualization,
    enableSelectAll,
    enableSorting,
    enableStickyHeader,
    enableTableFooter,
    enableTableHead,
    enableToolbarInternalActions,
    enableTopToolbar,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel:
      enableExpanding || enableGrouping ? getExpandedRowModel() : undefined,
    getFacetedMinMaxValues: enableFacetedValues
      ? getFacetedMinMaxValues()
      : undefined,
    getFacetedRowModel: enableFacetedValues ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFacetedValues
      ? getFacetedUniqueValues()
      : undefined,
    getFilteredRowModel:
      (enableColumnFilters || enableGlobalFilter || enableFilters) &&
      !manualFiltering
        ? getFilteredRowModel()
        : undefined,
    getGroupedRowModel:
      enableGrouping && !manualGrouping ? getGroupedRowModel() : undefined,
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getSubRows: (row) => row?.subRows,
    // icons,
    id,
    layoutMode,
    localization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    theme: theme ?? tableBaseThemes,
    paginationDisplayMode,
    positionActionsColumn,
    positionCreatingRow,
    positionExpandColumn,
    positionGlobalFilter,
    positionPagination,
    positionToolbarAlertBanner,
    positionToolbarDropZone,
    rowNumberDisplayMode,
    rowPinningDisplayMode,
    selectAllMode,
    sortingFns,
    ...rest,
  } as TDefinedTableOptions<TData>
}
