// import useDebouncedCallback from "@common/hooks/useDebounceCallback"
// import { isEmpty, isNullOrEmpty } from "@common/lib/util"
// import SearchBar from "@common/searchBar"
// import Svg from "@common/svg"
// import ShowHideColumnMenu from "@common/table/components/menus/showHideColumnMenu"
// import { TableHeadToolbarProps } from "@common/table/types"
// import Tag from "@common/tags/tag"
// import PopoverMenuStyled from "@common/v2/dropdowns/popoverMenu"
// import React, { useState } from "react"

// const TableHeadToolbar = ({
//   table,
//   commonActions,
//   onSearch,
//   multiSelectActions,
//   onMultiSelectActionClick,
//   hasToolbarItems,
//   hasToolbarRightItems,
// }: TableHeadToolbarProps) => {
//   const {
//     options: {
//       enableColumnVisibility,
//       enableGlobalFilter,
//       manualSearch,
//       enableRowSelection,
//       showToolbar,
//     },
//     setGlobalFilter,
//     refs: { searchInputRef },
//     getSelectedRowModel,
//   } = table

//   const debounceSearch = useDebouncedCallback(onSearch, 500)
//   const handleSearch = (text: string) => {
//     searchInputRef.current = text
//     if (manualSearch) {
//       debounceSearch?.(text)
//     } else setGlobalFilter(text)
//   }
//   const selectedRowIds = enableRowSelection
//     ? getSelectedRowModel().flatRows.map((row) => row.original.id)
//     : []

//   if (hasToolbarItems)
//     return (
//       <div
//         className="flex justify-between bg-background rounded-t-md p-1 " // take in account space reserved for edit options
//         ref={table.refs.topToolbarRef}
//       >
//         {enableGlobalFilter ? (
//           <div className="border  rounded-md px-2">
//             <SearchBar
//               onChange={handleSearch}
//               onClearInput={() => setGlobalFilter(undefined)}
//             />
//           </div>
//         ) : (
//           <div></div>
//         )}

//         {hasToolbarRightItems && (
//           <div className="flex items-center gap-2 mx-7">
//             {selectedRowIds.length > 0 && (
//               <Tag color="gray">
//                 {selectedRowIds.length} <span className="px-2">Selected</span>
//               </Tag>
//             )}
//             <MultiSelectActions
//               {...{
//                 multiSelectActions,
//                 selectedRowIds,
//                 onMultiSelectActionClick,
//               }}
//             />
//             <CommonActions commonActions={commonActions} />
//             {enableColumnVisibility && showToolbar && (
//               <ShowHideColumnMenu table={table} />
//             )}
//           </div>
//         )}
//       </div>
//     )
//   return <></>
// }

// function CommonActions({
//   commonActions,
// }: Pick<TableHeadToolbarProps, "commonActions">) {
//   return (
//     <>
//       {Object.keys(commonActions || {}).map((key) => {
//         const action = commonActions[key]
//         return <div key={action.key}>{action.display}</div>
//       })}
//     </>
//   )
// }

// function MultiSelectActions({
//   multiSelectActions,
//   selectedRowIds,
//   onMultiSelectActionClick,
// }: Pick<
//   TableHeadToolbarProps,
//   "multiSelectActions" | "onMultiSelectActionClick"
// > & {
//   selectedRowIds: Array<string>
// }) {
//   const [isOptionClicked, setIsOptionClicked] = useState(false) // special handling for refresh button

//   if (
//     isNullOrEmpty(multiSelectActions) ||
//     (isEmpty(selectedRowIds) && !isOptionClicked)
//   )
//     return <></>

//   const handleOptionClick = (key: string) => {
//     if (!isOptionClicked) setIsOptionClicked(true)
//     onMultiSelectActionClick?.(key, selectedRowIds)
//   }
//   const options = Object.entries(multiSelectActions || {}).reduce(
//     (acc, [key, option]) => ({
//       ...acc,
//       [key]: option,
//     }),
//     {},
//   )
//   return (
//     <div className="list-button px-2 py-1">
//       <PopoverMenuStyled options={options} onSelect={handleOptionClick}>
//         Actions
//         <Svg
//           name="arrow-down-menu"
//           classes="w-5 h-5 ml-2 -mr-1"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//           stroke="none"
//         />
//       </PopoverMenuStyled>
//     </div>
//   )
// }

// export default TableHeadToolbar
