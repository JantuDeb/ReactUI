import Svg from "@common/svg"
import { cn } from "@common/utils"
import { TRow, TRowData, TTableInstance } from "../../types"
interface ExpandButtonProps<TData extends TRowData> {
  row: TRow<TData>
  // staticRowIndex?: number;
  table: TTableInstance<TData>
}

const ExpandButton = <TData extends TRowData>({
  row,
  table,
}: ExpandButtonProps<TData>) => {
  const {
    options: { renderDetailPanel },
  } = table
  const canExpand = row.getCanExpand()
  const isExpanded = row.getIsExpanded()

  const handleClick = (e: any) => {
    e.stopPropagation()
    row.toggleExpanded()
  }
  const detailPanel = !!renderDetailPanel?.({ row, table })

  return (
    <button
      onClick={handleClick}
      disabled={!canExpand && !detailPanel}
      className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      <Svg
        name="arrow-right-short"
        className={cn(
          "w-4 h-4 mr-1 text-secondary transform  duration-150 ease-in-out  ",
          !canExpand && !detailPanel
            ? "rotate-0"
            : isExpanded
            ? "rotate-90"
            : "rotate-0",
        )}
      />
    </button>
  )
}

export default ExpandButton
