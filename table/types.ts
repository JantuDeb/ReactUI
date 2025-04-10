import {
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react"
import {
  aggregationFns,
  type AccessorFn,
  type AggregationFn,
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingInfoState,
  type ColumnSizingState,
  type DeepKeys,
  type DeepValue,
  type ExpandedState,
  type FilterFn,
  type GroupingState,
  type Header,
  type HeaderGroup,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingFn,
  type SortingState,
  type Table,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  type VirtualItem,
  type Virtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual"
import { sortingFns } from "./fns/sortingFns"
import { filterFns } from "./fns/filterFns"
import { Options } from "../types"
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>)

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown

export type Xor<A, B> =
  | Prettify<A & { [k in keyof B]?: never }>
  | Prettify<B & { [k in keyof A]?: never }>

export type TDensityState = "comfortable" | "compact" | "spacious"

export type TColumnFilterFnsState = Record<string, TFilterOption>

export type TRowData = Record<string, any>

export type TColumnFiltersState = ColumnFiltersState
export type TColumnOrderState = ColumnOrderState
export type TColumnPinningState = ColumnPinningState
export type TColumnSizingInfoState = ColumnSizingInfoState
export type TColumnSizingState = ColumnSizingState
export type TExpandedState = ExpandedState
export type TGroupingState = GroupingState
export type TPaginationState = PaginationState
export type TRowSelectionState = RowSelectionState
export type TSortingState = SortingState
export type TUpdater<T> = Updater<T>
export type TVirtualItem = VirtualItem
export type TVisibilityState = VisibilityState

export type TVirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>

export type TColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualColumns: TVirtualItem[]
  virtualPaddingLeft?: number
  virtualPaddingRight?: number
}

export type TRowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualRows: TVirtualItem[]
}

export type TColumnHelper<TData extends TRowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
      ? DeepValue<TData, TAccessor>
      : never,
  >(
    accessor: TAccessor,
    column: TDisplayColumnDef<TData, TValue>,
  ) => TColumnDef<TData, TValue>
  display: (column: TDisplayColumnDef<TData>) => TColumnDef<TData>
  group: (column: TGroupColumnDef<TData>) => TColumnDef<TData>
}

export interface TLocalization {
  actions: string
  and: string
  cancel: string
  changeFilterMode: string
  changeSearchMode: string
  clearFilter: string
  clearSearch: string
  clearSelection: string
  clearSort: string
  clickToCopy: string
  collapse: string
  collapseAll: string
  columnActions: string
  copiedToClipboard: string
  copy: string
  dropToGroupBy: string
  edit: string
  expand: string
  expandAll: string
  filterArrIncludes: string
  filterArrIncludesAll: string
  filterArrIncludesSome: string
  filterBetween: string
  filterBetweenInclusive: string
  filterByColumn: string
  filterContains: string
  filterEmpty: string
  filterEndsWith: string
  filterEquals: string
  filterEqualsString: string
  filterFuzzy: string
  filterGreaterThan: string
  filterGreaterThanOrEqualTo: string
  filterIncludesString: string
  filterIncludesStringSensitive: string
  filteringByColumn: string
  filterInNumberRange: string
  filterLessThan: string
  filterLessThanOrEqualTo: string
  filterMode: string
  filterNotEmpty: string
  filterNotEquals: string
  filterStartsWith: string
  filterWeakEquals: string
  goToFirstPage: string
  goToLastPage: string
  goToNextPage: string
  goToPreviousPage: string
  grab: string
  groupByColumn: string
  groupedBy: string
  hideAll: string
  hideColumn: string
  max: string
  min: string
  move: string
  noRecordsToDisplay: string
  noResultsFound: string
  of: string
  or: string
  pin: string
  pinToLeft: string
  pinToRight: string
  resetColumnSize: string
  resetOrder: string
  rowActions: string
  rowNumber: string
  rowNumbers: string
  rowsPerPage: string
  save: string
  search: string
  select: string
  selectedCountOfRowCountRowsSelected: string
  showAll: string
  showAllColumns: string
  showHideColumns: string
  showHideFilters: string
  showHideSearch: string
  sortByColumnAsc: string
  sortByColumnDesc: string
  sortedByColumnAsc: string
  sortedByColumnDesc: string
  thenBy: string
  toggleDensity: string
  toggleFullScreen: string
  toggleSelectAll: string
  toggleSelectRow: string
  toggleVisibility: string
  ungroupByColumn: string
  unpin: string
  unpinAll: string
}

