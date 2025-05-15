"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/useUserStore";

const roleColors = {
  admin: "bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700",
  supervisor: "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700",
  technician: "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700",
  worker: "bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700",
  default: "bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700",
};

const statusColors = {
  active: "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700",
  inactive: "bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700",
  suspended: "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700",
  default: "bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700",
};

const columns = [
  {
    header: "User ID",
    accessorKey: "_id",
    cell: (info) => (
      <span className="font-medium text-foreground">
        {info.getValue().slice(-6).toUpperCase()}
      </span>
    ),
  },
  {
    header: "Full Name",
    accessorKey: "fullname",
    cell: (info) => (
      <span className="text-foreground">{info.getValue()}</span>
    ),
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent text-foreground"
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "email",
    cell: (info) => (
      <span className="text-foreground">{info.getValue()}</span>
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: (info) => {
      const value = info.getValue();
      // Ensure value is a string
      const roleValue = typeof value === 'string' ? value : 'default';
      const colorClass = roleColors[roleValue] || roleColors.default;
      return (
        <Badge className={`${colorClass} text-white dark:text-gray-100`}>
          {roleValue.charAt(0).toUpperCase() + roleValue.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const value = info.getValue();
      // Ensure value is a string
      const statusValue = typeof value === 'string' ? value : 'default';
      const colorClass = statusColors[statusValue] || statusColors.default;
      return (
        <Badge className={`${colorClass} text-white dark:text-gray-100`}>
          {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: "Last Login",
    accessorKey: "lastLogin",
    cell: (info) => (
      <span className="text-foreground">
        {format(new Date(info.getValue()), "yyyy-MM-dd HH:mm:ss")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { toast } = useToast();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user._id);
                toast({
                  title: "Copied",
                  description: "User ID copied to clipboard",
                });
              }}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit User</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const { getAllUsers, users: storeUsers } = useUserStore(); // Changed from 'user' to 'users'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        await getAllUsers();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (storeUsers) {
      setUsers(storeUsers);
    }
  }, [storeUsers]);

  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-foreground">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          System Users
        </h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-foreground">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    row.original.status === "suspended"
                      ? "bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50"
                      : row.original.status === "inactive"
                        ? "bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/50"
                        : "hover:bg-accent"
                  }
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <strong className="text-foreground">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </strong>{" "}
          of <strong className="text-foreground">
            {table.getFilteredRowModel().rows.length}
          </strong>{" "}
          users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}