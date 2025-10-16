import { Option } from "../types/option" // Assuming Option is { id: string; label: string; ... }
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./index"
import React, { ReactElement } from "react"
import { TabsProps } from "@radix-ui/react-tabs"
import {
  TabsListVariantProps,
  tabsListVariants,
  tabsRootVariants,
  TabsTriggerVariantProps,
  tabsTriggerVariants,
} from "./tab-variants"
import { cn } from "../lib/utils"

export { TabsContent } from "./index"

type TabsContentElement = ReactElement<React.ComponentProps<typeof TabsContent>>

type TabItem = Option

export type TabGroupProps = {
  tabs: TabItem[]
  children?: TabsContentElement | TabsContentElement[]
  className?: string
} & Omit<TabsProps, "children"> &
  TabsListVariantProps & // Adds `variant` prop for the list
  TabsTriggerVariantProps // Adds `variant` prop for the triggers

const TabGroup = ({
  tabs,
  defaultValue,
  children,
  className,
  variant, // from CVA props
  orientation, // from Radix props, but used by our CVA
  border,
  background,
  activeVariant,
  overflow,
  ...tabProps
}: TabGroupProps) => {
  const initialValue = defaultValue || (tabs.length > 0 ? tabs[0].id : undefined)

  return (
    <Tabs
      defaultValue={initialValue}
      orientation={orientation}
      {...tabProps}
      className={cn(tabsRootVariants({ orientation }), className)}
    >
      <TabsList className={cn(tabsListVariants({ variant, orientation, border, background, overflow }))}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className={cn(tabsTriggerVariants({ variant, activeVariant }))}>
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content panels are rendered here */}
      <div className="mt-2 w-full">{children}</div>
    </Tabs>
  )
}

export default TabGroup

// const TabGroup = ({ tabs, defaultValue, children, ...tabProps }: TabGroupProps) => {
//   // In uncontrolled mode, set the default active tab to the first item if not specified.
//   // Radix will ignore this prop if `value` is present in `tabProps` (controlled mode).
//   const initialValue = defaultValue || (tabs.length > 0 ? tabs[0].id : undefined)

//   return (
//     //flex-row for orientation vertical
//     <Tabs defaultValue={initialValue} {...tabProps} orientation="vertical" className="flex-row">
//       {/*
//       for list
//       style -1 : bg-background border
//         style 2 :  rounded-none border-b p-0
//         style 3: bg-background border gap-1  (can be used for trigger style 1 or 3 )
//         style 4: bg-background or muted flex-col items-start gap-2
//         */}
//       <TabsList className="bg-muted flex-col items-start gap-2">
//         {tabs.map((tab) => (
//           <TabsTrigger
//             key={tab.id}
//             value={tab.id}
//             // 1. pills buttons for style 1 ->  "data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent"
//             // 2. underline buttons for style 2 -> bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none
//             // 3. with hover effect similar to 1 (should be used without border-b but with a gap) -> data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300 hover:border dark:data-[state=active]:border-transparent
//             className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300 hover:border dark:data-[state=active]:border-transparent"
//           >
//             {tab.icon} {tab.label}
//           </TabsTrigger>
//         ))}
//       </TabsList>

//       {/* Render the content panels passed as children */}
//       {children}
//     </Tabs>
//   )
// }
