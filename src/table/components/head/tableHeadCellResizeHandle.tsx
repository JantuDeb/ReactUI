// /* eslint-disable jsx-a11y/no-static-element-interactions */
// import { TableHeadCellProps } from "@common/table/types"
// import React from "react"

// export default function TableHeadCellResizeHandle({
//   table,
//   header,
// }: TableHeadCellProps) {
//   const {
//     getState,
//     options: { columnResizeMode },
//   } = table
//   const { column } = header

//   const handler = header.getResizeHandler()
//   return (
//     <div
//       className="cursor-col-resize z-20 hidden group-hover:block select-none absolute -right-0.5 w-2 top-0 bottom-0"
//       onClick={(e) => {
//         // this is to prevent sort click
//         e.stopPropagation()
//       }}
//       id="col-resize"
//       onMouseDown={handler}
//       onTouchStart={handler}
//       style={{
//         transform:
//           column.getIsResizing() && columnResizeMode === "onEnd"
//             ? `translateX(${
//                 1 * (getState().columnSizingInfo.deltaOffset ?? 0)
//               }px)`
//             : undefined,
//       }}
//     >
//       <div
//         className="select-none rounded-md hover:bg-accent bg-secondary w-1 h-full touch-none"
//         style={{
//           transform: "translateX(4px)",
//           transition: column.getIsResizing()
//             ? undefined
//             : "all 150ms ease-in-out",
//         }}
//       />
//     </div>
//   )
// }
