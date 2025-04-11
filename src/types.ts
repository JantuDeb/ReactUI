import { ReactElement, ReactNode } from "react"

export interface Option {
  key: string
  display: ReactNode
  disabled?: boolean
  invisible?: boolean
  selected?: boolean
  icon?: string | ReactElement // string (iconname) or jsx
}
export interface Options {
  [key: string]: Option
}
