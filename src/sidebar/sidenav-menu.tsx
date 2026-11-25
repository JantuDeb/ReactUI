import { ChevronRight, ChevronsUpDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "./sidebar"
import { SidebarOption, SidebarOptions, SidebarGroup as SidebarGroupOption } from "./types"
import useIsMobile from "../hooks/useIsMobile"
import DropdownMenu from "../menus/dropdown-menu"
import { Fragment, ElementType, ReactNode, useEffect, useState } from "react"

/** True when any (nested) link inside the group matches the current path. */
function groupContainsPath(children: SidebarOptions, pathname: string): boolean {
  return children.some((child) => {
    if ("children" in child && child.children) return groupContainsPath(child.children, pathname)
    if ("href" in child && child.href) {
      const hrefPath = child.href.split("?")[0]
      return pathname === hrefPath || pathname.startsWith(hrefPath + "/")
    }
    return false
  })
}

function CollapsibleGroup({
  item,
  pathname,
  children,
}: {
  item: SidebarGroupOption
  pathname: string
  children: ReactNode
}) {
  const storageKey = `sidebar-group:${item.key}`
  const containsActive = groupContainsPath(item.children, pathname)
  const [open, setOpen] = useState(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) return stored === "1" || containsActive
    return item.defaultOpen ?? true
  })

  // Navigating into a collapsed group should reveal the active item.
  useEffect(() => {
    if (containsActive) setOpen(true)
  }, [containsActive])

  return (
    <Collapsible
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        localStorage.setItem(storageKey, next ? "1" : "0")
      }}
      className="group/sidebar-group"
    >
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="w-full cursor-pointer">
            {item.label}
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/sidebar-group:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>{children}</CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export function SideNavMain({
  items,
  onMenuOptionSelect,
  pathname,
  linkComponent: LinkComp = "a",
}: {
  items: SidebarOptions
  onMenuOptionSelect?: (id: string) => void
  pathname: string
  linkComponent?: ElementType
}) {
  const isMobile = useIsMobile()

  const renderMenuItem = (item: SidebarOption) => {
    switch (item.type) {
      case "dropdown":
        if (item?.options)
          return (
            <SidebarHeader key={item.key}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu
                    options={item.options}
                    side={isMobile ? "bottom" : "right"}
                    align="start"
                    onSelect={onMenuOptionSelect}
                  >
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        {item.icon && item.icon}
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{item.label}</span>
                        <span className="truncate text-xs">{item.description}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
          )
        return (
          <SidebarHeader key={item.key}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {item.icon && item.icon}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{item.label}</span>
                    <span className="truncate text-xs">{item.description}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
        )
      case undefined:
      case "item": {
        const hrefPath = item.href.split("?")[0]
        const active = item.isActive ?? (pathname === hrefPath || pathname.startsWith(hrefPath + "/"))
        return (
          <SidebarMenuItem key={item.key}>
            <SidebarMenuButton asChild tooltip={item.label} isActive={active}>
              <LinkComp href={item.href} className={item.disabled ? "pointer-events-none opacity-50" : ""}>
                {item.icon}
                <span>{item.label}</span>
              </LinkComp>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }

      case "submenu":
        return (
          <Collapsible
            key={item.key}
            asChild
            defaultOpen={item.open}
            disabled={item.disabled}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.label}
                  size={item.size}
                  variant={item.variant}
                  isActive={item.isActive}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children &&
                    item.children.map((subItem) => (
                      <Fragment key={subItem.key}>
                        {/* <SidebarMenuSubButton asChild size={item.size as "sm" | "md"} isActive={item.isActive}> */}
                        {renderMenuItem(subItem)}
                        {/* </SidebarMenuSubButton> */}
                      </Fragment>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )

      case "separator":
        return <hr key={item.key} className="my-2 border-t border-muted" />

      case "group": {
        if (item.collapsible && item.label) {
          return (
            <CollapsibleGroup key={item.key} item={item} pathname={pathname}>
              {item.children && <SidebarMenu>{item.children.map(renderMenuItem)}</SidebarMenu>}
            </CollapsibleGroup>
          )
        }
        return (
          <SidebarGroup key={item.key}>
            {item.label && <SidebarGroupLabel>{item.label}</SidebarGroupLabel>}
            {item.children && <SidebarMenu>{item.children.map(renderMenuItem)}</SidebarMenu>}
          </SidebarGroup>
        )
      }

      default:
        return null
    }
  }

  return <>{items.map(renderMenuItem)}</>
}
