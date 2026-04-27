const td =
  // ☢️ Table internal borders intentionally made lighter with  border-muted
  "border-b text-sm text-foreground font-normal table-cell hover:bg-muted group-hover:bg-muted leading-5 items-center"
const tdSelectedBg = "bg-muted"
const tdBg = "bg-background"
const tdSpacing = "p-2"
const tHead =
  "border-b text-left bg-muted/60 text-xs !font-semibold uppercase tracking-widest table-cell text-muted-foreground align-top"
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
