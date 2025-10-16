import DropdownMenu from "../../../menus/dropdown-menu"
import { TCell, TRow, TRowData, TTableInstance } from "../../types"
import { Button } from "../../../buttons/button"
import { MoreVertical } from "lucide-react"

export interface RowActionMenuButtonProps<TData extends TRowData> {
  cell: TCell<TData>
  row: TRow<TData>
  staticRowIndex?: number
  table: TTableInstance<TData>
}

export default function RowActionMenuButtonProps<TData extends TRowData>({
  row,
  table,
}: RowActionMenuButtonProps<TData>) {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      // icons: { EditIcon, MoreHorizIcon },
      localization,
      rowActions = {},
      onRowActionClick,
      // renderRowActions,
    },
    setEditingRow,
  } = table

  const { getOptions, actions, mode: renderType = "dropdown" } = rowActions
  const options = getOptions ? getOptions(row) : actions
  function handleSelect(key: string) {
    onRowActionClick?.(row.original, key)
  }
  const { creatingRow, editingRow } = getState()

  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const showEditActionButtons = (isCreating && createDisplayMode === "row") || (isEditing && editDisplayMode === "row")

  if (!options) return
  if (renderType === "inline") {
    return (
      <div className="flex items-center gap-4">
        {options.map((option) => {
          if (option.type === "item" || !option.type)
            return (
              <Button
                key={option.id}
                disabled={option.disabled}
                onClick={() => handleSelect?.(option.id)}
                variant="secondary"
                size="sm"
                tooltip={option.label}
                {...option.buttonProps}
              >
                {option.icon || option.label}
              </Button>
            )
        })}
      </div>
    )
  }

  return (
    <div className="text-center relative">
      <DropdownMenu options={options} onSelect={handleSelect} width="full" align="start" side="left">
        <Button variant="outline" size="icon">
          <MoreVertical className="size-5 text-primary" />
        </Button>
      </DropdownMenu>
    </div>
  )
}
