import { useMemo } from "react"
import { type Row } from "@tanstack/react-table"
import {
  type TColumn,
  type TColumnDef,
  type TColumnOrderState,
  type TDefinedColumnDef,
  type TDefinedTableOptions,
  type TFilterOption,
  type THeader,
  type TRowData,
  type TTableInstance,
} from "../types"
import { Option, Options } from "../../types"

export const getColumnId = <TData extends TRowData>(
  columnDef: TColumnDef<TData>,
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header

export const getAllLeafColumnDefs = <TData extends TRowData>(
  columns: TColumnDef<TData>[],
): TColumnDef<TData>[] => {
  const allLeafColumnDefs: TColumnDef<TData>[] = []
  const getLeafColumns = (cols: TColumnDef<TData>[]) => {
    cols.forEach((col) => {
      if (col.columns) {
        getLeafColumns(col.columns)
      } else {
        allLeafColumnDefs.push(col)
      }
    })
  }
  getLeafColumns(columns)
  return allLeafColumnDefs
}

export const prepareColumns = <TData extends TRowData>({
  columnDefs,
  tableOptions,
}: {
  columnDefs: TColumnDef<TData>[]
  tableOptions: TDefinedTableOptions<TData>
}): TDefinedColumnDef<TData>[] => {
  const {
    aggregationFns = {},
    defaultDisplayColumn,
    filterFns = {},
    sortingFns = {},
    state: { columnFilterFns = {} } = {},
  } = tableOptions
  return columnDefs.map((columnDef) => {
    //assign columnId
    if (!columnDef.id) columnDef.id = getColumnId(columnDef)
    //assign columnDefType
    if (!columnDef.columnDefType) columnDef.columnDefType = "data"
    if (columnDef.columns?.length) {
      columnDef.columnDefType = "group"
      //recursively prepare columns if this is a group column
      columnDef.columns = prepareColumns({
        columnDefs: columnDef.columns,
        tableOptions,
      })
    } else if (columnDef.columnDefType === "data") {
      //assign aggregationFns if multiple aggregationFns are provided
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as string[]
        columnDef.aggregationFn = (
          columnId: string,
          leafRows: Row<TData>[],
          childRows: Row<TData>[],
        ) =>
          aggFns.map((fn) =>
            aggregationFns[fn]?.(columnId, leafRows, childRows),
          )
      }

      //assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
        columnDef.filterFn =
          filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy
        ;(columnDef as TDefinedColumnDef<TData>)._filterFn =
          columnFilterFns[columnDef.id]
      }

      //assign sortingFns
      if (Object.keys(sortingFns).includes(columnDef.sortingFn as string)) {
        // @ts-expect-error
        columnDef.sortingFn = sortingFns[columnDef.sortingFn]
      }
    } else if (columnDef.columnDefType === "display") {
      columnDef = {
        ...(defaultDisplayColumn as TColumnDef<TData>),
        ...columnDef,
      }
    }
    return columnDef
  }) as TDefinedColumnDef<TData>[]
}

export const reorderColumn = <TData extends TRowData>(
  draggedColumn: TColumn<TData>,
  targetColumn: TColumn<TData>,
  columnOrder: TColumnOrderState,
): TColumnOrderState => {
  if (draggedColumn.getCanPin()) {
    draggedColumn.pin(targetColumn.getIsPinned())
  }
  const newColumnOrder = [...columnOrder]
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumn.id),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0],
  )
  return newColumnOrder
}

export const getDefaultColumnFilterFn = <TData extends TRowData>(
  columnDef: TColumnDef<TData>,
): TFilterOption => {
  const { filterVariant } = columnDef
  if (filterVariant === "multi-select") return "arrIncludesSome"
  if (filterVariant?.includes("range")) return "betweenInclusive"
  if (filterVariant === "select" || filterVariant === "checkbox")
    return "equals"
  return "fuzzy"
}

export const getColumnFilterInfo = <TData extends TRowData>({
  header,
  table,
}: {
  header: THeader<TData>
  table: TTableInstance<TData>
}) => {
  const {
    options: { columnFilterModeOptions },
  } = table
  const { column } = header
  const { columnDef } = column
  const { filterVariant } = columnDef

  const isDateFilter = !!(
    filterVariant?.startsWith("date") || filterVariant?.startsWith("time")
  )
  const isAutocompleteFilter = filterVariant === "autocomplete"
  const isRangeFilter =
    filterVariant?.includes("range") ||
    ["between", "betweenInclusive", "inNumberRange"].includes(
      columnDef._filterFn,
    )
  const isSelectFilter = filterVariant === "select"
  const isMultiSelectFilter = filterVariant === "multi-select"
  const isTextboxFilter =
    ["autocomplete", "text"].includes(filterVariant!) ||
    (!isSelectFilter && !isMultiSelectFilter)
  const currentFilterOption = columnDef._filterFn

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions

  const facetedUniqueValues = column.getFacetedUniqueValues()

  return {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
    isTextboxFilter,
  } as const
}

export const useOptions = <TData extends TRowData>({
  header,
  table,
}: {
  header: THeader<TData>
  table: TTableInstance<TData>
}): Options | undefined => {
  const { column } = header
  const { columnDef } = column
  const {
    facetedUniqueValues,
    isAutocompleteFilter,
    isMultiSelectFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table })

  return useMemo<Options | undefined>(
    () =>
      columnDef.filterSelectOptions ??
      ((isSelectFilter || isMultiSelectFilter || isAutocompleteFilter) &&
      facetedUniqueValues
        ? Array.from(facetedUniqueValues.keys())
            .filter((value) => value !== null && value !== undefined)
            .sort((a, b) => a.localeCompare(b))
        : undefined
      )?.reduce(
        (prev, curr) => ({
          ...prev,
          [curr]: {
            key: curr,
            display: curr,
          },
        }),
        {},
      ),
    [
      columnDef.filterSelectOptions,
      facetedUniqueValues,
      isMultiSelectFilter,
      isSelectFilter,
    ],
  )
}