export interface TRowModel<TData extends TRowData> {
  flatRows: TRow<TData>[]
  rows: TRow<TData>[]
  rowsById: { [key: string]: TRow<TData> }
}

export type TTableInstance<TData extends TRowData> = Omit<
  Table<TData>,
  | "getAllColumns"
  | "getAllFlatColumns"
  | "getAllLeafColumns"
  | "getBottomRows"
  | "getCenterLeafColumns"
  | "getCenterRows"
  | "getColumn"
  | "getExpandedRowModel"
  | "getFlatHeaders"
  | "getFooterGroups"
  | "getHeaderGroups"
  | "getLeafHeaders"
  | "getLeftLeafColumns"
  | "getPaginationRowModel"
  | "getPreFilteredRowModel"
  | "getPrePaginationRowModel"
  | "getRightLeafColumns"
  | "getRowModel"
  | "getSelectedRowModel"
  | "getState"
  | "getTopRows"
  | "options"
> & {
  getAllColumns: () => TColumn<TData>[]
  getAllFlatColumns: () => TColumn<TData>[]
  getAllLeafColumns: () => TColumn<TData>[]
  getBottomRows: () => TRow<TData>[]
  getCenterLeafColumns: () => TColumn<TData>[]
  getCenterRows: () => TRow<TData>[]
  getColumn: (columnId: string) => TColumn<TData>
  getExpandedRowModel: () => TRowModel<TData>
  getFlatHeaders: () => THeader<TData>[]
  getFooterGroups: () => THeaderGroup<TData>[]
  getHeaderGroups: () => THeaderGroup<TData>[]
  getLeafHeaders: () => THeader<TData>[]
  getLeftLeafColumns: () => TColumn<TData>[]
  getPaginationRowModel: () => TRowModel<TData>
  getPreFilteredRowModel: () => TRowModel<TData>
  getPrePaginationRowModel: () => TRowModel<TData>
  getRightLeafColumns: () => TColumn<TData>[]
  getRowModel: () => TRowModel<TData>
  getSelectedRowModel: () => TRowModel<TData>
  getState: () => TTableState<TData>
  getTopRows: () => TRow<TData>[]
  options: TStatefulTableOptions<TData>
  refs: {
    actionCellRef: RefObject<HTMLTableCellElement | null>
    bottomToolbarRef: RefObject<HTMLDivElement | null>
    editInputRefs: RefObject<Record<string, HTMLInputElement>>
    filterInputRefs: RefObject<Record<string, HTMLInputElement>>
    lastSelectedRowId: RefObject<null | string | null>
    searchInputRef: RefObject<HTMLInputElement | null>
    tableContainerRef: RefObject<HTMLDivElement | null>
    tableFooterRef: RefObject<HTMLTableSectionElement | null>
    tableHeadCellRefs: RefObject<Record<string, HTMLTableCellElement>>
    tableHeadRef: RefObject<HTMLTableSectionElement | null>
    tableWrapperRef: RefObject<HTMLDivElement | null>
    topToolbarRef: RefObject<HTMLDivElement | null>
  }
  setActionCell: Dispatch<SetStateAction<TCell<TData> | null>>
  setColumnFilterFns: Dispatch<SetStateAction<TColumnFilterFnsState>>
  setCreatingRow: Dispatch<SetStateAction<TRow<TData> | null | true>>
  setDensity: Dispatch<SetStateAction<TDensityState>>
  setDraggingColumn: Dispatch<SetStateAction<TColumn<TData> | null>>
  setDraggingRow: Dispatch<SetStateAction<TRow<TData> | null>>
  setEditingCell: Dispatch<SetStateAction<TCell<TData> | null>>
  setEditingRow: Dispatch<SetStateAction<TRow<TData> | null>>
  setGlobalFilterFn: Dispatch<SetStateAction<TFilterOption>>
  setHoveredColumn: Dispatch<SetStateAction<Partial<TColumn<TData>> | null>>
  setHoveredRow: Dispatch<SetStateAction<Partial<TRow<TData>> | null>>
  setIsFullScreen: Dispatch<SetStateAction<boolean>>
  setShowAlertBanner: Dispatch<SetStateAction<boolean>>
  setShowColumnFilters: Dispatch<SetStateAction<boolean>>
  setShowGlobalFilter: Dispatch<SetStateAction<boolean>>
  setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>
}

