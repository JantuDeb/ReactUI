import TablePagination from "@common/table/components/tablePagination"
import React from "react"

const TableBottomToolbar = ({ table }) => {
  const {
    options: { enablePagination },
  } = table
  return enablePagination ? <TablePagination table={table} /> : <></>
}

export default TableBottomToolbar
