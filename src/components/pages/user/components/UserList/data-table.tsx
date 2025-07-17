"use client";

import { useState, useEffect } from "react";
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
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
  IconDots,
  IconUser,
  IconEdit,
  IconKey,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useUserStore, type User } from "@/store/useUserStore";
import UserForm from "../UserForm";
import PasswordModal from "../PasswordModal";

export default function UserDataTable() {
  const { users, loading, fetchUsers, updateUserLocally } = useUserStore();
  const [data, setData] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      setGlobalFilter(searchInput);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleToggleEnabled = (userId: string, enabled: boolean) => {
    updateUserLocally(userId, { enabled });
  };

  const handleToggleLocked = (userId: string, locked: boolean) => {
    if (!locked) {
      updateUserLocally(userId, { locked });
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.id}</div>
      ),
    },
    {
      accessorKey: "nickname",
      header: "Nickname",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.nickname}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "enabled",
      header: "Enabled",
      cell: ({ row }) => (
        <Switch
          checked={row.original.enabled}
          onCheckedChange={(checked) =>
            handleToggleEnabled(row.original.id, checked)
          }
        />
      ),
    },
    {
      accessorKey: "locked",
      header: "Locked",
      cell: ({ row }) => (
        <Switch
          checked={row.original.locked}
          onCheckedChange={(checked) =>
            handleToggleLocked(row.original.id, checked)
          }
          disabled={!row.original.locked}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconDots size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openUpdateModal(row.original)}>
              <IconEdit size={16} className="mr-2" />
              Update User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openPasswordModal(row.original)}>
              <IconKey size={16} className="mr-2" />
              Change Password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, filterValue) => {
      const nickname = row.original.nickname.toLowerCase();
      return nickname.includes(filterValue.toLowerCase());
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
          <TableCell><Skeleton className="h-6 w-12" /></TableCell>
          <TableCell><Skeleton className="h-6 w-12" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  const EmptyState = () => (
    <div className="rounded-lg w-full">
      <div className="flex w-full flex-col items-center justify-center text-center py-16">
        <div className="flex flex-col items-center justify-center text-center py-4 md:py-2 w-fit rounded-2xl">
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
        <p className="mt-2 text-sm text-gray-500">
          {globalFilter
            ? `No results.`
            : "Get started by adding your first user."}
        </p>
        {!globalFilter && (
          <Button className="mt-4" onClick={openCreateModal}>
            <IconCirclePlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 flex-1 flex flex-col">
      {/* Header with search and create button */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={openCreateModal}>
          <IconCirclePlus className="h-4 w-4 mr-2" />
          Create New User
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading || isSearching ? (
                <TableSkeleton />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 p-0">
                    <EmptyState />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center gap-x-5">
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

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 rounded-lg shadow-xl">
          <div>
            <DialogHeader>
              <div className="flex items-center justify-between space-x-4 p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-3 rounded-lg flex-shrink-0 mt-1">
                    <IconUser className="h-7 w-7" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold">
                      Create New User
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-1">
                      Fill the data for the new user.
                    </DialogDescription>
                  </div>
                </div>
              </div>
              <Separator className="mb-6" />
            </DialogHeader>
            <UserForm
              mode="create"
              onCancel={() => setIsCreateModalOpen(false)}
              onSuccess={() => setIsCreateModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Update User Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 rounded-lg shadow-xl">
          <div>
            <DialogHeader>
              <div className="flex items-center justify-between space-x-4 p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-3 rounded-lg flex-shrink-0 mt-1">
                    <IconEdit className="h-7 w-7" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold">
                      Update User
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-1">
                      Update the details for the user.
                    </DialogDescription>
                  </div>
                </div>
              </div>
              <Separator className="mb-6" />
            </DialogHeader>
            <UserForm
              mode="update"
              user={selectedUser}
              onCancel={() => setIsUpdateModalOpen(false)}
              onSuccess={() => setIsUpdateModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
