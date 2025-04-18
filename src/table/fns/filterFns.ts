import {
  type RankingInfo,
  rankItem,
  rankings,
} from "@tanstack/match-sorter-utils"
import { type Row, filterFns as _filterFns } from "@tanstack/react-table"
import { type TRowData } from "../types"

const fuzzy = <TData extends TRowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string,
  addMeta: (item: RankingInfo) => void,
): boolean => {
  const itemRank = rankItem(
    row.getValue<string | number | null>(columnId),
    filterValue as string,
    {
      threshold: rankings.MATCHES,
    },
  )
  addMeta(itemRank)
  return itemRank.passed
}

fuzzy.autoRemove = (val: any) => !val

const contains = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .includes(filterValue.toString().toLowerCase().trim())

contains.autoRemove = (val: any) => !val

const startsWith = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim())

startsWith.autoRemove = (val: any) => !val

const endsWith = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .endsWith(filterValue.toString().toLowerCase().trim())

endsWith.autoRemove = (val: any) => !val

const equals = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  row.getValue<number | string | null>(id)?.toString().toLowerCase().trim() ===
  filterValue.toString().toLowerCase().trim()

equals.autoRemove = (val: any) => !val

const notEquals = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  row.getValue<number | string | null>(id)?.toString().toLowerCase().trim() !==
  filterValue.toString().toLowerCase().trim()

notEquals.autoRemove = (val: any) => !val

const greaterThan = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<number | string | null>(id) ?? 0) > +filterValue
    : (row.getValue<number | string | null>(id) ?? "")
        ?.toString()
        .toLowerCase()
        .trim() > filterValue.toString().toLowerCase().trim()

greaterThan.autoRemove = (val: any) => !val

const greaterThanOrEqualTo = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || greaterThan(row, id, filterValue)

greaterThanOrEqualTo.autoRemove = (val: any) => !val

const lessThan = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<number | string | null>(id) ?? 0) < +filterValue
    : (row.getValue<number | string | null>(id) ?? "")
        ?.toString()
        .toLowerCase()
        .trim() < filterValue.toString().toLowerCase().trim()

lessThan.autoRemove = (val: any) => !val

const lessThanOrEqualTo = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || lessThan(row, id, filterValue)

lessThanOrEqualTo.autoRemove = (val: any) => !val

const between = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  ((["", undefined] as any[]).includes(filterValues[0]) ||
    greaterThan(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    (["", undefined] as any[]).includes(filterValues[1]) ||
    lessThan(row, id, filterValues[1]))

between.autoRemove = (val: any) => !val

const betweenInclusive = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  ((["", undefined] as any[]).includes(filterValues[0]) ||
    greaterThanOrEqualTo(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    (["", undefined] as any[]).includes(filterValues[1]) ||
    lessThanOrEqualTo(row, id, filterValues[1]))

betweenInclusive.autoRemove = (val: any) => !val

const empty = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  _filterValue: number | string,
): boolean => !row.getValue<number | string | null>(id)?.toString().trim()

empty.autoRemove = (val: any) => !val

const notEmpty = <TData extends TRowData>(
  row: Row<TData>,
  id: string,
  _filterValue: number | string,
): boolean => !!row.getValue<number | string | null>(id)?.toString().trim()

notEmpty.autoRemove = (val: any) => !val

export const filterFns = {
  ..._filterFns,
  between,
  betweenInclusive,
  contains,
  empty,
  endsWith,
  equals,
  fuzzy,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  notEmpty,
  notEquals,
  startsWith,
}
