// import ActionMenu, { Action } from "@common/dropdowns/actionMenu"
// import { TableHeadCellProps } from "@common/table/types"
// import React from "react"

// export const ColumnActionMenu = ({ table, header }: TableHeadCellProps) => {
//   const {
//     options: { enablePinning, enableColumnResizing },
//     setColumnSizingInfo,
//   } = table
//   const { column } = header
//   const { columnSizing } = table.getState()
//   const isColumnResized = enableColumnResizing && !!columnSizing?.[column.id]
//   const actions = {
//     ...(enablePinning
//       ? {
//           pin_to_left: {
//             key: "pin_to_left",
//             display: "Pin to Left",
//             disabled: column.getIsPinned() === "left" || !column.getCanPin(),
//           },
//           pin_to_right: {
//             key: "pin_to_right",
//             display: "Pin to Right",
//             disabled: column.getIsPinned() === "right" || !column.getCanPin(),
//           },
//           unpin: {
//             key: "unpin",
//             display: "Unpin",
//             disabled: !column.getIsPinned(),
//           },
//           reset_size: {
//             key: "reset_size",
//             display: "Reset Size",
//             disabled: !isColumnResized,
//           },
//         }
//       : {}),
//   }

//   const handlePinColumn = (pinDirection: "left" | "right" | false) => {
//     column.pin(pinDirection)
//   }

//   const handleResetResize = () => {
//     setColumnSizingInfo((old) => ({
//       ...old,
//       isResizingColumn: false,
//     }))
//     column.resetSize()
//   }

//   const handleActionClick = (key: string) => {
//     switch (key) {
//       case "pin_to_left":
//         handlePinColumn("left")
//         break
//       case "pin_to_right":
//         handlePinColumn("right")
//         break
//       case "unpin":
//         handlePinColumn(false)
//         break
//       case "reset_size":
//         handleResetResize()
//         break

//       default:
//         break
//     }
//   }
//   return (
//     <div className="invisible group-hover:visible">
//       <ActionMenu
//         actions={actions}
//         showIconMenu={false}
//         onActionClick={handleActionClick}
//         showIconMenuOnHover
//         strategy="fixed"
//         portal
//       />
//     </div>
//   )
// }
