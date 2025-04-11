import {
  type TDefinedTableOptions,
  type TDisplayColumnIds,
  type TLocalization,
  type TRowData,
  type TStatefulTableOptions,
} from "../types"
import { getAllLeafColumnDefs, getColumnId } from "./column.utils"

export function defaultDisplayColumnProps<TData extends TRowData>({
  header,
  id,
  size,
  tableOptions,
}: {
  header?: keyof TLocalization
  id: TDisplayColumnIds
  size: number
  tableOptions: TDefinedTableOptions<TData>
}) {
  const { defaultDisplayColumn, displayColumnDefOptions, localization } =
    tableOptions
  return {
    ...defaultDisplayColumn,
    header: header ? localization?.[header]! : "",
    size,
    ...displayColumnDefOptions?.[id],
    id,
  } as const
}

export const showRowPinningColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => {
  const { enableRowPinning, rowPinningDisplayMode } = tableOptions
  return !!(enableRowPinning && !rowPinningDisplayMode?.startsWith("select"))
}

export const showRowDragColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => {
  const { enableRowDragging, enableRowOrdering } = tableOptions
  return !!(enableRowDragging || enableRowOrdering)
}

export const showRowExpandColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => {
  const {
    enableExpanding,
    enableGrouping,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions
  return !!(
    enableExpanding ||
    (enableGrouping && grouping?.length) ||
    renderDetailPanel
  )
}

export const showRowActionsColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => {
  const {
    createDisplayMode,
    editDisplayMode,
    enableEditing,
    enableRowActions,
    state: { creatingRow },
  } = tableOptions
  return !!(
    enableRowActions ||
    (creatingRow && createDisplayMode === "row") ||
    (enableEditing && ["modal", "row"].includes(editDisplayMode ?? ""))
  )
}

export const showRowSelectionColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowSelection

export const showRowNumbersColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowNumbers

export const showRowSpacerColumn = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): boolean => tableOptions.layoutMode === "grid-no-grow"

export const getLeadingDisplayColumnIds = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
) =>
  [
    showRowPinningColumn(tableOptions) && "row-pin",
    showRowDragColumn(tableOptions) && "row-drag",
    tableOptions.positionActionsColumn === "first" &&
      showRowActionsColumn(tableOptions) &&
      "row-actions",
    tableOptions.positionExpandColumn === "first" &&
      showRowExpandColumn(tableOptions) &&
      "row-expand",
    showRowSelectionColumn(tableOptions) && "row-select",
    showRowNumbersColumn(tableOptions) && "row-numbers",
  ].filter(Boolean) as TDisplayColumnIds[]

export const getTrailingDisplayColumnIds = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
) =>
  [
    tableOptions.positionActionsColumn === "last" &&
      showRowActionsColumn(tableOptions) &&
      "row-actions",
    tableOptions.positionExpandColumn === "last" &&
      showRowExpandColumn(tableOptions) &&
      "row-expand",
    showRowSpacerColumn(tableOptions) && "row-spacer",
  ].filter(Boolean) as TDisplayColumnIds[]

export const getDefaultColumnOrderIds = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
  reset = false,
) => {
  const {
    state: { columnOrder: currentColumnOrderIds = [] },
  } = tableOptions

  const leadingDisplayColIds: string[] =
    getLeadingDisplayColumnIds(tableOptions)
  const trailingDisplayColIds: string[] =
    getTrailingDisplayColumnIds(tableOptions)

  const defaultColumnDefIds = getAllLeafColumnDefs(tableOptions.columns).map(
    (columnDef) => getColumnId(columnDef),
  )

  let allLeafColumnDefIds = reset
    ? defaultColumnDefIds
    : Array.from(new Set([...currentColumnOrderIds, ...defaultColumnDefIds]))

  allLeafColumnDefIds = allLeafColumnDefIds.filter(
    (colId) =>
      !leadingDisplayColIds.includes(colId) &&
      !trailingDisplayColIds.includes(colId),
  )

  return [
    ...leadingDisplayColIds,
    ...allLeafColumnDefIds,
    ...trailingDisplayColIds,
  ]
}
