import {
  type TRowData,
  type TTableInstance,
  type TTableOptions,
} from "../types"
import { useTableInstance } from "./useTableInstance"
import { useTableOptions } from "./useTableOptions"

export const useReactTable = <TData extends TRowData>(
  tableOptions: TTableOptions<TData>,
): TTableInstance<TData> => useTableInstance(useTableOptions(tableOptions))
