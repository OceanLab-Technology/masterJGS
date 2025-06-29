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
  IconBan,
  IconCheck,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const schema = z.object({
  id: z.number(),
  name: z.string(),
  segment: z.string(),
  minLot: z.number(),
  maxLot: z.number(),
  maxQty: z.number(),
  qtyPerLot: z.number(),
  adminStatus: z.enum(["Active", "Blocked"]),
  masterStatus: z.enum(["Active", "Blocked"]),
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
    name: "",
    segment: "",
    minLot: 0,
    maxLot: 0,
    maxQty: 0,
    qtyPerLot: 0,
    adminStatus: "Active",
    masterStatus: "Active",
  })


  const openEditModal = (row: DataType) => {
    setEditRow(row)
    setForm({ ...row })
    setIsModalOpen(true)
  }

  const handleBulkBlock = () => {
    const idsToBlock = table.getSelectedRowModel().rows.map(r => r.original.id)
    setData(prev =>
      prev.map(row =>
        idsToBlock.includes(row.id)
          ? { ...row, masterStatus: "Blocked" }
          : row
      )
    )
    setRowSelection({})
  }

  const handleBulkEnable = () => {
    const idsToBlock = table.getSelectedRowModel().rows.map(r => r.original.id)
    setData(prev =>
      prev.map(row =>
        idsToBlock.includes(row.id)
          ? { ...row, masterStatus: "Active" }
          : row
      )
    )
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "segment",
      header: "Segment",
      cell: ({ row }) => getApplicationBadge(row.original.segment),
    },
    {
      accessorKey: "minLot",
      header: "Min Lot",
    },
    {
      accessorKey: "maxLot",
      header: "Max Lot",
    },
    {
      accessorKey: "maxQty",
      header: "Max Qty",
    },
    {
      accessorKey: "qtyPerLot",
      header: "Qty/Lot",
    },
    {
      accessorKey: "adminStatus",
      header: "Admin Status",
      cell: ({ row }) => getStatusBadge(row.original.adminStatus),
    },
    {
      accessorKey: "masterStatus",
      header: "Master Status",
      cell: ({ row }) => getStatusBadge(row.original.masterStatus),
    },
    {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const { id, masterStatus } = row.original;

    return (
      <div className="flex gap-2">
        {/* Edit Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openEditModal(row.original)}
        >
          <IconEdit className="w-4 h-4" />
        </Button>

        {/* Toggle Block/Enable */}
        {masterStatus === "Blocked" ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setData(prev =>
                prev.map(r =>
                  r.id === id ? { ...r, masterStatus: "Active" } : r
                )
              )
            }
          >
            <IconCheck className="w-4 h-4 text-green-600" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setData(prev =>
                prev.map(r =>
                  r.id === id ? { ...r, masterStatus: "Blocked" } : r
                )
              )
            }
          >
            <IconBan className="w-4 h-4 text-red-600" />
          </Button>
        )}

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setData(prev =>
              prev.map(r =>
                r.id === id
                  ? {
                      ...r,
                      minLot: 0,
                      maxLot: 0,
                      maxQty: 0,
                      qtyPerLot: 0,
                      masterStatus: "Active",
                    }
                  : r
              )
            )
          }
        >
          Reset
        </Button>
      </div>
    );
  },
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
        row.original.name.toLowerCase().includes(search) ||
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
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="destructive"
            onClick={handleBulkBlock}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <IconTrash className="mr-2" /> Block Selected
          </Button>
          <Button
            variant="default"
            onClick={handleBulkEnable}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <IconCirclePlus className="mr-2" /> Enable Selected
          </Button>
        </div>
      </div>

      <div className="overflow-auto border rounded-lg">
        <Table className="w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="text-sm text-muted-foreground hidden lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected.
        </div>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden lg:flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm">Rows per page</Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={value => table.setPageSize(Number(value))}
            >
              <SelectTrigger id="rows-per-page" className="w-20 h-8">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map(size => (
                  <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
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
            <DialogTitle>{editRow ? "Edit Script" : "Add Script"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {["minLot", "maxLot", "maxQty", "qtyPerLot"].map(key => (
              <div key={key}>
                <Label>{key}</Label>
                <Input
                  type="number"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: Number(e.target.value) })}
                />
              </div>
            ))}
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

const getApplicationBadge = (segment: string) => {
  const base = "text-white text-xs"
  switch (segment) {
    case "BSE":
      return <Badge className={`bg-red-600 ${base}`}>{segment}</Badge>
    case "NSE":
      return <Badge className={`bg-orange-600 ${base}`}>{segment}</Badge>
    case "MCX":
      return <Badge className={`bg-green-600 ${base}`}>{segment}</Badge>
    default:
      return <Badge className={`bg-gray-500 ${base}`}>{segment}</Badge>
  }
}

const getStatusBadge = (status: "Active" | "Blocked") => {
  return (
    <Badge className={`text-white text-xs ${status === "Active" ? "bg-green-600" : "bg-red-600"}`}>
      {status}
    </Badge>
  )
}
