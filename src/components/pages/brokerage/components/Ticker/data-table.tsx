// "use client"

// import { useState } from "react"
// import { z } from "zod"
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table"
// import type { ColumnDef } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"

// // Zod schema
// const schema = z.object({
//   id: z.number(),
//   scriptName: z.string(),
//   symbol: z.string(),
//   segment: z.string(),
//   type: z.enum(["%", "₹"]),
//   adminValue: z.number(),
//   masterValue: z.number(),
// })
// type DataType = z.infer<typeof schema>

// export default function EditableTable() {
//   const [data, setData] = useState<DataType[]>([
//     {
//       id: 1,
//       scriptName: "ABC",
//       symbol: "XYZ",
//       segment: "EQ",
//       type: "%",
//       adminValue: 100,
//       masterValue: 200,
//     },
//     {
//       id: 2,
//       scriptName: "DEF",
//       symbol: "LMN",
//       segment: "FO",
//       type: "₹",
//       adminValue: 300,
//       masterValue: 150,
//     },
//   ])
//   const [rowSelection, setRowSelection] = useState({})

//   const handleDelete = (id: number) => {
//     setData(prev => prev.filter(item => item.id !== id))
//   }

//   const handleEdit = (row: DataType) => {
//     const updated = prompt("Edit Script Name", row.scriptName)
//     if (updated) {
//       setData(prev =>
//         prev.map(d =>
//           d.id === row.id ? { ...d, scriptName: updated } : d
//         )
//       )
//     }
//   }

//   const handleAdd = () => {
//     const nextId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
//     const newRow: DataType = {
//       id: nextId,
//       scriptName: "New Script",
//       symbol: "NEW",
//       segment: "EQ",
//       type: "%",
//       adminValue: 0,
//       masterValue: 0,
//     }
//     setData(prev => [...prev, newRow])
//   }

//   const handleBulkDelete = () => {
//     const idsToDelete = table.getSelectedRowModel().rows.map(r => r.original.id)
//     setData(prev => prev.filter(row => !idsToDelete.includes(row.id)))
//     setRowSelection({})
//   }

//   const columns: ColumnDef<DataType>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <div className="flex items-center justify-center">
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
//             aria-label="Select all"
//           />
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={value => row.toggleSelected(!!value)}
//             aria-label="Select row"
//           />
//         </div>
//       ),
//     },
//     {
//       accessorKey: "scriptName",
//       header: "Name",
//       cell: ({ row }) => row.original.scriptName,
//     },
//     {
//       accessorKey: "symbol",
//       header: "Symbol",
//       cell: ({ row }) => row.original.symbol,
//     },
//     {
//       accessorKey: "segment",
//       header: "Segment",
//       cell: ({ row }) => row.original.segment,
//     },
//     {
//       accessorKey: "type",
//       header: "Type",
//       cell: ({ row }) => row.original.type,
//     },
//     {
//       accessorKey: "adminValue",
//       header: "Admin Value",
//       cell: ({ row }) => row.original.adminValue.toFixed(2),
//     },
//     {
//       accessorKey: "masterValue",
//       header: "Master Value",
//       cell: ({ row }) => row.original.masterValue.toFixed(2),
//     },
//     {
//       id: "total",
//       header: "Total",
//       cell: ({ row }) =>
//         (row.original.adminValue + row.original.masterValue).toFixed(2),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const data = row.original
//         return (
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" onClick={() => handleEdit(data)}>
//               Edit
//             </Button>
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => handleDelete(data.id)}
//             >
//               Delete
//             </Button>
//           </div>
//         )
//       },
//     },
//   ]

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     state: {
//       rowSelection,
//     },
//     onRowSelectionChange: setRowSelection,
//     enableRowSelection: true,
//   })

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex justify-between items-center">
//         <Button onClick={handleAdd}>Add New</Button>
//         <Button
//           onClick={handleBulkDelete}
//           variant="destructive"
//           disabled={table.getSelectedRowModel().rows.length === 0}
//         >
//           Delete Selected
//         </Button>
//       </div>

//       <table className="w-full text-sm border">
//         <thead>
//           {table.getHeaderGroups().map(headerGroup => (
//             <tr key={headerGroup.id} className="border-b">
//               {headerGroup.headers.map(header => (
//                 <th key={header.id} className="text-left p-2">
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>

//         <tbody>
//           {table.getRowModel().rows.map(row => (
//             <tr key={row.id} className="border-b">
//               {row.getVisibleCells().map(cell => (
//                 <td key={cell.id} className="p-2">
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { z } from "zod"
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table"
// import type { ColumnDef } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// const schema = z.object({
//   id: z.number(),
//   scriptName: z.string(),
//   symbol: z.string(),
//   segment: z.string(),
//   type: z.enum(["%", "₹"]),
//   adminValue: z.number(),
//   masterValue: z.number(),
// })

// type DataType = z.infer<typeof schema>

// type EditableTableProps = {
//   initialData: DataType[]
// }

// export default function EditableTable({ initialData }: EditableTableProps) {
//   const [data, setData] = useState<DataType[]>(initialData)
//   const [rowSelection, setRowSelection] = useState({})
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editRow, setEditRow] = useState<DataType | null>(null)

