import { useMemo, useRef, useState } from "react"
import { useReactTable } from "@tanstack/react-table"
import {
  type TCell,
  type TColumn,
  type TColumnDef,
  type TColumnFilterFnsState,
  type TColumnOrderState,
  type TColumnSizingInfoState,
  type TDefinedTableOptions,
  type TDensityState,
  type TFilterOption,
  type TGroupingState,
  type TPaginationState,
  type TRow,
  type TRowData,
  type TStatefulTableOptions,
  type TTableInstance,
  type TTableState,
  type TUpdater,
} from "../types"
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from "../utils/column.utils"
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from "../utils/displayColumn.utils"
import { createRow } from "../utils/tanstack.helpers"
import { getRowActionsColumnDef } from "./display-columns/getRowActionsColumnDef"
import { getRowDragColumnDef } from "./display-columns/getRowDragColumnDef"
import { getRowExpandColumnDef } from "./display-columns/getRowExpandColumnDef"
import { getRowNumbersColumnDef } from "./display-columns/getRowNumbersColumnDef"
import { getRowPinningColumnDef } from "./display-columns/getRowPinningColumnDef"
import { getRowSelectColumnDef } from "./display-columns/getRowSelectColumnDef"
import { getRowSpacerColumnDef } from "./display-columns/getRowSpacerColumnDef"
import { useTableEffects } from "./useTableEffects"

/**
 * The MRT hook that wraps the TanStack useReactTable hook and adds additional functionality
 * @param definedTableOptions - table options with proper defaults set
 * @returns the MRT table instance
 */
