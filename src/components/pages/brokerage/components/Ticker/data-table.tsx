"use client";

import { useState } from "react";
import { z } from "zod";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  IconCirclePlus,
  IconEdit,
  IconTrash,
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TickerRateForm } from "./tickerrateform";
import { type ScriptRate } from "./tickerrateform";
import { Building2, X, FileText, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  id: z.number(),
  scriptName: z.string(),
  symbol: z.string(),
  segment: z.enum(["BSE", "NSE", "MCX"]),
  type: z.enum(["percentage", "rupee"]),
  adminValue: z.number(),
  masterValue: z.number(),
});

type DataType = z.infer<typeof schema>;

type EditableTableProps = {
  initialData: DataType[];
};

export default function EditableTable({ initialData }: EditableTableProps) {
  const [data, setData] = useState<DataType[]>(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<DataType | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const openAddModal = () => {
    setEditRow(null);
    setIsModalOpen(true);
  };

  const openEditModal = (row: DataType) => {
    setEditRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  const handleBulkDelete = () => {
    const idsToDelete = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.id);
    setData((prev) => prev.filter((row) => !idsToDelete.includes(row.id)));
    setRowSelection({});
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (value) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    } else {
      setIsSearching(false);
    }
  };

  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-12 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const EmptyState = () => (
    <div className=" rounded-lg w-full">
      <div className="flex w-full flex-col items-center justify-center text-center py-16 ">
        <div className="flex flex-col items-center justify-center text-center py-4 md:py-2   w-fit rounded-2xl">
          <div className="w-full min-w-sm p-4 md:p-6 md:pb-0 mb-4 opacity-50">
            <div className="h-10 bg-background rounded mb-6 animate-pulse"></div>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-4 mb-4 animate-pulse"
              >
                <div className="w-6 h-6 bg-background rounded-full"></div>
                <div className="flex-1 h-4 bg-background rounded"></div>
                <div className="w-10 h-4 bg-background rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <h3 className=" text-lg font-semibold text-gray-900">
          No script rates found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {globalFilter
            ? `No results found for "${globalFilter}". Try adjusting your search.`
            : "Get started by adding your first script rate."}
        </p>
        {!globalFilter && (
          <Button className="mt-4" onClick={openAddModal}>
            <IconCirclePlus className="h-10 w-10" />
            Add Script Rate
          </Button>
        )}
      </div>
    </div>
  );

  const handleSave = (formData: Omit<ScriptRate, "id" | "total">) => {
    if (editRow) {
      setData((prev) =>
        prev.map((row) =>
          row.id === editRow.id
            ? {
                id: row.id,
                scriptName: formData.scriptName,
                symbol: formData.symbol,
                segment: formData.segment as "BSE" | "NSE" | "MCX",
                type: formData.type,
                adminValue: formData.adminValue,
                masterValue: formData.masterValue,
              }
            : row
        )
      );
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          scriptName: formData.scriptName,
          symbol: formData.symbol,
          segment: formData.segment as "BSE" | "NSE" | "MCX",
          type: formData.type,
          adminValue: formData.adminValue,
          masterValue: formData.masterValue,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const columns: ColumnDef<DataType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
        const { adminValue, type } = row.original;
        return `${adminValue.toFixed(2)} ${type === "percentage" ? "%" : "₹"}`;
      },
    },
    {
      accessorKey: "masterValue",
      header: "Master Value",
      cell: ({ row }) => {
        const { masterValue, type } = row.original;
        return `${masterValue.toFixed(2)} ${type === "percentage" ? "%" : "₹"}`;
      },
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const { adminValue, masterValue, type } = row.original;
        const total = adminValue + masterValue;
        return `${total.toFixed(2)} ${type === "percentage" ? "%" : "₹"}`;
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(row.original)}
          >
            <IconEdit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <IconTrash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

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
      const search = filterValue.toLowerCase();
      return (
        row.original.scriptName.toLowerCase().includes(search) ||
        row.original.symbol.toLowerCase().includes(search) ||
        row.original.segment.toLowerCase().includes(search)
      );
    },
  });

  const hasData = table.getRowModel().rows.length > 0;

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-52"
          />
          <Button onClick={openAddModal}>
            <IconCirclePlus /> Add New
          </Button>
        </div>
        {table.getSelectedRowModel().rows.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            <IconTrash /> Delete Selected (
            {table.getSelectedRowModel().rows.length})
          </Button>
        )}
      </div>

      {isLoading || isSearching || hasData ? (
        <div className="overflow-auto border rounded-lg">
          <Table className="w-full text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-left p-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading || isSearching ? (
                <TableSkeleton />
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState />
      )}

      {(hasData || isLoading || isSearching) && (
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
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger id="rows-per-page" className="w-20 h-8">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
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
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="script-rates-dialog sm:max-w-xl p-0 rounded-lg shadow-xl">
          <div>
            <DialogHeader className="">
              <div className="flex items-center justify-between space-x-4  p-6 md:p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-3 rounded-lg flex-shrink-0 mt-1">
                    <Building2 className="h-7 w-7 " />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold ">
                      {editRow ? "Edit" : "Add"} Script Rate
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-1">
                      {editRow
                        ? "Update the details for the script rate."
                        : "Fill the data for the new script rate."}
                    </DialogDescription>
                  </div>
                </div>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 rounded-full border  flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 self-center"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 " />
                  </Button>
                </DialogClose>
              </div>
              <Separator className="mb-6" />
            </DialogHeader>
            <TickerRateForm
              key={editRow ? `edit-${editRow.id}` : "add-new"}
              onSubmit={handleSave}
              initialData={
                editRow
                  ? {
                      id: editRow.id.toString(),
                      scriptName: editRow.scriptName,
                      symbol: editRow.symbol,
                      segment: editRow.segment,
                      type: editRow.type,
                      adminValue: editRow.adminValue,
                      masterValue: editRow.masterValue,
                      total: editRow.adminValue + editRow.masterValue,
                    }
                  : undefined
              }
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
const getApplicationBadge = (s: DataType) => {
  const base = "text-white text-xs";
  switch (s.segment) {
    case "BSE":
      return <Badge className={`bg-red-600 ${base}`}>{s.segment}</Badge>;
    case "NSE":
      return <Badge className={`bg-orange-600 ${base}`}>{s.segment}</Badge>;
    case "MCX":
      return <Badge className={`bg-green-600 ${base}`}>{s.segment}</Badge>;
    default:
      return null;
  }
};
