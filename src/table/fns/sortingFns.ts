import { type RankingInfo, compareItems } from "@tanstack/match-sorter-utils"
import { type Row, sortingFns as _sortingFns } from "@tanstack/react-table"
import { type TRow, type TRowData } from "../types"

const fuzzy = <TData extends TRowData>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string,
) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId] as RankingInfo,
      rowB.columnFiltersMeta[columnId] as RankingInfo,
    )
  }
  // Provide a fallback for when the item ranks are equal
  return dir === 0
    ? sortingFns.alphanumeric(rowA as Row<any>, rowB as Row<any>, columnId)
    : dir
}

export const sortingFns = {
  ..._sortingFns,
  fuzzy,
}

export const rankGlobalFuzzy = <TData extends TRowData>(
  rowA: TRow<TData>,
  rowB: TRow<TData>,
) =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((v: any) => v.rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((v: any) => v.rank))
