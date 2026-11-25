import { User, Settings, LogOut } from "lucide-react"
import SelectStyled from "../select"
import { MultiSelect, MultiSelectProps } from "../multi-select"
import { MenuOption } from "../../types/menu-option"

// Basic options: only one large item
const basicOptions: MenuOption[] = [
  { id: "profile", label: "User Profile Settings and Details 1", icon: <User className="size-4" /> },
  { id: "user", label: "User Profile Settings and Details 2", icon: <User className="size-4" /> },
  { id: "setting", label: "User Profile Settings and Details 3", icon: <User className="size-4" /> },
]

// Full width options: multiple items
const fullWidthOptions: MenuOption[] = [
  { id: "settings", label: "Settings", icon: <Settings className="size-4" /> },
  { id: "logout", label: "Logout", icon: <LogOut className="size-4" />, disabled: true },
]

// Fit width options: labels with two or three words
const fitWidthOptions: MenuOption[] = [
  { id: "quick-start", label: "Quick Start Guide" },
  { id: "user-manual", label: "User Manual" },
  { id: "faq", label: "FAQ Section" },
  { id: "installation", label: "Installation Steps" },
  { id: "troubleshooting", label: "Troubleshooting Tips" },
  { id: "release-notes", label: "Release Notes" },
  { id: "api-reference", label: "API Reference" },
  { id: "best-practices", label: "Best Practices" },
  { id: "security", label: "Security Guidelines" },
  { id: "migration", label: "Migration Guide" },
  { id: "shortcuts", label: "Keyboard Shortcuts" },
  { id: "customization", label: "Customization Options" },
  { id: "integration", label: "Integration Steps" },
  { id: "feedback", label: "Feedback Form" },
  { id: "support", label: "Support Contacts" },
  { id: "license", label: "License Information" },
  { id: "roadmap", label: "Product Roadmap" },
  { id: "contribute", label: "How to Contribute" },
  { id: "community", label: "Community Forums" },
  { id: "examples", label: "Code Examples" },
  { id: "glossary", label: "Glossary Terms" },
  { id: "contact", label: "Contact Us" },
]

// Grouped options: fruits and vegetables
const groupedOptions: MenuOption[] = [
  {
    id: "group-1",
    type: "group",
    label: "Fruits",
    options: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
    ],
  },
  {
    id: "group-2",
    type: "group",
    label: "Vegetables",
    options: [
      { id: "carrot", label: "Carrot" },
      { id: "broccoli", label: "Broccoli" },
    ],
  },
]

const multiSelectOptions: MultiSelectProps["options"] = [
  { label: "Apple", id: "apple" },
  { label: "Banana", id: "banana" },
  { label: "Blueberry", id: "blueberry" },
  { label: "Grapes", id: "grapes" },
  { label: "Pineapple", id: "pineapple" },
]

const multiSelectGroupedOptions: MultiSelectProps["options"] = [
  {
    label: "Fruits",
    id: "group-fruit",
    type: "group",
    options: [
      { label: "Apple", id: "apple" },
      { label: "Banana", id: "banana" },
      { label: "Blueberry", id: "blueberry" },
    ],
  },
  {
    label: "Vegetables",
    type: "group",
    id: "group-vegetables",
    options: [
      { label: "Carrot", id: "carrot" },
      { label: "Broccoli", id: "broccoli" },
      { label: "Spinach", id: "spinach" },
    ],
  },
]

export default function SelectExample() {
  return (
    <div className="flex gap-6 items-center w-full flex-col">
      <SelectStyled
        options={basicOptions}
        placeholder="Select profile"
        onValueChange={(id) => console.log("Selected:", id)}
      />

      <SelectStyled
        options={fullWidthOptions}
        placeholder="Full width select"
        width="full"
        onValueChange={(id) => console.log("Selected:", id)}
      />

      <SelectStyled
        options={fitWidthOptions}
        placeholder="Fit width select"
        width="fit"
        onValueChange={(id) => console.log("Selected:", id)}
        showScrollUp
      />

      <SelectStyled
        options={groupedOptions}
        placeholder="Choose an item"
        onValueChange={(id) => console.log("Selected:", id)}
      />

      <MultiSelect
        options={multiSelectOptions}
        onValueChange={(values) => console.log("Multi-select values:", values)}
        placeholder="Select multiple fruits"
      />

      <MultiSelect
        options={multiSelectGroupedOptions}
        onValueChange={(values) => console.log("Multi-select grouped values:", values)}
        placeholder="Select from grouped options"
      />
    </div>
  )
}