export const useTableInstance = <TData extends TRowData>(
  definedTableOptions: TDefinedTableOptions<TData>,
): TTableInstance<TData> => {
  const lastSelectedRowId = useRef<string>(null)
  const actionCellRef = useRef<HTMLTableCellElement>(null)
  const bottomToolbarRef = useRef<HTMLDivElement>(null)
  const editInputRefs = useRef<Record<string, HTMLInputElement>>({})
  const filterInputRefs = useRef<Record<string, HTMLInputElement>>({})
  const searchInputRef = useRef<HTMLInputElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({})
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const topToolbarRef = useRef<HTMLDivElement>(null)
  const tableHeadRef = useRef<HTMLTableSectionElement>(null)
  const tableFooterRef = useRef<HTMLTableSectionElement>(null)

  //transform initial state with proper column order
  const initialState: Partial<TTableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {}
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as TStatefulTableOptions<TData>)
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? "fuzzy"
    return initState
  }, [])

  definedTableOptions.initialState = initialState

  const [actionCell, setActionCell] = useState<TCell<TData> | null>(
    initialState.actionCell ?? null,
  )
  const [creatingRow, _setCreatingRow] = useState<TRow<TData> | null>(
    initialState.creatingRow ?? null,
  )
  const [columnFilterFns, setColumnFilterFns] = useState<TColumnFilterFnsState>(
    () =>
      Object.assign(
        {},
        ...getAllLeafColumnDefs(
          definedTableOptions.columns as TColumnDef<TData>[],
        ).map((col) => ({
          [getColumnId(col)]:
            col.filterFn instanceof Function
              ? col.filterFn.name ?? "custom"
              : col.filterFn ??
                initialState?.columnFilterFns?.[getColumnId(col)] ??
                getDefaultColumnFilterFn(col),
        })),
      ),
  )
  const [columnOrder, onColumnOrderChange] = useState<TColumnOrderState>(
    initialState.columnOrder ?? [],
  )
  const [columnSizingInfo, onColumnSizingInfoChange] =
    useState<TColumnSizingInfoState>(
      initialState.columnSizingInfo ?? ({} as TColumnSizingInfoState),
    )
  const [density, setDensity] = useState<TDensityState>(
    initialState?.density ?? "comfortable",
  )
  const [draggingColumn, setDraggingColumn] = useState<TColumn<TData> | null>(
    initialState.draggingColumn ?? null,
  )
  const [draggingRow, setDraggingRow] = useState<TRow<TData> | null>(
    initialState.draggingRow ?? null,
  )
  const [editingCell, setEditingCell] = useState<TCell<TData> | null>(
    initialState.editingCell ?? null,
  )
  const [editingRow, setEditingRow] = useState<TRow<TData> | null>(
    initialState.editingRow ?? null,
  )
  const [globalFilterFn, setGlobalFilterFn] = useState<TFilterOption>(
    initialState.globalFilterFn ?? "fuzzy",
  )
  const [grouping, onGroupingChange] = useState<TGroupingState>(
    initialState.grouping ?? [],
  )
  const [hoveredColumn, setHoveredColumn] = useState<Partial<
    TColumn<TData>
  > | null>(initialState.hoveredColumn ?? null)
  const [hoveredRow, setHoveredRow] = useState<Partial<TRow<TData>> | null>(
    initialState.hoveredRow ?? null,
  )
  const [isFullScreen, setIsFullScreen] = useState<boolean>(
    initialState?.isFullScreen ?? false,
  )
  const [pagination, onPaginationChange] = useState<TPaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  )
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(
    initialState?.showAlertBanner ?? false,
  )
  const [showColumnFilters, setShowColumnFilters] = useState<boolean>(
    initialState?.showColumnFilters ?? false,
  )
  const [showGlobalFilter, setShowGlobalFilter] = useState<boolean>(
    initialState?.showGlobalFilter ?? false,
  )
  const [showToolbarDropZone, setShowToolbarDropZone] = useState<boolean>(
    initialState?.showToolbarDropZone ?? false,
  )

  definedTableOptions.state = {
    actionCell,
    columnFilterFns,
    columnOrder,
    columnSizingInfo,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    globalFilterFn,
    grouping,
    hoveredColumn,
    hoveredRow,
    isFullScreen,
    pagination,
    showAlertBanner,
    showColumnFilters,
    showGlobalFilter,
    showToolbarDropZone,
    ...definedTableOptions.state,
  }

  //The table options now include all state needed to help determine column visibility and order logic
  const statefulTableOptions =
    definedTableOptions as TStatefulTableOptions<TData>

  //don't recompute columnDefs while resizing column or dragging column/row
  const columnDefsRef = useRef<TColumnDef<TData>[]>([])
  statefulTableOptions.columns =
    statefulTableOptions.state.columnSizingInfo.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              showRowPinningColumn(statefulTableOptions) &&
                getRowPinningColumnDef(statefulTableOptions),
              showRowDragColumn(statefulTableOptions) &&
                getRowDragColumnDef(statefulTableOptions),
              showRowActionsColumn(statefulTableOptions) &&
                getRowActionsColumnDef(statefulTableOptions),
              showRowExpandColumn(statefulTableOptions) &&
                getRowExpandColumnDef(statefulTableOptions),
              showRowSelectionColumn(statefulTableOptions) &&
                getRowSelectColumnDef(statefulTableOptions),
              showRowNumbersColumn(statefulTableOptions) &&
                getRowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as TColumnDef<TData>[]),
            ...statefulTableOptions.columns,
            ...([
              showRowSpacerColumn(statefulTableOptions) &&
                getRowSpacerColumnDef(statefulTableOptions),
            ].filter(Boolean) as TColumnDef<TData>[]),
          ],
          tableOptions: statefulTableOptions,
        })
  columnDefsRef.current = statefulTableOptions.columns

  //if loading, generate blank rows to show skeleton loaders
  statefulTableOptions.data = useMemo(
    () =>
      (statefulTableOptions.state.isLoading ||
        statefulTableOptions.state.showSkeletons) &&
      !statefulTableOptions.data.length
        ? [
            ...Array(
              Math.min(statefulTableOptions.state.pagination.pageSize, 20),
            ).fill(null),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(statefulTableOptions.columns).map(
                (col) => ({
                  [getColumnId(col)]: null,
                }),
              ),
            ),
          )
        : statefulTableOptions.data,
    [
      statefulTableOptions.data,
      statefulTableOptions.state.isLoading,
      statefulTableOptions.state.showSkeletons,
    ],
  )

  //@ts-expect-error
  const table = useReactTable({
    onColumnOrderChange,
    onColumnSizingInfoChange,
    onGroupingChange,
    onPaginationChange,
    ...statefulTableOptions,
    globalFilterFn: statefulTableOptions.filterFns?.[globalFilterFn ?? "fuzzy"],
  }) as TTableInstance<TData>

  table.refs = {
    actionCellRef,
    bottomToolbarRef,
    editInputRefs,
    filterInputRefs,
    lastSelectedRowId,
    searchInputRef,
    tableContainerRef,
    tableFooterRef,
    tableHeadCellRefs,
    tableHeadRef,
    tableWrapperRef,
    topToolbarRef,
  }

  table.setActionCell = statefulTableOptions.onActionCellChange ?? setActionCell
  table.setCreatingRow = (row: TUpdater<TRow<TData> | null | true>) => {
    let _row = row
    if (row === true) {
      _row = createRow(table)
    }
    statefulTableOptions?.onCreatingRowChange?.(_row as TRow<TData> | null) ??
      _setCreatingRow(_row as TRow<TData> | null)
  }
  table.setColumnFilterFns =
    statefulTableOptions.onColumnFilterFnsChange ?? setColumnFilterFns
  table.setDensity = statefulTableOptions.onDensityChange ?? setDensity
  table.setDraggingColumn =
    statefulTableOptions.onDraggingColumnChange ?? setDraggingColumn
  table.setDraggingRow =
    statefulTableOptions.onDraggingRowChange ?? setDraggingRow
  table.setEditingCell =
    statefulTableOptions.onEditingCellChange ?? setEditingCell
  table.setEditingRow = statefulTableOptions.onEditingRowChange ?? setEditingRow
  table.setGlobalFilterFn =
    statefulTableOptions.onGlobalFilterFnChange ?? setGlobalFilterFn
  table.setHoveredColumn =
    statefulTableOptions.onHoveredColumnChange ?? setHoveredColumn
  table.setHoveredRow = statefulTableOptions.onHoveredRowChange ?? setHoveredRow
  table.setIsFullScreen =
    statefulTableOptions.onIsFullScreenChange ?? setIsFullScreen
  table.setShowAlertBanner =
    statefulTableOptions.onShowAlertBannerChange ?? setShowAlertBanner
  table.setShowColumnFilters =
    statefulTableOptions.onShowColumnFiltersChange ?? setShowColumnFilters
  table.setShowGlobalFilter =
    statefulTableOptions.onShowGlobalFilterChange ?? setShowGlobalFilter
  table.setShowToolbarDropZone =
    statefulTableOptions.onShowToolbarDropZoneChange ?? setShowToolbarDropZone

  useTableEffects(table)

  return table
}
