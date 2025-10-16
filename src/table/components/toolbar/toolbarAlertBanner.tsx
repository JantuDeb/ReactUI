// import { Fragment, useMemo } from "react"

// import { type TRowData, type TTableInstance } from "../../types"
// import { parseFromValuesOrFunc } from "../../utils/utils"
// import { getSelectAllHandler } from "../../utils/row.utils"
// import { Box } from "../shared/box"
// import { cn } from "../../../lib/utils"
// import { Button } from "../../../buttons/button"

// export interface ToolbarAlertBannerProps<TData extends TRowData> extends AlertProps {
//   stackAlertBanner?: boolean
//   table: TTableInstance<TData>
// }

// export const MRT_ToolbarAlertBanner = <TData extends TRowData>({
//   stackAlertBanner,
//   table,
//   ...rest
// }: ToolbarAlertBannerProps<TData>) => {
//   const {
//     getFilteredSelectedRowModel,
//     getCoreRowModel,
//     getState,
//     options: {
//       enableRowSelection,
//       enableSelectAll,
//       localization,
//       manualPagination,
//         // muiToolbarAlertBannerChipProps,
//         // muiToolbarAlertBannerProps,
//       positionToolbarAlertBanner,
//       renderToolbarAlertBannerContent,
//       rowCount,
//     },
//     refs: { tableWrapperRef },
//   } = table
//   const { density, grouping, rowSelection, showAlertBanner } = getState()

// //   const alertProps = {
// //     ...parseFromValuesOrFunc(muiToolbarAlertBannerProps, {
// //       table,
// //     }),
// //     ...rest,
// //   }

// //   const chipProps = parseFromValuesOrFunc(muiToolbarAlertBannerChipProps, {
// //     table,
// //   })

//   const totalRowCount = rowCount ?? getCoreRowModel().rows.length
//   const filteredRowCount = getFilteredSelectedRowModel().rows.length

//   const selectedRowCount = useMemo(
//     () => (manualPagination ? Object.values(rowSelection).filter(Boolean).length : filteredRowCount),
//     [rowSelection, totalRowCount, manualPagination, filteredRowCount],
//   )
//   const selectedAlert =
//     selectedRowCount > 0 ? (
//       <div className="flex items-center gap-4">
//         {localization.selectedCountOfRowCountRowsSelected
//           ?.replace("{selectedCount}", selectedRowCount.toLocaleString(localization.language))
//           ?.replace("{rowCount}", totalRowCount.toLocaleString(localization.language))}
//         <Button onClick={() => getSelectAllHandler({ table })(false, true)} size="sm">
//           {localization.clearSelection || "Clear Selection"}
//         </Button>
//       </div>
//     ) : null

//   const groupedAlert =
//     grouping.length > 0 ? (
//       <span>
//         {localization.groupedBy}{" "}
//         {grouping.map((columnId, index) => (
//           <Fragment key={`${index}-${columnId}`}>
//             {index > 0 ? localization.thenBy : ""}
//             <Chip
//               label={table.getColumn(columnId).columnDef.header}
//               onDelete={() => table.getColumn(columnId).toggleGrouping()}
//               {...chipProps}
//             />
//           </Fragment>
//         ))}
//       </span>
//     ) : null

//   return (
//     <Collapse in={showAlertBanner || !!selectedAlert || !!groupedAlert} timeout={stackAlertBanner ? 200 : 0}>
//       <Alert
//         color="info"
//         icon={false}
//         {...alertProps}
//         sx={(theme) => ({
//         //   "& .MuiAlert-message": {
//         //     maxWidth: `calc(${tablePaperRef.current?.clientWidth ?? 360}px - 1rem)`,
//         //     width: "100%",
//         //   },
//           borderRadius: 0,
//           fontSize: "1rem",
//           left: 0,
//           mb: stackAlertBanner ? 0 : positionToolbarAlertBanner === "bottom" ? "-1rem" : undefined,
//           p: 0,
//           position: "relative",
//           right: 0,
//           top: 0,
//           width: "100%",
//           zIndex: 2,
//           ...(parseFromValuesOrFunc(alertProps?.sx, theme) as any),
//         })}
//       >
//         {renderToolbarAlertBannerContent?.({
//           groupedAlert,
//           selectedAlert,
//           table,
//         }) ?? (
//           <>
//             {alertProps?.title && <AlertTitle>{alertProps.title}</AlertTitle>}
//             <div
//               className={cn(
//                 "p-2",
//                 positionToolbarAlertBanner !== "head-overlay"
//                   ? "px-4 py-2"
//                   : density === "spacious"
//                     ? "px-5 py-3"
//                     : density === "comfortable"
//                       ? "px-3 py-2"
//                       : "px-2 py-1",
//               )}
//             >
//               {alertProps?.children}
//               {alertProps?.children && (selectedAlert || groupedAlert) && <br />}
//               <Box className="flex">
//                 {enableRowSelection && enableSelectAll && positionToolbarAlertBanner === "head-overlay" && (
//                   <MRT_SelectCheckbox table={table} />
//                 )}
//                 {selectedAlert}
//               </Box>
//               {selectedAlert && groupedAlert && <br />}
//               {groupedAlert}
//             </div>
//           </>
//         )}
//       </Alert>
//     </Collapse>
//   )
// }
