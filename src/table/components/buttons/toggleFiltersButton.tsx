import { ButtonProps, Button } from "../../../buttons/button"
import { type TRowData, type TTableInstance } from "../../types"
import { FilterIcon, FilterXIcon } from "lucide-react"

export interface ToggleFiltersButtonProps<TData extends TRowData> extends Omit<ButtonProps, "children" | "onClick"> {
  table: TTableInstance<TData>
}

export const ToggleFiltersButton = <TData extends TRowData>({
  table,
  ...rest
}: ToggleFiltersButtonProps<TData>) => {
  const {
    getState,
    options: { localization },
    setShowColumnFilters,
  } = table
  const { showColumnFilters } = getState()

  const title = rest?.title ?? localization.showHideFilters

  return (
    <Button
      variant="ghost"
      aria-label={title}
      onClick={() => setShowColumnFilters(!showColumnFilters)}
      {...rest}
      tooltip={title}
    >
      {showColumnFilters ? <FilterXIcon /> : <FilterIcon />}
    </Button>
  )
}
