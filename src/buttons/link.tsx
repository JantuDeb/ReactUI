import React, { ComponentProps } from "react"
import { Button, ButtonVariantProps } from "./button"

export type LinkButtonProps<C extends React.ElementType = "a"> = Omit<ButtonVariantProps, "asChild"> &
  ComponentProps<C> & {
    as?: C
  }

function Link<C extends React.ElementType = "a">(props: LinkButtonProps<C>) {
  const { variant = "link", size, className, tooltip, children, as, ...linkProps } = props
  const Comp = as || "a"
  return (
    <Button {...{ variant, size: "none", className, tooltip }} asChild>
      <Comp {...linkProps}>{children}</Comp>
    </Button>
  )
}

export default Link
