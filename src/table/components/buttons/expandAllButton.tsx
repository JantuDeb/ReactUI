import { ArrowRightIcon } from "lucide-react"
import { TRowData, TTableInstance } from "../../types"
import { cn } from "../../../lib/utils"

export interface ExpandAllButtonProps<TData extends TRowData> {
  table: TTableInstance<TData>
}
const ExpandAllButton = <TData extends TRowData>({ table }: ExpandAllButtonProps<TData>) => {
  const isAllRowsExpanded = table.getIsAllRowsExpanded()
  if (!table.getCanSomeRowsExpand()) return null
  return (
    <button onClick={() => table.toggleAllRowsExpanded(!isAllRowsExpanded)} className="pl-2">
      <ArrowRightIcon
        className={cn(
          "w-4 h-4 cursor-pointer mr-1 text-secondary transform  duration-150 ease-in-out  ",
          isAllRowsExpanded ? "rotate-90" : "rotate-0",
        )}
      />
    </button>
  )
}

export default ExpandAllButton
