import DropdownMenuStyled from "@common/dropdownMenu"
import Button from "@common/button"
import Svg from "@common/svg"
import { TCell, TRow, TRowData, TTableInstance } from "../../types"

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

  const { getOptions, actions } = rowActions
  const options = getOptions ? getOptions(row) : actions
  function handleSelect(key: string) {
    onRowActionClick?.(row.original, key)
  }
  const { creatingRow, editingRow } = getState()

  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const showEditActionButtons =
    (isCreating && createDisplayMode === "row") ||
    (isEditing && editDisplayMode === "row")

  if (!options) return
  return (
    <div className="text-center relative float-right ">
      <DropdownMenuStyled options={options} onSelect={handleSelect}>
        <Button variant="outline" size="icon-sm">
          <Svg name="dots-vertical" className="w-5 h-5" />
        </Button>
      </DropdownMenuStyled>
    </div>
  )
}
