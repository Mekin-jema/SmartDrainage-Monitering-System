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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { AlertCircle, CheckCircle, Clock, Filter, MoreHorizontal, RefreshCw, Search } from "lucide-react";
import useAlertStore from "@/store/useAlertStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";



const SeverityBadge = ({ level }) => {
  const config = {
    critical: {
      class: "bg-red-600 text-white hover:bg-red-700",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
    },
    high: {
      class: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
    },
    medium: {
      class: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
    },
    low: {
      class: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
    },
  };

  return (
    <Badge className={`flex items-center ${config[level]?.class || ""}`}>
      {config[level]?.icon}
      {level?.toUpperCase()}
    </Badge>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    open: {
      class: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: "OPEN",
    },
    "in-progress": {
      class: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      icon: <RefreshCw className="w-3 h-3 mr-1" />,
      label: "IN PROGRESS",
    },
    resolved: {
      class: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: "RESOLVED",
    },
  };

  return (
    <Badge className={`flex items-center ${config[status]?.class || ""}`}>
      {config[status]?.icon}
      {config[status]?.label}
    </Badge>
  );
};

const columns = [
  {
    header: "Alert Type",
    accessorKey: "type",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium cursor-default">{row.original.type}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>ID: {row.original.id}</p>
          {row.original.notes && <p>Notes: {row.original.notes}</p>}
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    header: "Severity",
    accessorKey: "severity",
    cell: ({ getValue }) => <SeverityBadge level={getValue()} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    header: "Manhole ID",
    accessorKey: "manholeId",
    cell: ({ getValue }) => `MH-${getValue()}`,
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ getValue }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{format(new Date(getValue()), "MMM dd, yyyy HH:mm")}</span>
        </TooltipTrigger>
        <TooltipContent>
          {formatDistanceToNow(new Date(getValue()), { addSuffix: true })}
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const alert = row.original;
      const { toast } = useToast();
      const { updateAlertStatus } = useAlertStore();

      const handleStatusChange = async (newStatus) => {
        try {
          await updateAlertStatus(alert.id, newStatus);
          toast({
            title: "Status updated",
            description: `Alert #${alert.id} is now ${newStatus}`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update alert status",
            variant: "destructive",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(alert.id.toString())}
            >
              Copy Alert ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("resolved")}>
              Mark as Resolved
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  Delete Alert
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete alert #{alert.id}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      // Add delete logic here
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

const AlertsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { recentAlerts, fetchRecentAlerts } = useAlertStore();
  console.log(recentAlerts);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchRecentAlerts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch alerts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up polling every 30 seconds
    const intervalId = setInterval(loadData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const table = useReactTable({
    data: recentAlerts,
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

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchRecentAlerts();
      toast({
        title: "Refreshed",
        description: "Alerts data has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh alerts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sewage System Alerts</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of system alerts and issues
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            className="pl-8"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Select
            value={table.getColumn("severity")?.getFilterValue()}
            onValueChange={(value) => {
              table.getColumn("severity")?.setFilterValue(value === "all" ? undefined : [value]);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("status")?.getFilterValue())}
            onValueChange={(value) => {
              table.getColumn("status")?.setFilterValue(value === "all" ? undefined : [value]);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={`skeleton-cell-${i}-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.original.severity === "critical" ? "bg-red-50/50" : ""}
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
                  No alerts found.
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
          of <strong>{table.getFilteredRowModel().rows.length}</strong> alerts
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
              {[10, 20, 30, 40, 50].map((pageSize) => (
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

export default AlertsTable;