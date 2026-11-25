// import { joinClassNames } from "../../lib/util"
// import FooterLink from "../components/footer/footerLink"
// import { FooterLinkProps, RTable } from "../types"

// type TableFooterProps = { table: RTable } & FooterLinkProps

// const TableFooter = ({ table, ...rest }: TableFooterProps) => {
//   const colSpan = table.getVisibleLeafColumns()?.length
//   const isVirtual = table.options.enableRowVirtualization
//   return (
//     <tfoot>
//       <tr
//         className={joinClassNames(
//           isVirtual ? "flex justify-center" : "table-row",
//         )}
//       >
//         <td colSpan={colSpan} className="table-cell text-center">
//           <FooterLink {...rest} />
//         </td>
//       </tr>
//     </tfoot>
//   )
// }

// export default TableFooter
