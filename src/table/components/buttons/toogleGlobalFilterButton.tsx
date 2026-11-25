import { ButtonProps, Button } from "../../../buttons/button"
import { type TRowData, type TTableInstance } from "../../types"

export interface MRT_ToggleGlobalFilterButtonProps<TData extends TRowData>
  extends Omit<ButtonProps, "children" | "onClick"> {
  table: TTableInstance<TData>
}

export const ToggleGlobalFilterButton = <TData extends TRowData>({
  table,
  ...rest
}: MRT_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table
  const { globalFilter, showGlobalFilter } = getState()

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter)
    queueMicrotask(() => searchInputRef.current?.focus())
  }

  const title = rest?.title ?? localization.showHideSearch
  return (
    <Button
      variant="ghost"
      aria-label={title}
      disabled={!!globalFilter && showGlobalFilter}
      onClick={handleToggleSearch}
      {...rest}
      tooltip={title}
    >
      {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
    </Button>
  )
}
