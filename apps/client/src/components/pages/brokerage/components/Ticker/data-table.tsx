"use client"

import { useState } from "react"
import { z } from "zod"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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
} from "@repo/ui/components/dialog"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Button } from "@repo/ui/components/button"
import { Checkbox } from "@repo/ui/components/checkbox"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@repo/ui/components/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table"
import { Badge } from "@repo/ui/components/badge"

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
  const [globalFilter, setGlobalFilter] = useState("")

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
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {getApplicationBadge(row.original)}
        </div>
      ),
    },

    {
      accessorKey: "adminValue",
      header: "Admin Value",
      cell: ({ row }) => {
        const { adminValue, type } = row.original
        return `${adminValue.toFixed(2)} ${type === "%" ? "%" : "₹"}`
      },
    },
    {
      accessorKey: "masterValue",
      header: "Master Value",
      cell: ({ row }) => {
        const { masterValue, type } = row.original
        return `${masterValue.toFixed(2)} ${type === "%" ? "%" : "₹"}`
      },
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const { adminValue, masterValue, type } = row.original
        const total = adminValue + masterValue
        return `${total.toFixed(2)} ${type === "%" ? "%" : "₹"}`
      },
    },

    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="flex gap-2">
    //       <Button size="icon" variant="ghost" onClick={() => openEditModal(row.original)}>
    //         <IconEdit size={16} />
    //       </Button>
    //       <Button
    //         size="icon"
    //         variant="destructive"
    //         onClick={() => handleDelete(row.original.id)}
    //       >
    //         <IconTrash size={16} />
    //       </Button>
    //     </div>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditModal(row.original)}>
            <IconEdit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)}>
            <IconTrash className="w-4 h-4" />
          </Button>
        </div>
      ),
    }

  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      globalFilter,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    globalFilterFn: (row, filterValue) => {
      const search = filterValue.toLowerCase()
      return (
        row.original.scriptName.toLowerCase().includes(search) ||
        row.original.symbol.toLowerCase().includes(search) ||
        row.original.segment.toLowerCase().includes(search)
      )
    },
  })

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-52"
          />
          <Button onClick={openAddModal}>
            <IconCirclePlus className="mr-2" /> Add New
          </Button>
        </div>
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          <IconTrash className="mr-2" /> Delete Selected
        </Button>
      </div>

      <div className="overflow-auto border rounded-lg">
        <Table className="w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-left p-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="border-b">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground hidden flex-1 lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
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
            <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <IconChevronsLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <IconChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <IconChevronRight size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <IconChevronsRight size={16} />
            </Button>
          </div>
        </div>
      </div>

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
const getApplicationBadge = (s: DataType) => {
  const base = "text-white text-xs"
  switch (s.segment) {
    case "BSE":
      return <Badge className={`bg-red-600 ${base}`}>{s.segment}</Badge>
    case "NSE":
      return <Badge className={`bg-orange-600 ${base}`}>{s.segment}</Badge>
    case "MCX":
      return <Badge className={`bg-green-600 ${base}`}>{s.segment}</Badge>
    default:
      return null
  }
}