import { type ReactNode } from "react"

import {
  type TColumnDef,
  type TRowData,
  type TStatefulTableOptions,
} from "../../types"
import { defaultDisplayColumnProps } from "../../utils/displayColumn.utils"
import Tooltip from "@common/tooltip"
import ExpandButton from "../../components/buttons/expandButton"
import ExpandAllButton from "../../components/buttons/expandAllButton"

export const getRowExpandColumnDef = <TData extends TRowData>(
  tableOptions: TStatefulTableOptions<TData>,
): TColumnDef<TData> => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions

  const alignProps =
    positionExpandColumn === "last"
      ? ({
          align: "right",
        } as const)
      : undefined

  return {
    Cell: ({ cell, column, row, staticRowIndex, table }) => {
      const expandButtonProps = { row, staticRowIndex, table }
      const subRowsLength = row.subRows?.length
      if (groupedColumnMode === "remove" && row.groupingColumnId) {
        return (
          <div className="flex items-center gap-1">
            <ExpandButton {...expandButtonProps} />
            <Tooltip>
              <Tooltip.Trigger>
                <span>{row.groupingValue as ReactNode}</span>
              </Tooltip.Trigger>
              <Tooltip.Content>
                table.getColumn(row.groupingColumnId).columnDef.header
              </Tooltip.Content>
            </Tooltip>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </div>
        )
      } else {
        return (
          <>
            <ExpandButton {...expandButtonProps} />
            {column.columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        )
      }
    },
    Header: enableExpandAll
      ? ({ table }) => {
          return (
            <>
              <ExpandAllButton table={table} />
              {groupedColumnMode === "remove" &&
                grouping
                  ?.map(
                    (groupedColumnId) =>
                      table.getColumn(groupedColumnId).columnDef.header,
                  )
                  ?.join(", ")}
            </>
          )
        }
      : undefined,
    ...defaultDisplayColumnProps({
      header: "expand",
      id: "row-expand",
      size:
        groupedColumnMode === "remove"
          ? defaultColumn?.size ?? 180
          : renderDetailPanel
          ? enableExpandAll
            ? 60
            : 70
          : 100,
      tableOptions,
    }),
  }
}
