import { Checkbox } from "./checkbox"

/** Toolbar toggle for admin lists that can opt in to showing soft-deleted rows. */
export function ShowDeletedToggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={(value) => onChange(!!value)} />
      Show deleted
    </label>
  )
}
