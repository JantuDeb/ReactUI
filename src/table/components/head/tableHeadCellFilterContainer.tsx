import { type ChangeEvent, useCallback, useState, useEffect } from "react"
import { type THeader, type TRowData, type TTableInstance } from "../../types"
import { cn, debounce } from "../../../lib/utils"
import SelectStyled from "../../../inputs/select"
import type { MenuOptions } from "../../../types/menu-option"

const ALL_FILTER_VALUE = "__all__"

export interface TableHeadCellFilterContainerProps<TData extends TRowData> {
  header: THeader<TData>
  table: TTableInstance<TData>
}

export const TableHeadCellFilterContainer = <TData extends TRowData>({
  header,
  table,
}: TableHeadCellFilterContainerProps<TData>) => {
  const {
    options: { manualFiltering, enableFacetedValues },
  } = table
  const { column } = header
  const { columnDef } = column
  const filterVariant = (columnDef as any).filterVariant ?? "text"
  // filterSelectOptions as explicit fallback (Options dict or array)
  const filterSelectOptionsProp = (columnDef as any).filterSelectOptions

  const currentFilter = column.getFilterValue() as string | undefined
  const [inputValue, setInputValue] = useState(currentFilter ?? "")

  useEffect(() => {
    setInputValue(currentFilter ?? "")
  }, [currentFilter])

  const handleChangeDebounced = useCallback(
    debounce(
      (value: string) => {
        column.setFilterValue(value || undefined)
      },
      manualFiltering ? 400 : 200,
    ),
    [column],
  )

  if (!column.getCanFilter()) return null

  if (filterVariant === "select" || filterVariant === "multi-select") {
    // Prefer faceted unique values collected from live data
    const facetedMap = enableFacetedValues ? column.getFacetedUniqueValues() : null
    const facetedKeys = facetedMap ? Array.from(facetedMap.keys()).filter(Boolean).sort() : []

    // Fall back to explicit filterSelectOptions (supports both array and Options-dict)
    const explicitOptions: Array<{ value: string; label: string }> =
      facetedKeys.length === 0
        ? Array.isArray(filterSelectOptionsProp)
          ? filterSelectOptionsProp.map((o: any) => ({ value: o.id ?? o.value, label: String(o.label) }))
          : filterSelectOptionsProp
            ? Object.values(filterSelectOptionsProp).map((o: any) => ({ value: o.id, label: String(o.label) }))
            : []
        : []

    const selectOptions = facetedKeys.length > 0 ? facetedKeys.map((k) => ({ value: k, label: k })) : explicitOptions

    const menuOptions: MenuOptions = [
      { id: ALL_FILTER_VALUE, label: "All" },
      ...selectOptions.map((opt) => ({ id: opt.value, label: opt.label })),
    ]

    return (
      <SelectStyled
        value={currentFilter ?? ALL_FILTER_VALUE}
        onValueChange={(val) => column.setFilterValue(val === ALL_FILTER_VALUE ? undefined : val)}
        options={menuOptions}
        placeholder="All"
        portal
        width="full"
        size="sm"
        className="mt-1.5 text-xs normal-case tracking-normal font-normal"
      />
    )
  }

  // Default: text input
  return (
    <input
      type="text"
      value={inputValue}
      placeholder="Filter..."
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        handleChangeDebounced(e.target.value)
      }}
      className={cn(
        "w-full mt-1.5 h-8 rounded-md border border-input bg-background px-2 text-xs normal-case tracking-normal font-normal placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-1 focus:ring-ring",
      )}
      aria-label={`Filter by ${columnDef.header}`}
    />
  )
}