export type TDefinedTableOptions<TData extends TRowData> = Omit<
  TTableOptions<TData>,
  "localization" | "theme"
> & {
  //   icons: TIcons
  localization: TLocalization
  theme: Required<TTheme>
}

export type TStatefulTableOptions<TData extends TRowData> =
  TDefinedTableOptions<TData> & {
    state: Pick<
      TTableState<TData>,
      | "columnFilterFns"
      | "columnOrder"
      | "columnSizingInfo"
      | "creatingRow"
      | "density"
      | "draggingColumn"
      | "draggingRow"
      | "editingCell"
      | "editingRow"
      | "globalFilterFn"
      | "grouping"
      | "hoveredColumn"
      | "hoveredRow"
      | "isFullScreen"
      | "pagination"
      | "showAlertBanner"
      | "showColumnFilters"
      | "showGlobalFilter"
      | "showToolbarDropZone"
    >
  }

export interface TTableState<TData extends TRowData> extends TableState {
  actionCell?: TCell<TData> | null
  columnFilterFns: TColumnFilterFnsState
  creatingRow: TRow<TData> | null
  density: TDensityState
  draggingColumn: TColumn<TData> | null
  draggingRow: TRow<TData> | null
  editingCell: TCell<TData> | null
  editingRow: TRow<TData> | null
  globalFilterFn: TFilterOption
  hoveredColumn: Partial<TColumn<TData>> | null
  hoveredRow: Partial<TRow<TData>> | null
  isFullScreen: boolean
  isLoading: boolean
  isSaving: boolean
  showAlertBanner: boolean
  showColumnFilters: boolean
  showGlobalFilter: boolean
  showLoadingOverlay: boolean
  showProgressBars: boolean
  showSkeletons: boolean
  showToolbarDropZone: boolean
}

export type PaginationProps = {
  rowCount?: number
  onPageChange?: (pageIndex: number) => void
} & PaginationState

