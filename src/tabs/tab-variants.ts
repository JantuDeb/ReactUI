import { cva, type VariantProps } from "class-variance-authority"

// Variants for the root <Tabs> component
export const tabsRootVariants = cva("flex w-full px-2", {
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

// Variants for the <TabsList> component
export const tabsListVariants = cva("inline-flex items-center rounded-md py-2 text-muted-foreground w-full", {
  variants: {
    variant: {
      pills: "bg-muted",
      underline: "rounded-none border-b p-0",
      contained: "bg-muted gap-1",
      verticalNav: "flex-col items-stretch justify-start p-0",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-stretch h-auto",
    },
    background: {
      muted: "bg-muted",
      secondary: "bg-secondary",
      default: "bg-transparent",
    },
    border: {
      default: "border rounded-md",
      none: "border-0",
    },
    overflow: {
      wrap: "flex-wrap",
      flowX: "overflow-x-auto",
      flowY: "overflow-y-auto",
    },
  },
  // The underline style should not apply vertical layout changes
  compoundVariants: [
    {
      variant: "underline",
      orientation: "vertical",
      className: "flex-col items-stretch w-full border-b-0 border-r",
    },
    {
      variant: "underline",
      // border: "none",
      className: "border-t-0 border-r-0 border-l-0",
    },
  ],
  defaultVariants: {
    variant: "pills",
    orientation: "horizontal",
    background: "default",
    border: "default",
    overflow: "flowX",
  },
})

// Variants for the <TabsTrigger> component
export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        pills: "data-[state=active]:shadow-sm",
        underline:
          "border-0 border-b-2 border-transparent p-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none",
        contained: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        verticalNav:
          "justify-start rounded-md hover:bg-muted data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
      },
      activeVariant: {
        primary: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        secondary: "data-[state=active]:bg-secondary data-[state=active]:text-secondary",
        muted: "data-[state=active]:bg-muted data-[state=active]:text-primary",
        background: "data-[state=active]:bg-background data-[state=active]:text-background-foreground",
      },
    },
    defaultVariants: {
      variant: "pills",
      activeVariant: "muted",
    },
  },
)

// Export the VariantProps types for our main component
export type TabsRootVariantProps = VariantProps<typeof tabsRootVariants>
export type TabsListVariantProps = VariantProps<typeof tabsListVariants>
export type TabsTriggerVariantProps = VariantProps<typeof tabsTriggerVariants>

/**
 * import { cva, type VariantProps } from 'class-variance-authority'

// Variants for the root <Tabs> component (no changes needed)
export const tabsRootVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

// Variants for the <TabsList> component (using your new additions)
export const tabsListVariants = cva('inline-flex items-center justify-center p-1 text-muted-foreground', {
  variants: {
    variant: {
      pills: '',
      underline: 'rounded-none p-0',
      contained: 'gap-1',
      verticalNav: 'flex-col items-stretch justify-start p-0',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col items-stretch h-auto',
    },
    background: {
      muted: 'bg-muted',
      secondary: 'bg-secondary',
      transparent: 'bg-transparent',
    },
    border: {
      default: 'border rounded-md',
      bottom: 'border-b',
      none: 'border-0',
    },
  },
  compoundVariants: [
    {
      variant: 'underline',
      orientation: 'vertical',
      className: 'flex-col items-stretch w-full border-b-0 border-r',
    },
    {
      variant: 'underline',
      border: 'bottom',
      className: 'border-t-0 border-r-0 border-l-0',
    },
  ],
  defaultVariants: {
    variant: 'pills',
    orientation: 'horizontal',
    background: 'muted',
    border: 'default',
  },
})

// Variants for the <TabsTrigger> component (refactored for activeVariant)
export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // Base styles for each variant
      variant: {
        pills: '', // Relies on active styles for its look
        underline: 'border-b-2 border-transparent p-2 rounded-none',
        contained: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        verticalNav: 'justify-start rounded-md hover:bg-muted',
      },
      // Defines the prop, but the magic happens in compoundVariants
      activeVariant: {
        primary: '',
        secondary: '',
      },
    },
    // Combine variant and activeVariant to create the final active style
    compoundVariants: [
      // --- Pills Active States ---
      {
        variant: 'pills',
        activeVariant: 'primary',
        className: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm',
      },
      {
        variant: 'pills',
        activeVariant: 'secondary',
        className: 'data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm',
      },
      // --- Underline Active States ---
      {
        variant: 'underline',
        activeVariant: 'primary',
        className: 'data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none',
      },
      {
        variant: 'underline',
        activeVariant: 'secondary',
        className: 'data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none',
      },
      // --- Contained Active States ---
      {
        variant: 'contained',
        activeVariant: 'primary',
        className: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
      },
      {
        variant: 'contained',
        activeVariant: 'secondary',
        className: 'data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground',
      },
      // --- Vertical Nav Active States ---
      {
        variant: 'verticalNav',
        activeVariant: 'primary',
        className: 'data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
      },
      {
        variant: 'verticalNav',
        activeVariant: 'secondary',
        className: 'data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary',
      },
    ],
    defaultVariants: {
      variant: 'pills',
      activeVariant: 'primary',
    },
  },
)

// Export the VariantProps types for our main component
export type TabsRootVariantProps = VariantProps<typeof tabsRootVariants>
export type TabsListVariantProps = VariantProps<typeof tabsListVariants>
export type TabsTriggerVariantProps = VariantProps<typeof tabsTriggerVariants>
 */
