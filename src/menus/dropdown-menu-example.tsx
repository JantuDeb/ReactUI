import React, { useState } from "react"
import { MoreHorizontal } from "lucide-react"

// Assuming your DropdownMenu and types are in these locations
import DropdownMenu from "./dropdown-menu"
import { MenuOptions } from "../types/menu-option" // Import the master `Options` type

// Let's assume you have a basic Button component for the trigger
// If not, you can just use a regular <button> element.
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:hover:bg-zinc-800 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900 ${className}`}
      {...props}
    />
  ),
)

export function DropdownMenuUsageExample() {
  // State for the checkbox item's checked status
  const [isGridVisible, setIsGridVisible] = useState(true)

  // State to display which item was last selected
  const [lastSelection, setLastSelection] = useState<string | null>(null)

  // Define the menu structure using the strongly-typed `Options` array.
  // TypeScript will guide you to create a valid structure.
  const menuOptions: MenuOptions = [
    { type: "item", id: "profile", label: "Profile" },
    { type: "item", id: "billing", label: "Billing", disabled: true },
    { type: "separator", id: "sep1" },
    {
      type: "group",
      id: "team-group",
      label: "Team Actions", // Group title
      options: [
        { type: "item", id: "invite", label: "Invite members" },
        { type: "item", id: "settings", label: "Team Settings" },
      ],
    },
    { type: "separator", id: "sep2" },
    {
      type: "submenu",
      id: "share-submenu",
      label: "Share",
      options: [
        { type: "item", id: "copy-link", label: "Copy link" },
        { type: "item", id: "embed", label: "Embed code" },
        { type: "separator", id: "share-sep" },
        { type: "item", id: "more-options", label: "More options..." },
      ],
    },
    { type: "separator", id: "sep3" },
    {
      type: "checkbox",
      id: "toggle-grid",
      label: "Show Grid",
      checked: isGridVisible,
    },
    { type: "separator", id: "sep4" },
    { type: "item", id: "delete", label: "Delete Project" }, // Can be styled as destructive in the item itself
  ]

  // Handle all selections in one place
  const handleSelect = (id: string) => {
    console.log("Item selected:", id)
    setLastSelection(id)

    // Perform specific actions based on the ID
    if (id === "toggle-grid") {
      setIsGridVisible((prev) => !prev)
    }

    if (id === "delete") {
      // In a real app, you would open a confirmation modal here
      alert("This is a destructive action!")
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
      <DropdownMenu options={menuOptions} onSelect={handleSelect}>
        <Button>
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenu>

      <div className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Last selected action:{" "}
          <strong className="font-semibold text-zinc-800 dark:text-zinc-200">{lastSelection || "none"}</strong>
        </p>
        <p>
          Grid is currently:{" "}
          <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
            {isGridVisible ? "Visible" : "Hidden"}
          </strong>
        </p>
      </div>
    </div>
  )
}
