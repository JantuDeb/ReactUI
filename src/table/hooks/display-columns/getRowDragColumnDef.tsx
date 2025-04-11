import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"

export const getRowDragColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  return {
    Cell: ({ row, rowRef, table }) => {
      console.log("row, rowRef, table", row, rowRef, table)
      //TODO: implement row dragging
      return (
        <></>
        // <TableBodyRowGrabHandle
        //   row={row}
        //   rowRef={rowRef as RefObject<HTMLTableRowElement | null>}
        //   table={table}
        // />
      )
    },
    grow: false,
    ...defaultDisplayColumnProps({
      header: "move",
      id: "row-drag",
      size: 60,
      tableOptions,
    }),
  }
}
