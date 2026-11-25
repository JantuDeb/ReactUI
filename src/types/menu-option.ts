import { ButtonVariantProps } from "../buttons/button"

type BaseItem = {
  id: string
  label: string
  disabled?: boolean
  icon?: React.ReactElement | string
}

export type ItemOption = BaseItem & {
  type?: "item"
  buttonProps?: ButtonVariantProps
}

export type CheckboxOption = BaseItem & {
  type: "checkbox"
  checked: boolean
}

export type SeparatorOption = {
  type: "separator"
  id: string
}

export type SubMenuOption = BaseItem & {
  type: "submenu"
  options: MenuOptions
}

export type GroupOption = {
  type: "group"
  id: string
  label?: string
  options: MenuOptions
}

export type MenuOption = ItemOption | CheckboxOption | SeparatorOption | SubMenuOption | GroupOption

// The array of options remains the same
export type MenuOptions = MenuOption[]
