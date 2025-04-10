import { useReactTable } from "../hooks/useReactTable"
import {
  type TRowData,
  type TTableInstance,
  type TTableOptions,
  type Xor,
} from "../types"
import { TableWrapper } from "./table/tableWrapper"

type TableInstanceProp<TData extends TRowData> = {
  table: TTableInstance<TData>
}

export type ReactTableProps<TData extends TRowData> = Xor<
  TableInstanceProp<TData>,
  TTableOptions<TData>
>

const isTableInstanceProp = <TData extends TRowData>(
  props: ReactTableProps<TData>,
): props is TableInstanceProp<TData> =>
  (props as TableInstanceProp<TData>).table !== undefined

export const ReactTable = <TData extends TRowData>(
  props: ReactTableProps<TData>,
) => {
  let table: TTableInstance<TData>

  if (isTableInstanceProp(props)) {
    table = props.table
  } else {
    table = useReactTable(props)
  }

  return <TableWrapper table={table} />
}
