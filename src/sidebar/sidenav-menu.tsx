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
import { Link as ReactRouterLink } from "@tanstack/react-router"
import { SidebarOption, SidebarOptions } from "./types"
import useIsMobile from "../hooks/useIsMobile"
import DropdownMenu from "../menus/dropdown-menu"
import { Fragment } from "react"

export function SideNavMain({
  items,
  onMenuOptionSelect,
}: {
  items: SidebarOptions
  onMenuOptionSelect?: (id: string) => void
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
      case "item":
        return (
          <SidebarMenuItem key={item.key}>
            <SidebarMenuButton asChild tooltip={item.label} isActive={item.isActive}>
              <ReactRouterLink to={item.href} className={item.disabled ? "pointer-events-none opacity-50" : ""}>
                {item.icon}
                <span>{item.label}</span>
              </ReactRouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )

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

      case "group":
        return (
          <SidebarGroup key={item.key}>
            {item.label && <SidebarGroupLabel>{item.label}</SidebarGroupLabel>}
            {item.children && <SidebarMenu>{item.children.map(renderMenuItem)}</SidebarMenu>}
          </SidebarGroup>
        )

      default:
        return null
    }
  }

  return <>{items.map(renderMenuItem)}</>
}
