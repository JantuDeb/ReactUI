import React, { useState } from "react"
import Tooltip from "@common/tooltip"
import Svg from "@common/svg"
import { isFunction, cn, isString } from "@common/utils"
import DropdownMenu from "@common/dropdownMenu"
// import useIsMobile from "ui/hooks/useIsMobile"
import { motion } from "framer-motion"

export type MenuItem = {
  key: string
  name: string
  icon?: string | React.ReactNode
  items?: MenuItem[]
  subItemsType?: "inline" | "popover"
  url?: string
  render?: () => React.ReactNode
  action?: boolean
  openInNewTab?: boolean
}

type SideNavItemProps = MenuItem & {
  itemKey: string
  isCollapsed?: boolean
  isPopoverItem?: boolean
  selectedKey?: string
  onItemClick?: (item: Partial<MenuItem>) => void
  depth?: number
  collapsible?: boolean
}

type SideNavLinkProps = {
  itemKey: string
  name: string
  url?: string
  icon?: string | React.ReactNode
  render?: () => React.ReactNode
  isSelected?: boolean
  isCollapsed?: boolean
  isPopoverItem?: boolean
  action?: boolean
  onClick?: () => void
  hasItems?: boolean
  isOpen?: boolean
  openInNewTab?: boolean
  collapsible?: boolean
  isParent?: boolean
}

type SideNavProps = {
  config: MenuItem[]
  isCollapsed?: boolean
  selectedKey?: string
  onItemClick?: (item: Partial<MenuItem>) => void
}

function getSideNavItemClasses(
  isSelected: boolean,
  isParent: boolean,
  isPopoverItem: boolean,
  className?: string,
) {
  const anchorClasses = cn(
    "w-full text-sm font-medium rounded-xl block text-start transition ease-in-out duration-150",
    isPopoverItem ? "" : "px-2 py-1.5",
    isSelected
      ? "border bg-muted text-primary font-semibold"
      : "text-secondary hover:bg-muted",
    isParent
      ? "text-lg font-semibold cursor-default text-secondary"
      : "text-primary",
    className,
  )
  return anchorClasses
}

export function SideNavLink({
  itemKey,
  name,
  url,
  icon,
  render,
  isCollapsed = false,
  isPopoverItem = false,
  isSelected = false,
  action,
  onClick,
  hasItems,
  isOpen,
  openInNewTab,
  collapsible,
  isParent = false,
}: SideNavLinkProps) {
  const anchorClasses = getSideNavItemClasses(
    isSelected,
    isParent,
    isPopoverItem,
  )
  const showIcon = !!icon && (!isFunction(render) || isCollapsed)
  const iconClasses = isCollapsed ? "size-6 m-2" : "size-5"

  const renderContent = () => (
    <>
      <div className="flex items-center w-full justify-between py-1">
        <div
          className={cn(
            "flex gap-2",
            // isParent ? "font-semibold text-lg text-secondary" :,
          )}
        >
          {showIcon && isString(icon) ? (
            <Svg className={iconClasses} name={icon} />
          ) : (
            icon
          )}
          {!isCollapsed ? name : undefined}
        </div>
        <div>
          {!isCollapsed && hasItems && collapsible && (
            <Svg
              name="arrow-right-short"
              className={cn(
                "w-4 h-4 transition-transform ml-2",
                isOpen ? "rotate-90" : "",
              )}
            />
          )}
        </div>
      </div>
      {!isCollapsed && render?.()}
    </>
  )
  if (action || !url) {
    return (
      <button
        className={anchorClasses}
        key={itemKey}
        onClick={onClick}
        type="button"
      >
        {renderContent()}
      </button>
    )
  }
  return (
    <a
      href={url}
      className={anchorClasses}
      key={itemKey}
      target={openInNewTab ? "_blank" : undefined}
    >
      {renderContent()}
    </a>
  )
}

