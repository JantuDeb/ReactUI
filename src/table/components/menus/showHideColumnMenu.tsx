import { ReactNode, useMemo, useState } from "react"

import { type TColumn, type TRowData, type TTableInstance } from "../../types"
import { getDefaultColumnOrderIds } from "../../utils/displayColumn.utils"
import DropdownMenu from "../../../menus/dropdown-menu"
import { MenuOption, MenuOptions } from "../../../types/menu-option"

export interface ShowHideColumnsMenuProps<TData extends TRowData> {
  //   anchorEl: HTMLElement | null
  isSubMenu?: boolean
  //   setAnchorEl: (anchorEl: HTMLElement | null) => void
  table: TTableInstance<TData>
  children: ReactNode
}

export const ShowHideColumnsMenu = <TData extends TRowData>({
  children,
  table,
  ...rest
}: ShowHideColumnsMenuProps<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
      //   mrtTheme: { menuBackgroundColor },
    },
  } = table
  const { columnOrder, columnPinning, density } = getState()

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value))
  }

  const allColumns = useMemo(() => {
    const columns = getAllColumns()
    if (columnOrder.length > 0 && !columns.some((col) => col.columnDef.columnDefType === "group")) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) => getCenterLeafColumns().find((col) => col?.id === colId)),
        ...getRightLeafColumns(),
      ].filter(Boolean)
    }
    return columns
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as TColumn<TData>[]

  const isNestedColumns = allColumns.some((col) => col.columnDef.columnDefType === "group")

  const hasColumnOrderChanged = useMemo(
    () =>
      columnOrder.length !== initialState.columnOrder.length ||
      !columnOrder.every((column, index) => column === initialState.columnOrder[index]),

    [columnOrder, initialState.columnOrder],
  )

  // const [hoveredColumn, setHoveredColumn] = useState<TColumn<TData> | null>(null)

  const buildOptions = (): MenuOptions => {
    const controlOptions: MenuOption[] = []

    if (enableHiding) {
      controlOptions.push(
        {
          id: "hideAll",
          type: "item",
          label: localization.hideAll || "Hide All",
          disabled: !table.getIsSomeColumnsVisible(),
        },
        {
          id: "showAll",
          type: "item",
          label: localization.showAll || "Show All",
          disabled: table.getIsAllColumnsVisible(),
        },
      )
    }

    if (enableColumnOrdering) {
      controlOptions.push({
        id: "resetOrder",
        type: "item",
        label: localization.resetOrder || "Reset Column Order",
        disabled: !hasColumnOrderChanged,
      })
    }

    if (enableColumnPinning) {
      controlOptions.push({
        id: "unpinAll",
        type: "item",
        label: localization.unpinAll || "Unpin All Columns",
        disabled: !table.getIsSomeColumnsPinned(),
      })
    }

    const columnItems: MenuOption[] = allColumns.map((column) => ({
      id: column.id,
      type: "checkbox",
      label: column.columnDef.header,
      checked: column.getIsVisible(),
      disabled: column.columnDef.enableHiding === false,
    }))

    return [
      ...controlOptions,
      { id: "separator-1", type: "separator" },
      ...columnItems,
      // { id: "group-columns", type: "group", label: localization.columns, options: columnItems },
    ]
  }

  const handleSelect = (id: string) => {
    if (id === "hideAll") handleToggleAllColumns(false)
    else if (id === "showAll") handleToggleAllColumns(true)
    else if (id === "resetOrder") table.setColumnOrder(getDefaultColumnOrderIds(table.options, true))
    else if (id === "unpinAll") table.resetColumnPinning(true)
    else {
      const column = allColumns.find((c) => c.id === id)
      column?.toggleVisibility(!column.getIsVisible())
    }
  }

  return (
    <DropdownMenu
      align="end"
      onSelect={handleSelect}
      width="fit"
      // open={!!anchorEl}
      // onClose={() => setAnchorEl(null)}
      // anchorEl={anchorEl}
      options={buildOptions()}
      portal={false}
    >
      {children}
    </DropdownMenu>
  )

  // return (
  //   <Menu
  //     MenuListProps={{
  //       dense: density === "compact",
  //       sx: {
  //         backgroundColor: menuBackgroundColor,
  //       },
  //     }}
  //     anchorEl={anchorEl}
  //     disableScrollLock
  //     onClose={() => setAnchorEl(null)}
  //     open={!!anchorEl}
  //     {...rest}
  //   >
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         p: "0.5rem",
  //         pt: 0,
  //       }}
  //     >
  //       {enableHiding && (
  //         <Button disabled={!getIsSomeColumnsVisible()} onClick={() => handleToggleAllColumns(false)}>
  //           {localization.hideAll}
  //         </Button>
  //       )}
  //       {enableColumnOrdering && (
  //         <Button
  //           onClick={() => table.setColumnOrder(getDefaultColumnOrderIds(table.options, true))}
  //           disabled={!hasColumnOrderChanged}
  //         >
  //           {localization.resetOrder}
  //         </Button>
  //       )}
  //       {enableColumnPinning && (
  //         <Button disabled={!getIsSomeColumnsPinned()} onClick={() => table.resetColumnPinning(true)}>
  //           {localization.unpinAll}
  //         </Button>
  //       )}
  //       {enableHiding && (
  //         <Button disabled={getIsAllColumnsVisible()} onClick={() => handleToggleAllColumns(true)}>
  //           {localization.showAll}
  //         </Button>
  //       )}
  //     </Box>
  //     <Divider />
  //     {allColumns.map((column, index) => (
  //       <MRT_ShowHideColumnsMenuItems
  //         allColumns={allColumns}
  //         column={column}
  //         hoveredColumn={hoveredColumn}
  //         isNestedColumns={isNestedColumns}
  //         key={`${index}-${column.id}`}
  //         setHoveredColumn={setHoveredColumn}
  //         table={table}
  //       />
  //     ))}
  //   </Menu>
  // )
}
