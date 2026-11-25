import { MenuOptions } from "../types/menu-option"
import type { ComponentProps, ReactElement } from "react"
import { SidebarMenuButton } from "./sidebar"
/**
 * Base properties shared by all clickable menu items.
 */
export type BaseMenuItem = {
  /** A unique key for the item, used for React keys and navigation. Can be a URL path. if href not exist */
  key: string
  /** The text label displayed for the menu item. */
  label: string
  /** An optional icon to display next to the label. */
  icon?: ReactElement
  /** If true, the menu item will be visually disabled and non-interactive. */
  disabled?: boolean
} & Pick<ComponentProps<typeof SidebarMenuButton>, "isActive" | "tooltip" | "variant" | "size">

export type SideBarDropDown = BaseMenuItem & {
  type: "dropdown"
  options?: MenuOptions
  description?: string
}

/**
 * A standard, clickable menu item that navigates to a URL.
 * This is the most common type of menu item.
 */
export type SidebarLinkItem = BaseMenuItem & {
  type: "item"
  /** The destination URL for the link. */
  href: string
}

/**
 * A menu item that expands to show a nested list of options.
 * It is not a link itself.
 */
export type SidebarSubmenuItem = BaseMenuItem & {
  type: "submenu"
  /** The array of nested menu options. */
  children: SidebarOptions
  open?: boolean
}

/**
 * A visual separator or spacer between menu items.
 */
export type SidebarSeparator = {
  type: "separator"
  /** A unique key for the separator. */
  key: string
}

/**
 * A non-interactive group of menu items, often with a title.
 * Used for visually sectioning the menu.
 */
export type SidebarGroup = {
  type: "group"
  /** A unique key for the group. */
  key: string
  /** An optional title to display above the group of items. */
  label?: string
  /** The array of menu options within this group. */
  children: SidebarOptions
  /**
   * Render the group label as a toggle that expands/collapses its items.
   * Open state persists per `key` in localStorage; a group containing the
   * active route opens automatically.
   */
  collapsible?: boolean
  /** Initial open state when nothing is persisted yet (default true). */
  defaultOpen?: boolean
}

// The discriminated union of all possible option types.
export type SidebarOption = SidebarLinkItem | SidebarSubmenuItem | SidebarSeparator | SidebarGroup | SideBarDropDown

// The complete list of options for a menu or submenu.
export type SidebarOptions = SidebarOption[]