//   const [form, setForm] = useState<Omit<DataType, "id">>({
//     scriptName: "",
//     symbol: "",
//     segment: "",
//     type: "%",
//     adminValue: 0,
//     masterValue: 0,
//   })

//   const openAddModal = () => {
//     setEditRow(null)
//     setForm({
//       scriptName: "",
//       symbol: "",
//       segment: "",
//       type: "%",
//       adminValue: 0,
//       masterValue: 0,
//     })
//     setIsModalOpen(true)
//   }

//   const openEditModal = (row: DataType) => {
//     setEditRow(row)
//     setForm({
//       scriptName: row.scriptName,
//       symbol: row.symbol,
//       segment: row.segment,
//       type: row.type,
//       adminValue: row.adminValue,
//       masterValue: row.masterValue,
//     })
//     setIsModalOpen(true)
//   }

//   const handleDelete = (id: number) => {
//     setData(prev => prev.filter(row => row.id !== id))
//   }

//   const handleBulkDelete = () => {
//     const idsToDelete = table.getSelectedRowModel().rows.map(r => r.original.id)
//     setData(prev => prev.filter(row => !idsToDelete.includes(row.id)))
//     setRowSelection({})
//   }

//   const handleSave = () => {
//     if (editRow) {
//       // Editing
//       setData(prev =>
//         prev.map(row =>
//           row.id === editRow.id ? { ...row, ...form } : row
//         )
//       )
//     } else {
//       // Adding
//       const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
//       setData(prev => [...prev, { id: newId, ...form }])
//     }

//     setIsModalOpen(false)
//   }

//   const columns: ColumnDef<DataType>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <div className="flex items-center justify-center">
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
//             aria-label="Select all"
//           />
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={value => row.toggleSelected(!!value)}
//             aria-label="Select row"
//           />
//         </div>
//       ),
//     },
//     {
//       accessorKey: "scriptName",
//       header: "Name",
//       cell: ({ row }) => row.original.scriptName,
//     },
//     {
//       accessorKey: "symbol",
//       header: "Symbol",
//       cell: ({ row }) => row.original.symbol,
//     },
//     {
//       accessorKey: "segment",
//       header: "Segment",
//       cell: ({ row }) => row.original.segment,
//     },
//     {
//       accessorKey: "type",
//       header: "Type",
//       cell: ({ row }) => row.original.type,
//     },
//     {
//       accessorKey: "adminValue",
//       header: "Admin Value",
//       cell: ({ row }) => row.original.adminValue.toFixed(2),
//     },
//     {
//       accessorKey: "masterValue",
//       header: "Master Value",
//       cell: ({ row }) => row.original.masterValue.toFixed(2),
//     },
//     {
//       id: "total",
//       header: "Total",
//       cell: ({ row }) =>
//         (row.original.adminValue + row.original.masterValue).toFixed(2),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => openEditModal(row.original)}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => handleDelete(row.original.id)}
//           >
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ]

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     state: {
//       rowSelection,
//     },
//     onRowSelectionChange: setRowSelection,
//     enableRowSelection: true,
//   })

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex justify-between items-center">
//         <Button onClick={openAddModal}>Add New</Button>
//         <Button
//           onClick={handleBulkDelete}
//           variant="destructive"
//           disabled={table.getSelectedRowModel().rows.length === 0}
//         >
//           Delete Selected
//         </Button>
//       </div>

//       <table className="w-full text-sm border">
//         <thead>
//           {table.getHeaderGroups().map(headerGroup => (
//             <tr key={headerGroup.id} className="border-b">
//               {headerGroup.headers.map(header => (
//                 <th key={header.id} className="text-left p-2">
//                   {flexRender(header.column.columnDef.header, header.getContext())}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map(row => (
//             <tr key={row.id} className="border-b">
//               {row.getVisibleCells().map(cell => (
//                 <td key={cell.id} className="p-2">
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editRow ? "Edit Entry" : "Add Entry"}</DialogTitle>
//           </DialogHeader>

