import { ReactElement, ReactNode } from "react"

export interface Option {
  id: string
  label: ReactNode
  disabled?: boolean
  selected?: boolean
  icon?: string | ReactElement // string (iconname) or jsx
}
export interface Options {
  [key: string]: Option
}
