import { DefaultDisplayColumn } from "../useTableOptions"
import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"

// const blankColProps = {
//   children: null,
//   sx: {
//     minWidth: 0,
//     p: 0,
//     width: 0,
//   },
// }

export const getRowSpacerColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  return {
    ...defaultDisplayColumnProps({
      id: "row-spacer",
      size: 0,
      tableOptions,
    }),
    grow: true,
    ...DefaultDisplayColumn,
    // muiTableBodyCellProps: blankColProps,
    // muiTableFooterCellProps: blankColProps,
    // muiTableHeadCellProps: blankColProps,
  }
}
