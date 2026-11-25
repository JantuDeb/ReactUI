import * as React from "react"
import type { ElementType, ComponentPropsWithRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../../lib/utils"

// Polymorphic types
export type AsProp<E extends ElementType> = {
  as?: E
  asChild?: boolean
}

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicComponentProps<E extends ElementType, P> = P &
  AsProp<E> &
  Omit<ComponentPropsWithRef<E>, PropsToOmit<E, P> | "className"> & {
    className?: string
  }

export type BoxProps<E extends ElementType = "div"> = PolymorphicComponentProps<E, {}>

export function Box<E extends ElementType = "div">({ as, asChild, className, ...rest }: BoxProps<E>) {
  const Comp: any = asChild ? Slot : as || "div"
  return <Comp className={cn(className)} {...rest} />
}

Box.displayName = "Box"
