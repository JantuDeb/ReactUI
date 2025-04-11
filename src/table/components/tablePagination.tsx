// import Pagination from "@common/pagination/pagination"


// const TablePagination = ({ table }) => {
//   const {
//     getPrePaginationRowModel,
//     getState,
//     setPageIndex,
//     // setPageSize,
//     options: {
//       pagination: { rowCount, onPageChange },
//       manualPagination,
//     },
//   } = table

//   const {
//     pagination: { pageSize = 10, pageIndex = 0 },
//   } = getState()

//   const totalCount = rowCount ?? getPrePaginationRowModel().rows.length
//   return (
//     <Pagination
//       onChangePage={(pageIndex: number) => {
//         setPageIndex(pageIndex)
//         if (manualPagination && onPageChange) onPageChange(pageIndex)
//       }}
//       totalCount={totalCount}
//       pageSize={pageSize}
//       currentPageIndex={pageIndex}
//     />
//   )
// }

// export default TablePagination
