import React, { ComponentProps } from "react"
import { Button, ButtonProps, ButtonVariantProps } from "./button"
import { Link as ReactRouterLink } from "@tanstack/react-router"

export type LinkButtonProps = ComponentProps<typeof ReactRouterLink> & Omit<ButtonVariantProps, "asChild">

const Link = (props: LinkButtonProps) => {
  const { variant = "link", size, className, tooltip, children, ...linkProps } = props
  return (
    <Button {...{ variant, size: "none", className, tooltip }} asChild>
      <ReactRouterLink {...linkProps}>{children}</ReactRouterLink>
    </Button>
  )
}

export default Link
