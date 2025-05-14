import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/useUserStore";

// Updated mock data structure
const maintenanceLogs = [
  {
    id: 1,
    manhole: "#MH-004",
    manholeId: "6822618bad9fa0404078909c",
    type: "emergency",
    status: "scheduled",
    date: "2025-05-01",
    description: "Emergency repair due to structural damage",
    assignedTo: "Tech-001",
    createdAt: "2025-04-30T09:00:00",
    updatedAt: "2025-04-30T09:30:00",
  },
  {
    id: 2,
    manhole: "#MH-007",
    manholeId: "6822618bad9fa0404078909d",
    type: "routine",
    status: "in_progress",
    date: "2025-05-02",
    description: "Routine inspection and cleaning",
    assignedTo: "Tech-002",
    createdAt: "2025-04-28T14:00:00",
    updatedAt: "2025-05-01T10:15:00",
  },
  {
    id: 3,
    manhole: "#MH-012",
    manholeId: "6822618bad9fa0404078909e",
    type: "preventive",
    status: "completed",
    date: "2025-04-25",
    description: "Preventive maintenance for gas detection system",
    assignedTo: "Tech-003",
    createdAt: "2025-04-20T08:00:00",
    updatedAt: "2025-04-25T16:45:00",
  },
  {
    id: 4,
    manhole: "#MH-009",
    manholeId: "6822618bad9fa0404078909f",
    type: "emergency",
    status: "scheduled",
    date: "2025-05-05",
    description: "Emergency response to reported flooding",
    assignedTo: "Tech-001",
    createdAt: "2025-05-01T15:30:00",
    updatedAt: "2025-05-01T15:30:00",
  },
  {
    id: 5,
    manhole: "#MH-003",
    manholeId: "6822618bad9fa040407890a0",
    type: "routine",
    status: "pending",
    date: "2025-05-10",
    description: "Monthly structural integrity check",
    assignedTo: "Tech-004",
    createdAt: "2025-04-30T11:00:00",
    updatedAt: "2025-04-30T11:00:00",
  },
  {
    id: 6,
    manhole: "#MH-015",
    manholeId: "6822618bad9fa040407890a1",
    type: "preventive",
    status: "in_progress",
    date: "2025-05-03",
    description: "Valve replacement and system check",
    assignedTo: "Tech-002",
    createdAt: "2025-04-29T13:00:00",
    updatedAt: "2025-05-03T09:20:00",
  },
  {
    id: 7,
    manhole: "#MH-001",
    manholeId: "6822618bad9fa040407890a2",
    type: "emergency",
    status: "completed",
    date: "2025-04-28",
    description: "Immediate repair of cracked lid",
    assignedTo: "Tech-005",
    createdAt: "2025-04-27T16:45:00",
    updatedAt: "2025-04-28T14:30:00",
  },
];


const statuses = {
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  pending: { label: "Pending", color: "bg-gray-100 text-gray-800" },
};

const types = {
  routine: { label: "Routine", color: "bg-purple-100 text-purple-800" },
  emergency: { label: "Emergency", color: "bg-red-100 text-red-800" },
  preventive: { label: "Preventive", color: "bg-orange-100 text-orange-800" },
};

export const MaintenanceLogsTable = () => {
  const { toast } = useToast();
  const [columnFilters, setColumnFilters] = useState < ColumnFiltersState > ([]);
  const [sorting, setSorting] = useState < SortingState > ([]);
  const [pagination, setPagination] = useState < PaginationState > ({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const columns = useMemo < ColumnDef < MaintenanceLog > [] > (
    () => [
      {
        accessorKey: "manhole",
        header: "Manhole",
        cell: ({ row }) => (
          <div className="font-medium">
            <Tooltip>
              <TooltipTrigger>{row.getValue("manhole")}</TooltipTrigger>
              <TooltipContent>
                <p>ID: {row.original.manholeId}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type")
          return (
            <Badge className={types[type].color}>
              {types[type].label}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger className="text-left line-clamp-1 max-w-[200px]">
              {row.getValue("description")}
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>{row.getValue("description")}</p>
            </TooltipContent>
          </Tooltip>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status")
          return (
            <Badge className={statuses[status].color}>
              {statuses[status].label}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "date",
        header: "Scheduled Date",
        cell: ({ row }) => format(new Date(row.getValue("date")), "MMM dd, yyyy"),
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned To",
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger>
              {formatDistanceToNow(new Date(row.getValue("updatedAt")), {
                addSuffix: true,
              })}
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(row.getValue("updatedAt")), "PPpp")}
            </TooltipContent>
          </Tooltip>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const log = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(log.manholeId)}
                >
                  Copy manhole ID
                </DropdownMenuItem>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuSeparator />
                {log.status !== "completed" && (
                  <>
                    <DropdownMenuItem>Update status</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                  </>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Delete log
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this log?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the maintenance log for {log.manhole}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          toast({
                            title: "Log deleted",
                            description: `Maintenance log for ${log.manhole} has been deleted.`,
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
    ],
    [toast]
  );

  const table = useReactTable({
    data: maintenanceLogs,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Maintenance logs have been updated.",
      });
    }, 1000);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Maintenance Logs</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Log
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search logs..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(statuses).map(([key, { label }]) => (
                <DropdownMenuItem
                  key={key}
                  onSelect={() => {
                    const statusFilter = table
                      .getColumn("status")
                      ?.getFilterValue();
                    if (statusFilter === key) {
                      table.getColumn("status")?.setFilterValue(undefined);
                    } else {
                      table.getColumn("status")?.setFilterValue(key);
                    }
                  }}
                >
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(types).map(([key, { label }]) => (
                <DropdownMenuItem
                  key={key}
                  onSelect={() => {
                    const typeFilter = table
                      .getColumn("type")
                      ?.getFilterValue();
                    if (typeFilter === key) {
                      table.getColumn("type")?.setFilterValue(undefined);
                    } else {
                      table.getColumn("type")?.setFilterValue(key);
                    }
                  }}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} logs
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
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
              onClick={() =>
                table.setPageIndex(table.getPageCount() - 1)
              }
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};