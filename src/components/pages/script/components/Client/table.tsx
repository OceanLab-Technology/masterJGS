"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  IconEdit,
  IconBan,
  IconCheck,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const schema = z.object({
  id: z.number(),
  tickerId: z.string(),
  name: z.string(),
  segment: z.string(),
  maxQty: z.number(),
  masterStatus: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine(
      (val): val is "active" | "blocked" =>
        val === "active" || val === "blocked"
    )
    .transform((val) => (val === "active" ? "Active" : "Blocked")),
});

interface EditableScriptTableProps {
  initialData: DataType[];
  availableSegments: { name: string; enabled: boolean }[];
  clientData: Array<{ clientId: string; clientName: string }>;
  clientScriptsData: Record<string, DataType[]>;
}

type DataType = z.infer<typeof schema>;

export default function EditableScriptTable({
  initialData,
  availableSegments,
  clientData,
  clientScriptsData,
}: EditableScriptTableProps) {
  const [selectedClient, setSelectedClient] = useState(clientData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [editRow, setEditRow] = useState<z.infer<typeof schema> | null>(null);
  const [form, setForm] = useState<{ maxQty: number }>({ maxQty: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmentStates, setSegmentStates] = useState<Record<string, boolean>>(
    Object.fromEntries(availableSegments.map((s) => [s.name, s.enabled]))
  );

  const currentScripts = clientScriptsData[selectedClient.clientId] || [];

  useEffect(() => {
    setData(currentScripts);
  }, [selectedClient, currentScripts]);

  const filteredClients = clientData.filter(
    (client) =>
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } else {
      setIsSearching(false);
    }
  };

  const handleClientSelect = (client: {
    clientId: string;
    clientName: string;
  }) => {
    setSelectedClient(client);
    setSearchTerm("");
    setData(clientScriptsData[client.clientId] || []);
  };

  console.log("InitialData:", initialData, data);

  const openEditModal = (row: DataType) => {
    setEditRow(row);
    setForm({ ...row });
    setIsModalOpen(true);
  };

  const table = useReactTable({
    data,
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      { accessorKey: "tickerId", header: "Ticker ID" },
      { accessorKey: "name", header: "Script Name" },
      {
        accessorKey: "segment",
        header: "Segment",
        cell: ({ row }) => getApplicationBadge(row.original.segment),
      },
      { accessorKey: "maxQty", header: "Max Qty" },
      {
        accessorKey: "Status",
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
                    setData((prev) =>
                      prev.map((r) =>
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
                    setData((prev) =>
                      prev.map((r) =>
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
                  setData((prev) =>
                    prev.map((r) =>
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
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { rowSelection, globalFilter },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    globalFilterFn: (row, filter) => {
      const search = filter.toLowerCase();
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.tickerId.toLowerCase().includes(search)
      );
    },
  });

  const handleBulkAction = (status: "Active" | "Blocked") => {
    const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    setData((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, masterStatus: status } : r))
    );
    setRowSelection({});
  };

  const toggleSegment = (name: string) => {
    if (name === "ALL") {
      const allEnabled = Object.values(segmentStates).every(Boolean);
      const newStates = Object.fromEntries(
        Object.keys(segmentStates).map((key) => [key, !allEnabled])
      );
      setSegmentStates(newStates);
    } else {
      setSegmentStates((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clients by name or ID..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchTerm && (
          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="space-y-1">
                {filteredClients.map((client) => (
                  <Button
                    key={client.clientId}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleClientSelect(client)}
                  >
                    <div>
                      <div className="font-medium">{client.clientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.clientId}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No clients found
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
          <div className="text-sm text-muted-foreground">Selected Client:</div>
          <div className="font-medium">{selectedClient.clientName}</div>
          <div className="text-sm text-muted-foreground">
            ({selectedClient.clientId})
          </div>
        </div>
      </div>

      {/* <div className="flex gap-4 flex-wrap">
        {[...availableSegments, { name: "ALL", enabled: true }].map(({ name, enabled }) => (
          <div key={name} className="flex items-center gap-2">
            <Checkbox
              disabled={!enabled}
              checked={name === "ALL" ? segmentFilter.length === availableSegments.filter(s => s.enabled).length : segmentFilter.includes(name)}
              onCheckedChange={() => toggleSegment(name)}
            />
            <Label>{name}</Label>
          </div>
        ))}
      </div> */}

      {/* <div className="rounded-md border p-4 bg-muted/50 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Client Segment Controls</h3>
        <div className="flex flex-wrap gap-4">
          {[...availableSegments, { name: "ALL", enabled: true }].map(({ name }) => (
            <div key={name} className="flex items-center gap-2">
              <Checkbox
                checked={name === "ALL"
                  ? Object.values(segmentStates).every(Boolean)
                  : !!segmentStates[name]}
                onCheckedChange={() => toggleSegment(name)}
              />
              <Label className="text-sm">{name}</Label>
            </div>
          ))}
        </div>
      </div> */}
      {/* <div className="rounded-2xl border border-muted bg-muted/50 p-6 shadow-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-muted-foreground tracking-wide">
            Client Details
          </h2>
          <div className="inline-flex items-center gap-2 bg-background border border-muted rounded-md px-4 py-2">
            <span className="text-sm text-muted-foreground font-medium">Client ID:</span>
            <span className="text-base font-semibold text-foreground">{clientId}</span>
          </div>
        </div>
      </div> */}

      <div className="rounded-md border p-4 bg-muted/50 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Client Segment Controls
        </h3>
        <div className="flex flex-wrap gap-4">
          {[...availableSegments, { name: "ALL", enabled: true }].map(
            ({ name, enabled }) => {
              const isAll = name === "ALL";
              const isChecked = isAll
                ? Object.entries(segmentStates)
                    .filter(
                      ([seg]) =>
                        availableSegments.find((s) => s.name === seg)?.enabled
                    )
                    .every(([, v]) => v)
                : !!segmentStates[name];

              return (
                <div key={name} className="flex items-center gap-2">
                  <Checkbox
                    disabled={!enabled}
                    checked={isChecked}
                    onCheckedChange={() => toggleSegment(name)}
                  />
                  <Label
                    className={`text-sm flex items-center gap-1 ${
                      !enabled && !isAll
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {name}
                    {!enabled && !isAll && (
                      <span className="text-xs bg-red-500 text-white px-1 rounded">
                        Blocked
                      </span>
                    )}
                  </Label>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by Ticker or Name"
          className="w-64"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={!table.getSelectedRowModel().rows.length}
            onClick={() => handleBulkAction("Blocked")}
          >
            Block Selected
          </Button>
          <Button
            variant="default"
            disabled={!table.getSelectedRowModel().rows.length}
            onClick={() => handleBulkAction("Active")}
          >
            Unblock Selected
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected
        </div>
        <div className="flex gap-2 items-center">
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
          <div>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Max Qty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Max Qty</Label>
            <Input
              type="number"
              value={form.maxQty}
              onChange={(e) => setForm({ maxQty: Number(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editRow) {
                  setData((prev) =>
                    prev.map((r) =>
                      r.id === editRow.id ? { ...r, maxQty: form.maxQty } : r
                    )
                  );
                }
                setIsModalOpen(false);
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getApplicationBadge(segment: string): any {
  const base = "text-white text-xs";
  switch (segment) {
    case "BSE":
      return <Badge className={`bg-red-600 ${base}`}>{segment}</Badge>;
    case "NSE":
      return <Badge className={`bg-orange-600 ${base}`}>{segment}</Badge>;
    case "MCX":
      return <Badge className={`bg-green-600 ${base}`}>{segment}</Badge>;
    default:
      return <Badge className={`bg-gray-500 ${base}`}>{segment}</Badge>;
  }
}

const getStatusBadge = (status: "Active" | "Blocked") => {
  return (
    <Badge
      className={`text-white text-xs ${
        status === "Active" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {status}
    </Badge>
  );
};
