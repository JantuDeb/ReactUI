import { useMemo } from "react"
// import Table, { type TableProps } from '@mui/material/Table';
import { useColumnVirtualizer } from "../../hooks/useColumnVirtualizer"
import { type TRowData, type TTableInstance } from "../../types"
import { parseCSSVarId } from "../../utils/style.utils"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { TableBody, MemoTableBody } from "../body/tableBody"
// import { TTableFooter } from "../footer/TTableFooter"
import { TableHead } from "../head/tableHead"
import { cn } from "@common/utils"

export interface TTableProps<TData extends TRowData> {
  table: TTableInstance<TData>
}

export const Table = <TData extends TRowData>({
  table,
}: //   ...rest
TTableProps<TData>) => {
  console.log("theme", table.options.theme)
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      enableStickyHeader,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      //   muiTableProps,
      renderCaption,
      theme: { table: tableClass },
    },
  } = table
  const { columnSizing, columnSizingInfo, columnVisibility, isFullScreen } =
    getState()

  //   const tableProps = {
  //     ...parseFromValuesOrFunc(muiTableProps, { table }),
  //     ...rest,
  //   }

  const Caption = parseFromValuesOrFunc(renderCaption, { table })

  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      const colSize = header.getSize()
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize
    }
    return colSizes
  }, [columns, columnSizing, columnSizingInfo, columnVisibility])

  const columnVirtualizer = useColumnVirtualizer(table)

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  }

  return (
    <table
      //   {...tableProps}
      className={cn(
        tableClass,
        layoutMode?.startsWith("grid") && "grid",
        "relative",
      )}
      style={columnSizeVars}
    >
      {!!Caption && <caption>{Caption}</caption>}
      {enableTableHead && <TableHead {...commonTableGroupProps} />}
      {memoMode === "table-body" || columnSizingInfo.isResizingColumn ? (
        <MemoTableBody {...commonTableGroupProps} />
      ) : (
        <TableBody {...commonTableGroupProps} />
      )}
      {/* {enableTableFooter && <TTableFooter {...commonTableGroupProps} />} */}
    </table>
  )
}
