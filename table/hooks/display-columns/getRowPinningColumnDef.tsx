import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"

export const getRowPinningColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  return {
    Cell: ({ row, table }) => {
      console.log("row, table", row, table)
      //TODO: implement row pinning
      return null
      // <TableBodyRowPinButton row={row} table={table} />
    },
    grow: false,
    ...defaultDisplayColumnProps({
      header: "pin",
      id: "row-pin",
      size: 60,
      tableOptions,
    }),
  }
}
