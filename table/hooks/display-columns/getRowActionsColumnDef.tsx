// import { TToggleRowActionMenuButton } from '../../components/buttons/TToggleRowActionMenuButton';
import RowActionMenu from "../../components/buttons/rowActionMenu"
import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"

export const getRowActionsColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  return {
    Cell: ({ cell, row, staticRowIndex, table }) => (
      <RowActionMenu
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    ...defaultDisplayColumnProps({
      header: "actions",
      id: "row-actions",
      size: 70,
      tableOptions,
    }),
  }
}
