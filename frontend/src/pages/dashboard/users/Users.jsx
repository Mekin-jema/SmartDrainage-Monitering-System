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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronDown, Filter, MoreHorizontal, Plus, RefreshCw, Search } from "lucide-react";
// Removed unused import
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/useUserStore";

// // 🧪 Mock Users Data
// const users = [
//   {
//     status: {
//       availability: "available"
//     },
//     _id: "68230e24bc9d05708e6329e7",
//     fullname: "Mekin Jemal",
//     address: "Update your address",
//     email: "mekinjemal99@gmail.com",
//     role: "worker",
//     profilePicture: "",
//     admin: false,
//     isVerified: false,
//     verificationToken: "5T8X5U",
//     verificationTokenExpiresAt: "2025-05-14T09:17:24.846Z",
//     assignments: [],
//     lastLogin: "2025-05-13T09:17:24.852Z",
//     createdAt: "2025-05-13T09:17:24.859Z",
//     updatedAt: "2025-05-13T09:17:24.859Z",
//     __v: 0
//   },
//   {
//     _id: "u2",
//     name: "Samuel Y.",
//     contact: {
//       phone: "+251911223344",
//       email: "samuel@example.com",
//     },
//     credentials: {
//       password: "hashed_pass_2",
//       role: "Supervisor",
//     },
//     status: {
//       availability: "On Leave",
//       lastActive: new Date("2025-04-25T12:30:00Z"),
//     },
//     assignments: [],
//     salary: 12000,
//   },
//   {
//     _id: "u3",
//     name: "Alem H.",
//     contact: {
//       phone: "+251944556677",
//       email: "alem@example.com",
//     },
//     credentials: {
//       password: "hashed_pass_3",
//       role: "Technician",
//     },
//     status: {
//       availability: "Assigned",
//       lastActive: new Date("2025-04-28T14:15:00Z"),
//     },
//     assignments: [
//       {
//         manholeId: "MH-003",
//         task: "Repair",
//         date: new Date("2025-04-28"),
//       },
//     ],
//     salary: 7500,
//   },
// ];

// 🎯 Badge: Role
const RoleBadge = ({ role }) => {
  const map = {
    worker: {
      class: "bg-sky-100 text-sky-800 hover:bg-sky-200",
      icon: "👨‍🔧",
    },
    Technician: {
      class: "bg-sky-100 text-sky-800 hover:bg-sky-200",
      icon: "👨‍🔧",
    },
    Supervisor: {
      class: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      icon: "👨‍💼",
    },
    Admin: {
      class: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: "👑",
    },
  };

  return (
    <Badge className={`flex items-center ${map[role]?.class || "bg-gray-100 text-gray-800"}`}>
      <span className="mr-1">{map[role]?.icon}</span>
      {role}
    </Badge>
  );
};

// 🎯 Badge: Availability
const AvailabilityBadge = ({ availability }) => {
  const map = {
    available: {
      class: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: "✅",
    },
    Available: {
      class: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: "✅",
    },
    Assigned: {
      class: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      icon: "🛠️",
    },
    "On Leave": {
      class: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: "🏖️",
    },
  };

  return (
    <Badge className={`flex items-center ${map[availability]?.class || "bg-gray-100 text-gray-800"}`}>
      <span className="mr-1">{map[availability]?.icon}</span>
      {availability}
    </Badge>
  );
};

// 📄 Table columns
const columns = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.fullname || row.original.name}
        <div className="text-sm text-muted-foreground">
          ID: {row.original._id}
        </div>
      </div>
    ),
  },
  {
    header: "Contact",
    accessorFn: (row) => ({
      email: row.email || row.contact?.email,
      phone: row.address || row.contact?.phone // Using address as phone is not in new structure
    }),
    cell: ({ getValue }) => {
      const contact = getValue();
      return (
        <div>
          <div>{contact.phone}</div>
          <div className="text-sm text-muted-foreground">{contact.email}</div>
        </div>
      );
    },
  },
  {
    header: "Role",
    accessorFn: (row) => row.role || row.credentials?.role,
    cell: ({ getValue }) => <RoleBadge role={getValue()} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    header: "Status",
    accessorFn: (row) => row.status?.availability,
    cell: ({ getValue }) => <AvailabilityBadge availability={getValue()} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    header: "Last Active",
    accessorFn: (row) => row.lastLogin || row.status?.lastActive,
    cell: ({ getValue }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{format(new Date(getValue()), "yyyy-MM-dd HH:mm")}</span>
        </TooltipTrigger>
        <TooltipContent>
          {formatDistanceToNow(new Date(getValue()), { addSuffix: true })}
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    header: "Salary (ETB)",
    accessorKey: "salary",
    cell: ({ getValue }) => (
      <span className="font-medium">
        {getValue() ? (
          new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0
          }).format(getValue())
        ) : (
          "N/A"
        )}
      </span>
    ),
  },
  {
    header: "Assignments",
    accessorKey: "assignments",
    cell: ({ row }) => {
      const [expanded, setExpanded] = useState(false);
      const assignments = row.original.assignments;

      return (
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center"
          >
            {assignments.length} task{assignments.length !== 1 ? 's' : ''}
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </Button>
          {expanded && (
            <div className="mt-2 space-y-2">
              {assignments.length > 0 ? (
                assignments.map((a, idx) => (
                  <div
                    key={idx}
                    className="border p-2 rounded-md bg-muted/50 text-sm"
                  >
                    <div className="font-medium">{a.task}</div>
                    <div className="text-muted-foreground">
                      {a.manholeId} • {format(new Date(a.date), "MMM dd")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-2 text-center">
                  No current assignments
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete {user.fullname || user.name}'s account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      toast({
                        title: "User deleted",
                        description: `${user.fullname || user.name}'s account has been removed`,
                      });
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const UsersTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  // Removed unused variable
  const { users = [], getAllUsers } = useUserStore(); // Ensure users is initialized as an empty array

  useEffect(() => {
    getAllUsers()
  }, [])

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Users</h2>
          <p className="text-muted-foreground">
            Manage all registered users and their permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Select
            value={(table.getColumn("role")?.getFilterValue() || "").toString()}
            onValueChange={(value) => {
              table.getColumn("role")?.setFilterValue(value === "all" ? undefined : [value]);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("status.availability")?.getFilterValue() || "").toString()}
            onValueChange={(value) => {
              table.getColumn("status.availability")?.setFilterValue(value === "all" ? undefined : [value]);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            {table.getRowModel().rows.length ? (
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
                <TableCell colSpan={columns.length} className="text-center h-24">
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
          <strong>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </strong>{" "}
          of <strong>{table.getFilteredRowModel().rows.length}</strong> users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;