function SideNavItem({
  itemKey,
  name,
  icon,
  action,
  items = [],
  isCollapsed,
  collapsible,
  isPopoverItem,
  subItemsType = "inline",
  url,
  render,
  selectedKey,
  onItemClick,
  depth = 0,
  openInNewTab,
}: SideNavItemProps) {
  // const isMobile = useIsMobile()
  const subType = "inline" //isMobile ? "inline" : "popover" // no popover mode for mobile

  const [isOpen, setIsOpen] = useState(items && items.length < 2)
  const isSelected =
    itemKey === selectedKey ||
    selectedKey?.split("/").slice(-1).includes(itemKey)

  function handleMenuItemClick() {
    if (items.length > 0 && subType === "inline") setIsOpen(!isOpen)
    if (isFunction(onItemClick)) onItemClick?.({ key: itemKey, url, action })
  }

  // const indentationClass = depth > 0 && collapsible ? `ml-${depth * 2}` : ""

  const linkProps = {
    itemKey,
    name,
    url,
    icon,
    isCollapsed,
    isPopoverItem,
    isSelected,
    render,
    onClick: handleMenuItemClick,
    hasItems: items.length > 0,
    isOpen,
    openInNewTab,
    collapsible,
  }

  if (items.length === 0) {
    return isCollapsed && depth === 0 ? (
      <div>
        <Tooltip key={itemKey}>
          <Tooltip.Trigger>{<SideNavLink {...linkProps} />}</Tooltip.Trigger>
          <Tooltip.Content>{name}</Tooltip.Content>
        </Tooltip>
      </div>
    ) : (
      <SideNavLink {...linkProps} />
    )
  }
  //@ts-expect-error will implement later
  if (subType === "popover") {
    const options = items.map(
      ({ key, name, url, icon, render, action, items: subItems }) => {
        const display = (
          <SideNavItem
            key={key}
            {...{
              itemKey: key,
              name,
              url,
              icon,
              action,
              isCollapsed: false,
              isPopoverItem: true,
              selectedKey,
              render,
              items: subItems,
              subItemsType: subType,
              onItemClick,
              depth: 0,
              openInNewTab,
            }}
          />
        )
        return {
          key: key,
          display,
          selected: key === selectedKey,
        }
      },
    )

    const popoverOptions = options.reduce(
      (options, option) => ({
        ...options,
        [option.key]: option,
      }),
      {},
    )

    return (
      <DropdownMenu
        options={popoverOptions}
        onSelect={(key: string) => {
          const menuItem = items.find((item) => item.key === key)
          if (menuItem?.action && isFunction(onItemClick))
            onItemClick?.(menuItem)
        }}
        align="end"
      >
        {<SideNavLink {...linkProps} />}
      </DropdownMenu>
    )
  }

  const animationVariants = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
  }
  return (
    <>
      {<SideNavLink {...linkProps} isParent />}
      {/* {!isCollapsed && (isOpen || !collapsible) && (
        <div className="mt-1 space-y-2">
          {items.map(({ key, ...rest }) => (
            <SideNavItem
              {...rest}
              key={key}
              itemKey={key}
              isCollapsed={isCollapsed}
              subItemsType={rest.subItemsType || subItemsType}
              onItemClick={onItemClick}
              selectedKey={selectedKey}
              depth={depth + 1}
              collapsible={collapsible}
            />
          ))}
        </div> */}

      <motion.div
        initial={!isCollapsed && (isOpen || !collapsible) ? "open" : "closed"}
        animate={!isCollapsed && (isOpen || !collapsible) ? "open" : "closed"}
        variants={animationVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mt-1 space-y-2 overflow-hidden"
      >
        {items.map(({ key, ...rest }) => (
          <SideNavItem
            {...rest}
            key={key}
            itemKey={key}
            isCollapsed={isCollapsed}
            subItemsType={rest.subItemsType || subItemsType}
            onItemClick={onItemClick}
            selectedKey={selectedKey}
            depth={depth + 1}
            collapsible={collapsible}
          />
        ))}
      </motion.div>
      {/* )} */}
    </>
  )
}

export default function SideNav({
  isCollapsed,
  config,
  selectedKey,
  onItemClick,
}: SideNavProps) {
  return (
    <nav
      data-collapsed={isCollapsed}
      className={cn("group h-full", isCollapsed ? "items-center" : "")}
    >
      <ul
        className={cn("grid gap-1 h-full", isCollapsed ? "justify-center" : "")}
      >
        <li className="space-y-0.5">
          {config.map(({ key, ...rest }) => (
            <SideNavItem
              {...rest}
              itemKey={key}
              key={key}
              isCollapsed={isCollapsed}
              selectedKey={selectedKey}
              onItemClick={onItemClick}
            />
          ))}
        </li>
      </ul>
    </nav>
  )
}
