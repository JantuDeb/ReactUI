import { ChangeEvent } from "react"
import Tooltip from "../../../tooltip/tooltip"
import { type TRow, type TRowData, type TTableInstance } from "../../types"
import { getIsRowSelected, getRowSelectionHandler, getSelectAllHandler } from "../../utils/row.utils"
import { Checkbox, CheckboxProps } from "../../../inputs/checkbox"

export interface RowSelectCheckboxProps<TData extends TRowData> extends CheckboxProps {
  row?: TRow<TData>
  staticRowIndex?: number
  table: TTableInstance<TData>
}

export const RowSelectCheckbox = <TData extends TRowData>({
  row,
  staticRowIndex,
  table,
  ...rest
}: RowSelectCheckboxProps<TData>) => {
  const {
    getState,
    options: { enableMultiRowSelection = true, localization, selectAllMode },
  } = table
  const { density, isLoading } = getState()

  const selectAll = !row

  const allRowsSelected = selectAll
    ? selectAllMode === "page"
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined

  const isChecked = selectAll ? allRowsSelected : getIsRowSelected({ row, table })

  const onSelectionChange = row
    ? getRowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined

  const onSelectAllChange = getSelectAllHandler({ table })

  const commonProps = {
    "aria-label": selectAll ? localization?.toggleSelectAll : localization?.toggleSelectRow,
    checked: isChecked,
    disabled: isLoading || (row && !row.getCanSelect()) || row?.id === "row-create",

    onCheckedChange: (checked: boolean) => (selectAll ? onSelectAllChange(checked) : onSelectionChange!(checked)),
    size: (density === "compact" ? "small" : "medium") as "medium" | "small",
    ...rest,
    title: undefined,
  } as CheckboxProps

  const indeterminate =
    !isChecked && selectAll ? table.getIsSomeRowsSelected() : row?.getIsSomeSelected() && row.getCanSelectSubRows()
  return (
    <Tooltip>
      {/* {enableMultiRowSelection === false ? (
        <Checkbox {...(commonProps as any)} />
      ) : ( */}

      <Tooltip.Trigger>
        <Checkbox {...commonProps} checked={indeterminate ? "indeterminate" : commonProps.checked} />
      </Tooltip.Trigger>
      <Tooltip.Content>
        {rest?.title ??
          (selectAll ? localization?.toggleSelectAll || "Select All" : localization?.toggleSelectRow || "Select Row")}
      </Tooltip.Content>
      {/* )} */}
    </Tooltip>
  )
}
