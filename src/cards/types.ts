import { ComponentProps, ReactNode } from "react"

export type LayoutType = "leftImage" | "topImage" | "topIcon" //| "flowCard"

export type CardProps = {
  children: ReactNode
  // id: string
  onClick?: () => void
  url?: string
  openInNewTab?: boolean
  noPadding?: boolean
  //   actionMenu?: ActionMenuProps
}

export interface SelectCardProps extends Omit<CardProps, "onClick"> {
  onClick?: (id: string, isSelected: boolean) => void
  isSelected?: boolean
}

export type LayoutProps = {
  buttons?: ReactNode
  date?: string
} & CardHeaderProps &
  CardDescriptionProps &
  CardImageProps
//   CardTagsProps

export interface CardHeaderProps {
  icon?: string
  header?: string
  lineClampHeader?: number
  showTooltipHeader?: boolean
}

export interface CardDescriptionProps {
  description?: string
  lineClampDescription?: number
}

export interface CardImageProps {
  src?: string
  alt?: string
  initials?: string[]
}

// export interface CardTagsProps extends TagsProps {
//   tags?: Array<string>
// }
