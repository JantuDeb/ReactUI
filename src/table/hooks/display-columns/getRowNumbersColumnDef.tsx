import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"

export const getRowNumbersColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  const { localization, rowNumberDisplayMode } = tableOptions
  const {
    pagination: { pageIndex, pageSize },
  } = tableOptions.state

  return {
    Cell: ({ row, staticRowIndex }) =>
      ((rowNumberDisplayMode === "static"
        ? (staticRowIndex || 0) + (pageSize || 0) * (pageIndex || 0)
        : row.index) ?? 0) + 1,
    Header: () => localization.rowNumber,
    grow: false,
    ...defaultDisplayColumnProps({
      header: "rowNumbers",
      id: "row-numbers",
      size: 50,
      tableOptions,
    }),
  }
}
