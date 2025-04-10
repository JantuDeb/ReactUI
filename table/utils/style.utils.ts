import { type CSSProperties } from "react"
import {
  type TColumn,
  type THeader,
  type TRowData,
  type TTableInstance,
  // type TTableOptions,
  // type TTheme,
} from "../types"
// import { parseFromValuesOrFunc } from "./utils"

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, "_")

export const commonCellBeforeAfterStyles = {
  content: '""',
  height: "100%",
  left: 0,
  position: "absolute",
  top: 0,
  width: "100%",
  zIndex: -1,
}

export const getCommonPinnedCellStyles = <TData extends TRowData>({
  column,
  table,
}: // theme,
{
  column?: TColumn<TData>
  table: TTableInstance<TData>
  // theme: Theme
}) => {
  // const { baseBackgroundColor } = table.options.mrtTheme
  const isPinned = column?.getIsPinned()

  return {
    backgroundColor: "var(--secondary)",
    // boxShadow: column
    //   ? isPinned === "left" && column.getIsLastColumn(isPinned)
    //     ? `-4px 0 4px -4px var(--primary, 0.5)} inset`
    //     : isPinned === "right" && column.getIsFirstColumn(isPinned)
    //     ? `4px 0 4px -4px var(--primary, 0.5) inset`
    //     : undefined
    //   : undefined,
    ...commonCellBeforeAfterStyles,
  }
}

export const getCommonCellStyles = <TData extends TRowData>({
  column,
  header,
  table,
}: // tableCellProps,
// theme,
{
  column: TColumn<TData>
  header?: THeader<TData>
  table: TTableInstance<TData>
  // tableCellProps: TTableCellProps
  // theme: Theme
}) => {
  const {
    getState,
    options: { enableColumnVirtualization, layoutMode },
  } = table
  const { draggingColumn } = getState()
  const { columnDef } = column
  const { columnDefType } = columnDef

  const isColumnPinned =
    columnDef.columnDefType !== "group" && column.getIsPinned()

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--${header ? "header" : "col"}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--${header ? "header" : "col"}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px)`,
  }

  if (layoutMode === "grid") {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--${header ? "header" : "col"}-${parseCSSVarId(
            header?.id ?? column.id,
          )}-size)`
    } 0 auto`
  } else if (layoutMode === "grid-no-grow") {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
  }

  const pinnedStyles = isColumnPinned
    ? {
        ...getCommonPinnedCellStyles({ column, table }),
        left:
          isColumnPinned === "left"
            ? `${column.getStart("left")}px`
            : undefined,
        opacity: 0.97,
        position: "sticky",
        right:
          isColumnPinned === "right"
            ? `${column.getAfter("right")}px`
            : undefined,
      }
    : {}

  return {
    backgroundColor: "inherit",
    backgroundImage: "inherit",
    display: layoutMode?.startsWith("grid") ? "flex" : undefined,
    justifyContent:
      columnDefType === "group"
        ? "center"
        : layoutMode?.startsWith("grid")
        ? "left" //tableCellProps.align
        : undefined,
    opacity:
      table.getState().draggingColumn?.id === column.id ||
      table.getState().hoveredColumn?.id === column.id
        ? 0.5
        : 1,
    transition: enableColumnVirtualization
      ? "none"
      : `150ms ease-in-out`,
    zIndex:
      column.getIsResizing() || draggingColumn?.id === column.id
        ? 2
        : columnDefType !== "group" && isColumnPinned
        ? 1
        : 0,
    // "&:focus-visible": {
    //   outline: `2px solid var(--border)`,
    //   outlineOffset: "-2px",
    // },
    ...pinnedStyles,
    ...widthStyles,
  }
}

export const getCommonToolbarStyles = <TData extends TRowData>({
  table,
}: {
  table: TTableInstance<TData>
  // theme: Theme
}) => ({
  alignItems: "flex-start",
  backgroundColor: "var(--background)", //table.options.mrtTheme.baseBackgroundColor,
  display: "grid",
  flexWrap: "wrap-reverse",
  minHeight: "3.5rem",
  overflow: "hidden",
  position: "relative",
  transition: "all 150ms ease-in-out",
  zIndex: 1,
})

// export const flipIconStyles = (theme: Theme) =>
//   theme.direction === "rtl" ? { style: { transform: "scaleX(-1)" } } : undefined

// export const getCommonTooltipProps = (
//   placement?: TooltipProps["placement"],
// ): Partial<TooltipProps> => ({
//   disableInteractive: true,
//   enterDelay: 1000,
//   enterNextDelay: 1000,
//   placement,
// })
