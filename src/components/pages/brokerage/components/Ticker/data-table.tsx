"use client"

import React, { useState } from "react"
import { z } from "zod"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const schema = z.object({
  id: z.number(),
  scriptName: z.string(),
  symbol: z.string(),
  segment: z.string(),
  type: z.enum(["%", "₹"]),
  adminValue: z.number(),
  masterValue: z.number(),
})

type DataType = z.infer<typeof schema>

const columns: ColumnDef<DataType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    accessorKey: "scriptName",
    header: "Name",
    cell: ({ row }) => row.original.scriptName,
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => row.original.symbol,
  },
  {
    accessorKey: "segment",
    header: "Segment",
    cell: ({ row }) => row.original.segment,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.original.type,
  },
  {
    accessorKey: "adminValue",
    header: "Admin Value",
    cell: ({ row }) => row.original.adminValue.toFixed(2),
  },
  {
    accessorKey: "masterValue",
    header: "Master Value",
    cell: ({ row }) => row.original.masterValue.toFixed(2),
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) =>
      (row.original.adminValue + row.original.masterValue).toFixed(2),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(data)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(data.id)}
          >
            Delete
          </Button>
        </div>
      )
    },
  },
]

export default function EditableTable() {
  const [data, setData] = useState<DataType[]>([
    {
      id: 1,
      scriptName: "ABC",
      symbol: "XYZ",
      segment: "EQ",
      type: "%",
      adminValue: 100,
      masterValue: 200,
    },
    {
      id: 2,
      scriptName: "DEF",
      symbol: "LMN",
      segment: "FO",
      type: "₹",
      adminValue: 300,
      masterValue: 150,
    },
  ])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  })

  // Single delete
  function handleDelete(id: number) {
    setData(prev => prev.filter(item => item.id !== id))
  }

  // Edit script name only for simplicity
  function handleEdit(row: DataType) {
    const updated = prompt("Edit Script Name", row.scriptName)
    if (updated) {
      setData(prev =>
        prev.map(d =>
          d.id === row.id ? { ...d, scriptName: updated } : d
        )
      )
    }
  }

  // Add new row
  function handleAdd() {
    const nextId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
    const newRow: DataType = {
      id: nextId,
      scriptName: "New Script",
      symbol: "NEW",
      segment: "EQ",
      type: "%",
      adminValue: 0,
      masterValue: 0,
    }
    setData(prev => [...prev, newRow])
  }

  // Bulk delete
  function handleBulkDelete() {
    const idsToDelete = table.getSelectedRowModel().rows.map(r => r.original.id)
    setData(prev => prev.filter(row => !idsToDelete.includes(row.id)))
    setRowSelection({})
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={handleAdd}>Add New</Button>
        <Button
          onClick={handleBulkDelete}
          variant="destructive"
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          Delete Selected
        </Button>
      </div>

      <table className="w-full text-sm border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="text-left p-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

// "use client"

// import * as React from "react"
// import { z } from "zod"
// import {
//   type UniqueIdentifier,
// } from "@dnd-kit/core"
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import {
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
// } from "@tabler/icons-react"
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   type SortingState,
//   type VisibilityState,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   useReactTable,
//   flexRender,
// } from "@tanstack/react-table"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Tabs,
//   TabsContent,
// } from "@/components/ui/tabs"

// // Schema
// export const schema = z.object({
//   id: z.number(),
//   scriptName: z.string(),
//   symbol: z.string(),
//   segment: z.string(),
//   type: z.enum(["%", "₹"]),
//   adminValue: z.number(),
//   masterValue: z.number(),
// })

// // Columns
// const columns: ColumnDef<z.infer<typeof schema>>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       </div>
//     ),
//   },
//   {
//     accessorKey: "scriptName",
//     header: "Name",
//     cell: ({ row }) => row.original.scriptName,
//   },
//   {
//     accessorKey: "symbol",
//     header: "Symbol",
//     cell: ({ row }) => row.original.symbol,
//   },
//   {
//     accessorKey: "segment",
//     header: "Segment",
//     cell: ({ row }) => row.original.segment,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//     cell: ({ row }) => row.original.type,
//   },
//   {
//     accessorKey: "adminValue",
//     header: "Admin Value",
//     cell: ({ row }) => row.original.adminValue.toFixed(2),
//   },
//   {
//     accessorKey: "masterValue",
//     header: "Master Value",
//     cell: ({ row }) => row.original.masterValue.toFixed(2),
//   },
//   {
//     id: "total",
//     header: "Total",
//     cell: ({ row }) =>
//       (row.original.adminValue + row.original.masterValue).toFixed(2),
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <div className="flex gap-2">
//         <Button variant="outline" size="sm">Edit</Button>
//         <Button variant="destructive" size="sm">Delete</Button>
//       </div>
//     ),
//   },
// ]

// // DataTable Component
// export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
//   const [data] = React.useState(() => initialData)
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

//   const dataIds = React.useMemo<UniqueIdentifier[]>(
//     () => data?.map(({ id }) => id) || [],
//     [data]
//   )

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination,
//     },
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   return (
//     <Tabs defaultValue="outline" className="w-full flex-col gap-6">
//       <TabsContent value="outline" className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
//         <div className="overflow-hidden rounded-lg border">
//           <Table>
//             <TableHeader className="sticky top-0 z-10 bg-muted">
//               {table.getHeaderGroups().map(headerGroup => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map(header => (
//                     <TableHead key={header.id} colSpan={header.colSpan}>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
//                   {table.getRowModel().rows.map(row => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                       {row.getVisibleCells().map(cell => (
//                         <TableCell key={cell.id}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </SortableContext>
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="flex items-center justify-between px-4">
//           <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
//             {table.getFilteredSelectedRowModel().rows.length} of{" "}
//             {table.getFilteredRowModel().rows.length} row(s) selected.
//           </div>

//           <div className="flex w-full items-center gap-8 lg:w-fit">
//             <div className="hidden items-center gap-2 lg:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Rows per page
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value) => table.setPageSize(Number(value))}
//               >
//                 <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                   <SelectValue placeholder={table.getState().pagination.pageSize} />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[10, 20, 30, 40, 50].map(pageSize => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="text-sm font-medium">
//               Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//             </div>

//             <div className="ml-auto flex items-center gap-2 lg:ml-0">
//               <Button
//                 variant="outline"
//                 className="hidden h-8 w-8 p-0 lg:flex"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 <span className="sr-only">First</span>
//                 <IconChevronsLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 <span className="sr-only">Previous</span>
//                 <IconChevronLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 <span className="sr-only">Next</span>
//                 <IconChevronRight />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="hidden size-8 lg:flex"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}
//               >
//                 <span className="sr-only">Last</span>
//                 <IconChevronsRight />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </TabsContent>

//       <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
//       </TabsContent>

//       <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
//       </TabsContent>

//       <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
//       </TabsContent>
//     </Tabs>
//   )
// }


// "use client"

// import * as React from "react"
// import {
//     type UniqueIdentifier,
// } from "@dnd-kit/core"
// import {
//     SortableContext,
//     verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import {
//     IconChevronLeft,
//     IconChevronRight,
//     IconChevronsLeft,
//     IconChevronsRight,
// } from "@tabler/icons-react"
// import {
//     type ColumnDef,
//     type ColumnFiltersState,
//     flexRender,
//     getCoreRowModel,
//     getFacetedRowModel,
//     getFacetedUniqueValues,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     type SortingState,
//     useReactTable,
//     type VisibilityState,
// } from "@tanstack/react-table"
// import { z } from "zod"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
// import {
//     Tabs,
//     TabsContent,
// } from "@/components/ui/tabs"

// export const schema = z.object({
//     id: z.number(),
//     scriptName: z.string(),
//     symbol: z.string(),
//     segment: z.string(),
//     type: z.enum(["%", "₹"]),
//     adminValue: z.number(),
//     masterValue: z.number(),
// })



// const columns: ColumnDef<z.infer<typeof schema>>[] = [
//     {
//         id: "select",
//         header: ({ table }) => (
//             <div className="flex items-center justify-center">
//                 <Checkbox
//                     checked={
//                         table.getIsAllPageRowsSelected() ||
//                         (table.getIsSomePageRowsSelected() && "indeterminate")
//                     }
//                     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//                     aria-label="Select all"
//                 />
//             </div>
//         ),
//         cell: ({ row }) => (
//             <div className="flex items-center justify-center">
//                 <Checkbox
//                     checked={row.getIsSelected()}
//                     onCheckedChange={(value) => row.toggleSelected(!!value)}
//                     aria-label="Select row"
//                 />
//             </div>
//         ),
//     },
//     {
//         accessorKey: "scriptName",
//         header: "Name",
//         cell: ({ row }) => row.original.scriptName,
//     },
//     {
//         accessorKey: "symbol",
//         header: "Symbol",
//         cell: ({ row }) => row.original.symbol,
//     },
//       {
//     accessorKey: "segment",
//     header: "Segment",
//     cell: ({ row }) => row.original.segment,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//     cell: ({ row }) => row.original.type === "%" ? "%" : "₹",
//   },
//   {
//     accessorKey: "adminValue",
//     header: "Admin Value",
//     cell: ({ row }) => row.original.adminValue.toFixed(2),
//   },
//   {
//     accessorKey: "masterValue",
//     header: "Master Value",
//     cell: ({ row }) => row.original.masterValue.toFixed(2),
//   },
//   {
//     id: "total",
//     header: "Total",
//     cell: ({ row }) =>
//       (row.original.adminValue + row.original.masterValue).toFixed(2),
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <div className="flex gap-2">
//         <Button variant="outline" size="sm">Edit</Button>
//         <Button variant="destructive" size="sm">Delete</Button>
//       </div>
//     ),
//   },

// ]

// export function DataTable({
//     data: initialData,
// }: {
//     data: z.infer<typeof schema>[]
// }) {
//     const [data] = React.useState(() => initialData)
//     const [rowSelection, setRowSelection] = React.useState({})
//     const [columnVisibility, setColumnVisibility] =
//         React.useState<VisibilityState>({})
//     const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//         []
//     )
//     const [sorting, setSorting] = React.useState<SortingState>([])
//     const [pagination, setPagination] = React.useState({
//         pageIndex: 0,
//         pageSize: 10,
//     })

//     const dataIds = React.useMemo<UniqueIdentifier[]>(
//         () => data?.map(({ id }) => id) || [],
//         [data]
//     )

//     const table = useReactTable({
//         data,
//         columns,
//         state: {
//             sorting,
//             columnVisibility,
//             rowSelection,
//             columnFilters,
//             pagination,
//         },
//         getRowId: (row) => row.id.toString(),
//         enableRowSelection: true,
//         onRowSelectionChange: setRowSelection,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         onColumnVisibilityChange: setColumnVisibility,
//         onPaginationChange: setPagination,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFacetedRowModel: getFacetedRowModel(),
//         getFacetedUniqueValues: getFacetedUniqueValues(),
//     })


//     return (
//         <Tabs
//             defaultValue="outline"
//             className="w-full flex-col justify-start gap-6"
//         >
//             <TabsContent
//                 value="outline"
//                 className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
//             >
//                 <div className="overflow-hidden rounded-lg border">
//                     <Table>
//                         <TableHeader className="bg-muted sticky top-0 z-10">
//                             {table.getHeaderGroups().map((headerGroup) => (
//                                 <TableRow key={headerGroup.id}>
//                                     {headerGroup.headers.map((header) => {
//                                         return (
//                                             <TableHead key={header.id} colSpan={header.colSpan}>
//                                                 {header.isPlaceholder
//                                                     ? null
//                                                     : flexRender(
//                                                         header.column.columnDef.header,
//                                                         header.getContext()
//                                                     )}
//                                             </TableHead>
//                                         )
//                                     })}
//                                 </TableRow>
//                             ))}
//                         </TableHeader>
//                         <TableBody className="**:data-[slot=table-cell]:first:w-8">
//                             {table.getRowModel().rows?.length ? (
//                                 <SortableContext
//                                     items={dataIds}
//                                     strategy={verticalListSortingStrategy}
//                                 >
//                                     {table.getRowModel().rows.map((row) => (
//                                         <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                                             {row.getVisibleCells().map((cell) => (
//                                                 <TableCell key={cell.id}>
//                                                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}
//                                 </SortableContext>
//                             ) : (
//                                 <TableRow>
//                                     <TableCell
//                                         colSpan={columns.length}
//                                         className="h-24 text-center"
//                                     >
//                                         No results.
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </div>
//                 <div className="flex items-center justify-between px-4">
//                     <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
//                         {table.getFilteredSelectedRowModel().rows.length} of{" "}
//                         {table.getFilteredRowModel().rows.length} row(s) selected.
//                     </div>
//                     <div className="flex w-full items-center gap-8 lg:w-fit">
//                         <div className="hidden items-center gap-2 lg:flex">
//                             <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                                 Rows per page
//                             </Label>
//                             <Select
//                                 value={`${table.getState().pagination.pageSize}`}
//                                 onValueChange={(value) => {
//                                     table.setPageSize(Number(value))
//                                 }}
//                             >
//                                 <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                                     <SelectValue
//                                         placeholder={table.getState().pagination.pageSize}
//                                     />
//                                 </SelectTrigger>
//                                 <SelectContent side="top">
//                                     {[10, 20, 30, 40, 50].map((pageSize) => (
//                                         <SelectItem key={pageSize} value={`${pageSize}`}>
//                                             {pageSize}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="flex w-fit items-center justify-center text-sm font-medium">
//                             Page {table.getState().pagination.pageIndex + 1} of{" "}
//                             {table.getPageCount()}
//                         </div>
//                         <div className="ml-auto flex items-center gap-2 lg:ml-0">
//                             <Button
//                                 variant="outline"
//                                 className="hidden h-8 w-8 p-0 lg:flex"
//                                 onClick={() => table.setPageIndex(0)}
//                                 disabled={!table.getCanPreviousPage()}
//                             >
//                                 <span className="sr-only">Go to first page</span>
//                                 <IconChevronsLeft />
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 className="size-8"
//                                 size="icon"
//                                 onClick={() => table.previousPage()}
//                                 disabled={!table.getCanPreviousPage()}
//                             >
//                                 <span className="sr-only">Go to previous page</span>
//                                 <IconChevronLeft />
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 className="size-8"
//                                 size="icon"
//                                 onClick={() => table.nextPage()}
//                                 disabled={!table.getCanNextPage()}
//                             >
//                                 <span className="sr-only">Go to next page</span>
//                                 <IconChevronRight />
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 className="hidden size-8 lg:flex"
//                                 size="icon"
//                                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                                 disabled={!table.getCanNextPage()}
//                             >
//                                 <span className="sr-only">Go to last page</span>
//                                 <IconChevronsRight />
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </TabsContent>
//             <TabsContent
//                 value="past-performance"
//                 className="flex flex-col px-4 lg:px-6"
//             >
//                 <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//             </TabsContent>
//             <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
//                 <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//             </TabsContent>
//             <TabsContent
//                 value="focus-documents"
//                 className="flex flex-col px-4 lg:px-6"
//             >
//                 <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//             </TabsContent>
//         </Tabs>
//     )
// }


// const columns: ColumnDef<z.infer<typeof schema>>[] = [
//     {
//         id: "select",
//         header: ({ table }) => (
//             <div className="flex items-center justify-center">
//                 <Checkbox
//                     checked={
//                         table.getIsAllPageRowsSelected() ||
//                         (table.getIsSomePageRowsSelected() && "indeterminate")
//                     }
//                     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//                     aria-label="Select all"
//                 />
//             </div>
//         ),
//         cell: ({ row }) => (
//             <div className="flex items-center justify-center">
//                 <Checkbox
//                     checked={row.getIsSelected()}
//                     onCheckedChange={(value) => row.toggleSelected(!!value)}
//                     aria-label="Select row"
//                 />
//             </div>
//         ),
//     },
//     {
//         accessorKey: "header",
//         header: "Header",
//         cell: ({ }) => {
//             //   return <TableCellViewer item={row.original} />
//             return;
//         }
//     },
//     {
//         accessorKey: "type",
//         header: "Section Type",
//         cell: ({ row }) => (
//             <div className="w-32">
//                 <Badge variant="outline" className="text-muted-foreground px-1.5">
//                     {row.original.type}
//                 </Badge>
//             </div>
//         ),
//     },
//     {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => (
//             <Badge variant="outline" className="text-muted-foreground px-1.5">
//                 {row.original.status === "Done" ? (
//                     <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
//                 ) : (
//                     <IconLoader />
//                 )}
//                 {row.original.status}
//             </Badge>
//         ),
//     },
//     {
//         accessorKey: "target",
//         header: () => <div className="w-full text-right">Target</div>,
//         cell: ({ row }) => (
//             <form
//                 onSubmit={(e) => {
//                     e.preventDefault()
//                     toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
//                         loading: `Saving ${row.original.header}`,
//                         success: "Done",
//                         error: "Error",
//                     })
//                 }}
//             >
//                 <Label htmlFor={`${row.original.id}-target`} className="sr-only">
//                     Target
//                 </Label>
//                 <Input
//                     className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
//                     defaultValue={row.original.target}
//                     id={`${row.original.id}-target`}
//                 />
//             </form>
//         ),
//     },
//     {
//         accessorKey: "limit",
//         header: () => <div className="w-full text-right">Limit</div>,
//         cell: ({ row }) => (
//             <form
//                 onSubmit={(e) => {
//                     e.preventDefault()
//                     toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
//                         loading: `Saving ${row.original.header}`,
//                         success: "Done",
//                         error: "Error",
//                     })
//                 }}
//             >
//                 <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
//                     Limit
//                 </Label>
//                 <Input
//                     className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
//                     defaultValue={row.original.limit}
//                     id={`${row.original.id}-limit`}
//                 />
//             </form>
//         ),
//     },
//     {
//         accessorKey: "reviewer",
//         header: "Reviewer",
//         cell: ({ row }) => {
//             const isAssigned = row.original.reviewer !== "Assign reviewer"

//             if (isAssigned) {
//                 return row.original.reviewer
//             }

//             return (
//                 <>
//                     <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
//                         Reviewer
//                     </Label>
//                     <Select>
//                         <SelectTrigger
//                             className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
//                             size="sm"
//                             id={`${row.original.id}-reviewer`}
//                         >
//                             <SelectValue placeholder="Assign reviewer" />
//                         </SelectTrigger>
//                         <SelectContent align="end">
//                             <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//                             <SelectItem value="Jamik Tashpulatov">
//                                 Jamik Tashpulatov
//                             </SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </>
//             )
//         },
//     },
//     {
//         id: "actions",
//         cell: () => (
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         variant="ghost"
//                         className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
//                         size="icon"
//                     >
//                         <IconDotsVertical />
//                         <span className="sr-only">Open menu</span>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-32">
//                     <DropdownMenuItem>Edit</DropdownMenuItem>
//                     <DropdownMenuItem>Make a copy</DropdownMenuItem>
//                     <DropdownMenuItem>Favorite</DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         ),
//     },
// ]



// export const schema = z.object({
//     id: z.number(),
//     header: z.string(),
//     type: z.string(),
//     status: z.string(),
//     target: z.string(),
//     limit: z.string(),
//     reviewer: z.string(),
// })
// 