export interface TColumnDef<TData extends TRowData, TValue = unknown>
  extends Omit<
    ColumnDef<TData, TValue>,
    | "accessorKey"
    | "aggregatedCell"
    | "aggregationFn"
    | "cell"
    | "columns"
    | "filterFn"
    | "footer"
    | "header"
    | "id"
    | "sortingFn"
  > {
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify a function here to point to the correct property in the data object.
   *
   * @example accessorFn: (row) => row.username
   */
  accessorFn?: (originalRow: TData) => TValue
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify which key in the row this column should use to access the correct data.
   * Also supports Deep Key Dot Notation.
   *
   * @example accessorKey: 'username' //simple
   * @example accessorKey: 'name.firstName' //deep key dot notation
   */
  accessorKey?: DeepKeys<TData> | (string & {})
  AggregatedCell?: (props: {
    cell: TCell<TData, TValue>
    column: TColumn<TData, TValue>
    row: TRow<TData>
    table: TTableInstance<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
  }) => ReactNode
  aggregationFn?: Array<TAggregationFn<TData>> | TAggregationFn<TData>
  Cell?: (props: {
    cell: TCell<TData, TValue>
    column: TColumn<TData, TValue>
    renderedCellValue: ReactNode
    row: TRow<TData>
    rowRef?: RefObject<HTMLTableRowElement | null>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: TTableInstance<TData>
  }) => ReactNode
  /**
   * Specify what type of column this is. Either `data`, `display`, or `group`. Defaults to `data`.
   * Leave this blank if you are just creating a normal data column.
   *
   * @default 'data'
   *
   * @example columnDefType: 'display'
   */
  columnDefType?: "data" | "display" | "group"
  columnFilterModeOptions?: Array<LiteralUnion<string & TFilterOption>> | null
  columns?: TColumnDef<TData, TValue>[]
  Edit?: (props: {
    cell: TCell<TData, TValue>
    column: TColumn<TData, TValue>
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => ReactNode
  //TODO: implement
  //   editSelectOptions?:
  //     | ((props: {
  //         cell: TCell<TData, TValue>
  //         column: TColumn<TData>
  //         row: TRow<TData>
  //         table: TTableInstance<TData>
  //       }) => DropdownOption[])
  //     | DropdownOption[]
  editVariant?: "select" | "text"
  enableClickToCopy?:
    | "context-menu"
    | ((cell: TCell<TData>) => "context-menu" | boolean)
    | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableEditing?: ((row: TRow<TData>) => boolean) | boolean
  enableFilterMatchHighlighting?: boolean
  Filter?: (props: {
    column: TColumn<TData, TValue>
    header: THeader<TData>
    rangeFilterIndex?: number
    table: TTableInstance<TData>
  }) => ReactNode
  filterFn?: TFilterFn<TData>
  //TODO:implement
  filterSelectOptions?: Options
  filterVariant?:
    | "autocomplete"
    | "checkbox"
    | "date"
    | "date-range"
    | "datetime"
    | "datetime-range"
    | "multi-select"
    | "range"
    | "range-slider"
    | "select"
    | "text"
    | "time"
    | "time-range"
  /**
   * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
   */
  footer?: string
  Footer?:
    | ((props: {
        column: TColumn<TData, TValue>
        footer: THeader<TData>
        table: TTableInstance<TData>
      }) => ReactNode)
    | ReactNode
  GroupedCell?: (props: {
    cell: TCell<TData, TValue>
    column: TColumn<TData, TValue>
    row: TRow<TData>
    table: TTableInstance<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
  }) => ReactNode
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, you can specify the flex grow value for individual columns to still grow and take up remaining space, or set to `false`/0 to not grow.
   */
  grow?: boolean | number
  /**
   * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
   */
  header: string
  Header?:
    | ((props: {
        column: TColumn<TData, TValue>
        header: THeader<TData>
        table: TTableInstance<TData>
      }) => ReactNode)
    | ReactNode
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   *
   * If you have also specified an `accessorFn`, MRT still needs to have a valid `id` to be able to identify the column uniquely.
   *
   * `id` defaults to the `accessorKey` or `header` if not specified.
   *
   * @default gets set to the same value as `accessorKey` by default
   */
  id?: LiteralUnion<string & keyof TData>

  PlaceholderCell?: (props: {
    cell: TCell<TData, TValue>
    column: TColumn<TData, TValue>
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => ReactNode
  renderCellActionMenuItems?: (props: {
    cell: TCell<TData>
    closeMenu: () => void
    column: TColumn<TData>
    internalMenuItems: ReactNode[]
    row: TRow<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: TTableInstance<TData>
  }) => ReactNode[]
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void
    column: TColumn<TData>
    internalColumnMenuItems: ReactNode[]
    table: TTableInstance<TData>
  }) => ReactNode[]
  renderColumnFilterModeMenuItems?: (props: {
    column: TColumn<TData>
    internalFilterOptions: TInternalFilterOption[]
    onSelectFilterMode: (filterMode: TFilterOption) => void
    table: TTableInstance<TData>
  }) => ReactNode[]
  sortingFn?: TSortingFn<TData>
  visibleInShowHideMenu?: boolean
}

export type TDisplayColumnDef<TData extends TRowData, TValue = unknown> = Omit<
  TColumnDef<TData, TValue>,
  "accessorFn" | "accessorKey"
>

export type TGroupColumnDef<TData extends TRowData> = TDisplayColumnDef<
  TData,
  any
> & {
  columns: TColumnDef<TData>[]
}

export type TDefinedColumnDef<TData extends TRowData, TValue = unknown> = Omit<
  TColumnDef<TData, TValue>,
  "defaultDisplayColumn" | "id"
> & {
  _filterFn: TFilterOption
  defaultDisplayColumn: Partial<TColumnDef<TData, TValue>>
  id: string
}

export type TColumn<TData extends TRowData, TValue = unknown> = Omit<
  Column<TData, TValue>,
  "columnDef" | "columns" | "filterFn" | "footer" | "header"
> & {
  columnDef: TDefinedColumnDef<TData, TValue>
  columns?: TColumn<TData, TValue>[]
  filterFn?: TFilterFn<TData>
  footer: string
  header: string
}

export type THeader<TData extends TRowData> = Omit<
  Header<TData, unknown>,
  "column"
> & {
  column: TColumn<TData>
}

export type THeaderGroup<TData extends TRowData> = Omit<
  HeaderGroup<TData>,
  "headers"
> & {
  headers: THeader<TData>[]
}

export type TRow<TData extends TRowData> = Omit<
  Row<TData>,
  | "_valuesCache"
  | "getAllCells"
  | "getParentRow"
  | "getParentRows"
  | "getRow"
  | "getVisibleCells"
  | "subRows"
> & {
  _valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  getAllCells: () => TCell<TData>[]
  getParentRow: () => TRow<TData> | null
  getParentRows: () => TRow<TData>[]
  getRow: () => TRow<TData>
  getVisibleCells: () => TCell<TData>[]
  subRows?: TRow<TData>[]
}

export type TCell<TData extends TRowData, TValue = unknown> = Omit<
  Cell<TData, TValue>,
  "column" | "row"
> & {
  column: TColumn<TData, TValue>
  row: TRow<TData>
}

export type TAggregationOption = string & keyof typeof aggregationFns

export type TAggregationFn<TData extends TRowData> =
  | AggregationFn<TData>
  | TAggregationOption

export type TSortingOption = LiteralUnion<string & keyof typeof sortingFns>

export type TSortingFn<TData extends TRowData> =
  | TSortingOption
  | SortingFn<TData>

export type TFilterOption = LiteralUnion<string & keyof typeof filterFns>

export type TFilterFn<TData extends TRowData> = FilterFn<TData> | TFilterOption

export type TInternalFilterOption = {
  divider: boolean
  label: string
  option: string
  symbol: string
}

export type TDisplayColumnIds =
  | "row-actions"
  | "row-drag"
  | "row-expand"
  | "row-numbers"
  | "row-pin"
  | "row-select"
  | "row-spacer"

export type TTheme = {
  td: string
  tdSelectedBackground: string
  tdBackground: string
  tdSpacing: string
  tHead: string
  tHeadSticky: string
  table: string
  cellNavigationOutlineColor: string
  draggingBorderColor: string
  matchHighlightColor: string
  menuBackgroundColor: string
  pinnedRowBackgroundColor: string
  selectedRowBackgroundColor: string
}

export interface TTableOptions<TData extends TRowData>
  extends Omit<
    Partial<TableOptions<TData>>,
    | "columns"
    | "data"
    | "defaultColumn"
    | "enableRowSelection"
    | "expandRowsFn"
    | "getRowId"
    | "globalFilterFn"
    | "initialState"
    | "onStateChange"
    | "state"
  > {
  columnFilterDisplayMode?: "custom" | "popover" | "subheader"
  columnFilterModeOptions?: Array<LiteralUnion<string & TFilterOption>> | null

  columns: TColumnDef<TData, any>[]
  columnVirtualizerInstanceRef?: RefObject<TColumnVirtualizer | null>
  columnVirtualizerOptions?:
    | ((props: {
        table: TTableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>
  createDisplayMode?: "custom" | "modal" | "row"
  data: TData[]

  defaultColumn?: Partial<TColumnDef<TData>>
  defaultDisplayColumn?: Partial<TDisplayColumnDef<TData>>
  displayColumnDefOptions?: Partial<{
    [key in TDisplayColumnIds]: Partial<TDisplayColumnDef<TData>>
  }>
  editDisplayMode?: "cell" | "custom" | "modal" | "row" | "table"
  enableBatchRowSelection?: boolean
  enableBottomToolbar?: boolean
  enableCellActions?: ((cell: TCell<TData>) => boolean) | boolean
  enableClickToCopy?:
    | "context-menu"
    | ((cell: TCell<TData>) => "context-menu" | boolean)
    | boolean
  enableColumnActions?: boolean
  enableColumnDragging?: boolean
  enableColumnFilterModes?: boolean
  enableColumnOrdering?: boolean
  enableColumnVirtualization?: boolean
  enableDensityToggle?: boolean
  enableEditing?: ((row: TRow<TData>) => boolean) | boolean
  enableExpandAll?: boolean
  enableFacetedValues?: boolean
  enableFilterMatchHighlighting?: boolean
  enableFullScreenToggle?: boolean
  enableGlobalFilterModes?: boolean
  enableGlobalFilterRankedResults?: boolean
  enableKeyboardShortcuts?: boolean
  enablePagination?: boolean
  enableRowActions?: boolean
  enableRowDragging?: boolean
  enableRowNumbers?: boolean
  enableRowOrdering?: boolean
  enableRowSelection?: ((row: TRow<TData>) => boolean) | boolean
  enableRowVirtualization?: boolean
  enableSelectAll?: boolean
  enableStickyFooter?: boolean
  enableStickyHeader?: boolean
  enableTableFooter?: boolean
  enableTableHead?: boolean
  enableToolbarInternalActions?: boolean
  enableTopToolbar?: boolean
  expandRowsFn?: (dataRow: TData) => TData[]
  getRowId?: (
    originalRow: TData,
    index: number,
    parentRow: TRow<TData>,
  ) => string
  globalFilterFn?: TFilterOption
  globalFilterModeOptions?: TFilterOption[] | null
  id?: string
  initialState?: Partial<TTableState<TData>>
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: "grid" | "grid-no-grow" | "semantic"
  /**
   * Pass in either a locale imported from `material-react-table/locales/*` or a custom locale object.
   *
   * See the localization (i18n) guide for more info:
   * @link https://www.material-react-table.com/docs/guides/localization
   */
  localization?: Partial<TLocalization>
  /**
   * Memoize cells, rows, or the entire table body to potentially improve render performance.
   *
   * @warning This will break some dynamic rendering features. See the memoization guide for more info:
   * @link https://www.material-react-table.com/docs/guides/memoize-components
   */
  memoMode?: "cells" | "rows" | "table-body"

  theme?: ((theme: TTheme) => Partial<TTheme>) | Partial<TTheme>

  paginationProps?: // | ((props: { table: TTableInstance<TData> }) => Partial<
  //     PaginationProps & {
  //       SelectProps?: Partial<SelectProps>
  //       disabled?: boolean
  //       rowsPerPageOptions?: { label: string; value: number }[] | number[]
  //       showRowsPerPage?: boolean
  //     }
  //   >)
  // |
  Partial<
    PaginationProps & {
      // SelectProps?: Partial<SelectProps>
      disabled?: boolean
      rowsPerPageOptions?: { label: string; value: number }[] | number[]
      showRowsPerPage?: boolean
    }
  >
  /*   muiBottomToolbarProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => BoxProps)
  | BoxProps;
muiCircularProgressProps?:
  | ((props: {
      table: MRT_TableInstance<TData>;
    }) => CircularProgressProps & { Component?: ReactNode })
  | (CircularProgressProps & { Component?: ReactNode });
muiColumnActionsButtonProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => IconButtonProps)
  | IconButtonProps;
muiColumnDragHandleProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => IconButtonProps)
  | IconButtonProps;
muiCopyButtonProps?:
  | ((props: {
      cell: MRT_Cell<TData>;
      column: MRT_Column<TData>;
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => ButtonProps)
  | ButtonProps;
muiCreateRowModalProps?:
  | ((props: {
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => DialogProps)
  | DialogProps;
muiDetailPanelProps?:
  | ((props: {
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => TableCellProps)
  | TableCellProps;
muiEditRowDialogProps?:
  | ((props: {
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => DialogProps)
  | DialogProps;
muiEditTextFieldProps?:
  | ((props: {
      cell: MRT_Cell<TData>;
      column: MRT_Column<TData>;
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => TextFieldProps)
  | TextFieldProps;
muiExpandAllButtonProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => IconButtonProps)
  | IconButtonProps;
muiExpandButtonProps?:
  | ((props: {
      row: MRT_Row<TData>;
      staticRowIndex?: number;
      table: MRT_TableInstance<TData>;
    }) => IconButtonProps)
  | IconButtonProps;
muiFilterAutocompleteProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => AutocompleteProps<any, any, any, any>)
  | AutocompleteProps<any, any, any, any>;
muiFilterCheckboxProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => CheckboxProps)
  | CheckboxProps;
muiFilterDatePickerProps?:
  | ((props: {
      column: MRT_Column<TData>;
      rangeFilterIndex?: number;
      table: MRT_TableInstance<TData>;
    }) => DatePickerProps<never>)
  | DatePickerProps<never>;
muiFilterDateTimePickerProps?:
  | ((props: {
      column: MRT_Column<TData>;
      rangeFilterIndex?: number;
      table: MRT_TableInstance<TData>;
    }) => DateTimePickerProps<never>)
  | DateTimePickerProps<never>;
muiFilterSliderProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => SliderProps)
  | SliderProps;
muiFilterTextFieldProps?:
  | ((props: {
      column: MRT_Column<TData>;
      rangeFilterIndex?: number;
      table: MRT_TableInstance<TData>;
    }) => TextFieldProps)
  | TextFieldProps;
muiFilterTimePickerProps?:
  | ((props: {
      column: MRT_Column<TData>;
      rangeFilterIndex?: number;
      table: MRT_TableInstance<TData>;
    }) => TimePickerProps<never>)
  | TimePickerProps<never>;
muiLinearProgressProps?:
  | ((props: {
      isTopToolbar: boolean;
      table: MRT_TableInstance<TData>;
    }) => LinearProgressProps)
  | LinearProgressProps;

muiRowDragHandleProps?:
  | ((props: {
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => IconButtonProps)
  | IconButtonProps;
muiSearchTextFieldProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => TextFieldProps)
  | TextFieldProps;
muiSelectAllCheckboxProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => CheckboxProps)
  | CheckboxProps;
muiSelectCheckboxProps?:
  | ((props: {
      row: MRT_Row<TData>;
      staticRowIndex?: number;
      table: MRT_TableInstance<TData>;
    }) => CheckboxProps | RadioProps)
  | (CheckboxProps | RadioProps);
muiSkeletonProps?:
  | ((props: {
      cell: MRT_Cell<TData>;
      column: MRT_Column<TData>;
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => SkeletonProps)
  | SkeletonProps;
muiTableBodyCellProps?:
  | ((props: {
      cell: MRT_Cell<TData>;
      column: MRT_Column<TData>;
      row: MRT_Row<TData>;
      table: MRT_TableInstance<TData>;
    }) => TableCellProps)
  | TableCellProps;
muiTableBodyProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => TableBodyProps)
  | TableBodyProps;
muiTableBodyRowProps?:
  | ((props: {
      isDetailPanel?: boolean;
      row: MRT_Row<TData>;
      staticRowIndex: number;
      table: MRT_TableInstance<TData>;
    }) => TableRowProps)
  | TableRowProps;
muiTableContainerProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => TableContainerProps)
  | TableContainerProps;
muiTableFooterCellProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => TableCellProps)
  | TableCellProps;
muiTableFooterProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => TableFooterProps)
  | TableFooterProps;
muiTableFooterRowProps?:
  | ((props: {
      footerGroup: MRT_HeaderGroup<TData>;
      table: MRT_TableInstance<TData>;
    }) => TableRowProps)
  | TableRowProps;
muiTableHeadCellProps?:
  | ((props: {
      column: MRT_Column<TData>;
      table: MRT_TableInstance<TData>;
    }) => TableCellProps)
  | TableCellProps;
muiTableHeadProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => TableHeadProps)
  | TableHeadProps;
muiTableHeadRowProps?:
  | ((props: {
      headerGroup: MRT_HeaderGroup<TData>;
      table: MRT_TableInstance<TData>;
    }) => TableRowProps)
  | TableRowProps;
muiTablePaperProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => PaperProps)
  | PaperProps;
muiTableProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => TableProps)
  | TableProps;
muiToolbarAlertBannerChipProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => ChipProps)
  | ChipProps;
muiToolbarAlertBannerProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => AlertProps)
  | AlertProps;
muiTopToolbarProps?:
  | ((props: { table: MRT_TableInstance<TData> }) => BoxProps)
  | BoxProps;
 */
  onActionCellChange?: OnChangeFn<TCell<TData> | null>
  onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: TFilterOption }>
  onCreatingRowCancel?: (props: {
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => void
  onCreatingRowChange?: OnChangeFn<TRow<TData> | null>
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void
    row: TRow<TData>
    table: TTableInstance<TData>
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  }) => Promise<void> | void
  onDensityChange?: OnChangeFn<TDensityState>
  onDraggingColumnChange?: OnChangeFn<TColumn<TData> | null>
  onDraggingRowChange?: OnChangeFn<TRow<TData> | null>
  onEditingCellChange?: OnChangeFn<TCell<TData> | null>
  onEditingRowCancel?: (props: {
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => void
  onEditingRowChange?: OnChangeFn<TRow<TData> | null>
  onEditingRowSave?: (props: {
    exitEditingMode: () => void
    row: TRow<TData>
    table: TTableInstance<TData>
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
  }) => Promise<void> | void
  onGlobalFilterFnChange?: OnChangeFn<TFilterOption>
  onHoveredColumnChange?: OnChangeFn<Partial<TColumn<TData>> | null>
  onHoveredRowChange?: OnChangeFn<Partial<TRow<TData>> | null>
  onIsFullScreenChange?: OnChangeFn<boolean>
  onShowAlertBannerChange?: OnChangeFn<boolean>
  onShowColumnFiltersChange?: OnChangeFn<boolean>
  onShowGlobalFilterChange?: OnChangeFn<boolean>
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>
  paginationDisplayMode?: "custom" | "default" | "pages"
  positionActionsColumn?: "first" | "last"
  positionCreatingRow?: "bottom" | "top" | number
  positionExpandColumn?: "first" | "last"
  positionGlobalFilter?: "left" | "none" | "right"
  positionPagination?: "both" | "bottom" | "none" | "top"
  positionToolbarAlertBanner?: "bottom" | "head-overlay" | "none" | "top"
  positionToolbarDropZone?: "both" | "bottom" | "none" | "top"
  renderBottomToolbar?:
    | ((props: { table: TTableInstance<TData> }) => ReactNode)
    | ReactNode
  renderBottomToolbarCustomActions?: (props: {
    table: TTableInstance<TData>
  }) => ReactNode
  renderCaption?:
    | ((props: { table: TTableInstance<TData> }) => ReactNode)
    | ReactNode
  renderCellActionMenuItems?: (props: {
    cell: TCell<TData>
    closeMenu: () => void
    column: TColumn<TData>
    internalMenuItems: ReactNode[]
    row: TRow<TData>
    staticColumnIndex?: number
    staticRowIndex?: number
    table: TTableInstance<TData>
  }) => ReactNode[]
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void
    column: TColumn<TData>
    internalColumnMenuItems: ReactNode[]
    table: TTableInstance<TData>
  }) => ReactNode[]
  renderColumnFilterModeMenuItems?: (props: {
    column: TColumn<TData>
    internalFilterOptions: TInternalFilterOption[]
    onSelectFilterMode: (filterMode: TFilterOption) => void
    table: TTableInstance<TData>
  }) => ReactNode[]
  renderCreateRowDialogContent?: (props: {
    internalEditComponents: ReactNode[]
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => ReactNode
  renderDetailPanel?: (props: {
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => ReactNode
  renderEditRowDialogContent?: (props: {
    internalEditComponents: ReactNode[]
    row: TRow<TData>
    table: TTableInstance<TData>
  }) => ReactNode
  renderEmptyRowsFallback?: (props: {
    table: TTableInstance<TData>
  }) => ReactNode
  renderGlobalFilterModeMenuItems?: (props: {
    internalFilterOptions: TInternalFilterOption[]
    onSelectFilterMode: (filterMode: TFilterOption) => void
    table: TTableInstance<TData>
  }) => ReactNode[]

  onRowActionClick?: (row: TRowData, key: string) => void
  rowActions?: {
    getOptions?: (row: TRowData) => Options
    actions?: Options
  }
  //   renderRowActionMenuItems?: (props: {
  //     closeMenu: () => void
  //     row: TRow<TData>
  //     staticRowIndex?: number
  //     table: TTableInstance<TData>
  //   }) => ReactNode[] | undefined
  //   renderRowActions?: (props: {
  //     cell: TCell<TData>
  //     row: TRow<TData>
  //     staticRowIndex?: number
  //     table: TTableInstance<TData>
  //   }) => ReactNode
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: ReactNode | null
    selectedAlert: ReactNode | null
    table: TTableInstance<TData>
  }) => ReactNode
  renderToolbarInternalActions?: (props: {
    table: TTableInstance<TData>
  }) => ReactNode
  renderTopToolbar?:
    | ((props: { table: TTableInstance<TData> }) => ReactNode)
    | ReactNode
  renderTopToolbarCustomActions?: (props: {
    table: TTableInstance<TData>
  }) => ReactNode
  rowNumberDisplayMode?: "original" | "static"
  rowPinningDisplayMode?:
    | "bottom"
    | "select-bottom"
    | "select-sticky"
    | "select-top"
    | "sticky"
    | "top"
    | "top-and-bottom"
  rowVirtualizerInstanceRef?: RefObject<TRowVirtualizer | null>
  rowVirtualizerOptions?:
    | ((props: {
        table: TTableInstance<TData>
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>
  selectAllMode?: "all" | "page"
  /**
   * Manage state externally any way you want, then pass it back into MRT.
   */
  state?: Partial<TTableState<TData>>
}
