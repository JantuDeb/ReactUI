import { type ReactNode, type JSX } from "react"
import {
  createRow as _createRow,
  flexRender as _flexRender,
  type Renderable,
} from "@tanstack/react-table"
import {
  type TColumnHelper,
  type TDisplayColumnDef,
  type TGroupColumnDef,
  type TRow,
  type TRowData,
  type TTableInstance,
} from "../types"
import { getAllLeafColumnDefs, getColumnId } from "./column.utils"

export const flexRender = _flexRender as (
  Comp: Renderable<any>,
  props: any,
) => JSX.Element | ReactNode

export function createColumnHelper<
  TData extends TRowData,
>(): TColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === "function"
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          }
    },
    display: (column) => column as TDisplayColumnDef<TData>,
    group: (column) => column as TGroupColumnDef<TData>,
  }
}

export const createRow = <TData extends TRowData>(
  table: TTableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: TRow<TData>[],
  parentId?: string,
): TRow<TData> =>
  _createRow(
    table as any,
    "row-create",
    originalRow ??
      Object.assign(
        {},
        ...getAllLeafColumnDefs(table.options.columns).map((col) => ({
          [getColumnId(col)]: "",
        })),
      ),
    rowIndex,
    depth,
    subRows as any,
    parentId,
  ) as TRow<TData>
