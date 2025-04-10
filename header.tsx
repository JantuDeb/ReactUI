import { cva } from "class-variance-authority"

const alignment = {
  left: "text-left justify-start",
  center: "text-center justify-center",
  right: "text-right justify-end",
}
const headerVariants = cva("flex flex-col space-y-3", {
  variants: {
    alignment: {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    },
  },
})

const shortHeaderVariants = cva("leading-7", {
  variants: {
    variant: {
      h1: "text-4xl font-bold tracking-tight lg:text-5xl",
      h2: "text-3xl font-bold",
      h3: "text-2xl font-bold tracking-tight",
      h4: "text-xl font-bold tracking-tight",
      h5: "text-lg font-bold tracking-tight",
      h6: "text-base font-bold tracking-tight",
      p: "[&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      largeText: "text-lg font-semibold",
      smallText: "text-sm font-medium leading-none",
      mutedText: "text-sm text-muted-foreground",
    },

    color: {
      primary: "text-primary",
      primaryDark: "text-primary-dark",
      secondary: "text-secondary",
      accent: "text-accent",
    },
    transform: {
      uppercase: "uppercase",
      normalcase: "normal-case",
    },
    width: {
      full: "w-full",
      fit: "",
    },
    alignment,
  },
  defaultVariants: {
    variant: "h6",
    alignment: "left",
    color: "accent",
    transform: "normalcase",
    width: "full",
  },
})
const mainHeaderVariants = cva(
  "w-full font-semibold flex text-primary tracking-tight",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-4",
        h2: "scroll-m-20 text-3xl font-bold tracking-tight my-4",
        h3: "scroll-m-20 text-2xl font-bold tracking-tight my-4",
        h4: "scroll-m-20 text-xl font-bold tracking-tight",
        h5: "scroll-m-20 text-lg font-semibold tracking-tight",
        h6: "scroll-m-20 text-base font-semibold tracking-tight",
        p: "leading-7 [&:not(:first-child)]:mt-6",
        blockquote: "mt-6 border-l-2 pl-6 italic",
        ul: "my-6 ml-6 list-disc [&>li]:mt-2",
        inlineCode:
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        lead: "text-xl text-muted-foreground",
        largeText: "text-lg font-semibold",
        smallText: "text-sm font-medium leading-none",
        mutedText: "text-sm text-muted-foreground",
      },
      alignment,
    },
    defaultVariants: {
      variant: "h6",
      alignment: "left",
    },
  },
)

const descriptionVariants = cva("w-full", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      h5: "text-lg font-semibold tracking-tight",
      h6: "text-base font-medium tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      largeText: "text-lg font-semibold",
      smallText: "text-sm font-medium leading-none",
      mutedText: "text-sm text-muted-foreground",
    },
    alignment,
    color: {
      primary: "text-primary",
      primaryDark: "text-primary-dark",
      secondary: "text-secondary",
      accent: "text-accent",
    },
  },
  defaultVariants: {
    variant: "h6",
    alignment: "left",
    color: "secondary",
  },
})

export interface HeaderProps {
  children: any
  variant?: "h6" | "h5" | "h4" | "h3" | "h2" | "h1"
  alignment?: "left" | "center" | "right"
  color?: "primary" | "secondary" | "accent" | "primaryDark"
  transform?: "uppercase" | "normalcase"
  width?: "full" | "fit"
}

export function Header({ children, alignment }: HeaderProps) {
  if (!children) return <></>
  return <div className={headerVariants({ alignment })}>{children}</div>
}

Header.ShortHeader = function ShortHeader({ children, ...rest }: HeaderProps) {
  if (!children) return <></>
  return <div className={shortHeaderVariants(rest)}>{children}</div>
}

Header.MainHeader = function MainHeader({
  children,
  variant,
  alignment,
}: HeaderProps) {
  if (!children) return <></>
  return (
    <div className={mainHeaderVariants({ variant, alignment })}>{children}</div>
  )
}

Header.Description = function Description({
  children,
  variant,
  alignment,
  color,
}: HeaderProps) {
  if (!children) return <></>
  return (
    <div className={descriptionVariants({ variant, alignment, color })}>
      {children}
    </div>
  )
}
