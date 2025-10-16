import { RowSelectCheckbox } from "../../components/inputs/rowSelectCheckbox"
import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"

export const getRowSelectColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions

  return {
    Cell: ({ row, staticRowIndex, table }) => (
      <RowSelectCheckbox
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    Header:
      enableSelectAll && enableMultiRowSelection
        ? ({ table }) => <RowSelectCheckbox table={table} />
        : undefined,
    grow: false,
    ...defaultDisplayColumnProps({
      header: "select",
      id: "row-select",
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  }
}
