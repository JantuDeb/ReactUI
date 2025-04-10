const td =
  // ☢️ Table internal borders intentionally made lighter with  border-muted
  "border-b text-sm text-gray-900 font-semibold table-cell hover:bg-muted group-hover:bg-muted leading-5 dark:text-gray-400 items-center"
const tdSelectedBg = "bg-muted"
const tdBg = "bg-background"
const tdSpacing = "p-2"
const tHead =
  "border-b text-left bg-muted !font-medium text-secondary-dark tracking-wider table-cell bg-opacity-75 backdrop-filter"
const tHeadSticky = "sticky z-20 top-0"
const table = "w-full border-separate border rounded-lg border-spacing-0"

export const tableBaseThemes = {
  td,
  tdSelectedBg,
  tdBg,
  tdSpacing,
  tHead,
  tHeadSticky,
  table,
}