//           <div className="grid gap-2 py-4">
//             {(["scriptName", "symbol", "segment"] as const).map(key => (
//               <div key={key}>
//                 <Label>{key}</Label>
//                 <Input
//                   value={form[key]}
//                   onChange={e => setForm({ ...form, [key]: e.target.value })}
//                 />
//               </div>
//             ))}

//             <div>
//               <Label>Type</Label>
//               <select
//                 className="border p-2 w-full rounded"
//                 value={form.type}
//                 onChange={e => setForm({ ...form, type: e.target.value as "%" | "₹" })}
//               >
//                 <option value="%">%</option>
//                 <option value="₹">₹</option>
//               </select>
//             </div>

//             <div>
//               <Label>Admin Value</Label>
//               <Input
//                 type="number"
//                 value={form.adminValue}
//                 onChange={e => setForm({ ...form, adminValue: Number(e.target.value) })}
//               />
//             </div>

//             <div>
//               <Label>Master Value</Label>
//               <Input
//                 type="number"
//                 value={form.masterValue}
//                 onChange={e => setForm({ ...form, masterValue: Number(e.target.value) })}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button onClick={() => setIsModalOpen(false)} variant="outline">
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>{editRow ? "Update" : "Add"}</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


"use client"

import React, { useState } from "react"
import { z } from "zod"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import {
  IconCirclePlus,
  IconEdit,
  IconTrash,
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"

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

type EditableTableProps = {
  initialData: DataType[]
}

export default function EditableTable({ initialData }: EditableTableProps) {
  const [data, setData] = useState<DataType[]>(initialData)
  const [rowSelection, setRowSelection] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRow, setEditRow] = useState<DataType | null>(null)

  const [form, setForm] = useState<Omit<DataType, "id">>({
    scriptName: "",
    symbol: "",
    segment: "",
    type: "%",
    adminValue: 0,
    masterValue: 0,
  })

  const openAddModal = () => {
    setEditRow(null)
    setForm({
      scriptName: "",
      symbol: "",
      segment: "",
      type: "%",
      adminValue: 0,
      masterValue: 0,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (row: DataType) => {
    setEditRow(row)
    setForm({
      scriptName: row.scriptName,
      symbol: row.symbol,
      segment: row.segment,
      type: row.type,
      adminValue: row.adminValue,
      masterValue: row.masterValue,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(row => row.id !== id))
  }

  const handleBulkDelete = () => {
    const idsToDelete = table.getSelectedRowModel().rows.map(r => r.original.id)
    setData(prev => prev.filter(row => !idsToDelete.includes(row.id)))
    setRowSelection({})
  }

  const handleSave = () => {
    if (editRow) {
      setData(prev =>
        prev.map(row => (row.id === editRow.id ? { ...row, ...form } : row))
      )
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
      setData(prev => [...prev, { id: newId, ...form }])
    }
    setIsModalOpen(false)
  }

  const columns: ColumnDef<DataType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => openEditModal(row.original)}>
            <IconEdit size={16} />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      ),
    },
  ]

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

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <Button onClick={openAddModal}>
          <IconCirclePlus className="mr-2" /> Add New
        </Button>
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          <IconTrash className="mr-2" /> Delete Selected
        </Button>
      </div>

      <table className="w-full text-sm border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="text-left p-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground hidden flex-1 lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden lg:flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={value => table.setPageSize(Number(value))}
            >
              <SelectTrigger id="rows-per-page" className="w-20 h-8">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map(size => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRow ? "Edit Entry" : "Add Entry"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {(["scriptName", "symbol", "segment"] as const).map(key => (
              <div key={key}>
                <Label>{key}</Label>
                <Input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <Label>Type</Label>
              <select
                className="border rounded p-2 w-full"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as "%" | "₹" })}
              >
                <option value="%">%</option>
                <option value="₹">₹</option>
              </select>
            </div>
            <div>
              <Label>Admin Value</Label>
              <Input
                type="number"
                value={form.adminValue}
                onChange={e => setForm({ ...form, adminValue: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Master Value</Label>
              <Input
                type="number"
                value={form.masterValue}
                onChange={e => setForm({ ...form, masterValue: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editRow ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
