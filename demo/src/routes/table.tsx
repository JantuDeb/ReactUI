import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@jantudeb/react-ui"

type Learner = {
  name: string
  className: string
  subject: string
  progress: number
}

const data: Learner[] = [
  { name: "Aarav Sharma", className: "Class 8", subject: "Mathematics", progress: 82 },
  { name: "Diya Patel", className: "Class 9", subject: "Science", progress: 94 },
  { name: "Kabir Das", className: "Class 7", subject: "English", progress: 67 },
  { name: "Meera Nair", className: "Class 10", subject: "Mathematics", progress: 88 },
  { name: "Rohan Singh", className: "Class 8", subject: "Social Science", progress: 73 },
]

const columns: ColumnDef<Learner>[] = [
  { accessorKey: "name", header: "Learner" },
  { accessorKey: "className", header: "Class" },
  { accessorKey: "subject", header: "Subject" },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: (context) => <span className="progress-value">{context.getValue<number>()}%</span>,
  },
]

export function TablePage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="page-stack">
      <PageHeader
        title="TanStack Table"
        subtitle="A sortable table example built with @tanstack/react-table."
      />
      <Card>
        <CardHeader>
          <CardTitle>Learner progress</CardTitle>
          <CardDescription>Select a column heading to sort the sample data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-scroll">
            <table className="demo-table">
              <thead>
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => {
                      const sorted = header.column.getIsSorted()
                      return (
                        <th key={header.id}>
                          {header.isPlaceholder ? null : (
                            <button
                              type="button"
                              className="sort-button"
                              onClick={header.column.getToggleSortingHandler()}
                              aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <span aria-hidden="true">{sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}</span>
                            </button>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
