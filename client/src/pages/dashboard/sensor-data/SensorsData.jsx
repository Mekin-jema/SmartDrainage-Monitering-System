import React, { useEffect, useState, useRef } from "react";
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
import useSensorsStore from "@/store/useSensorsStore";
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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const statusColors = {
  normal: "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700",
  warning: "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700",
  critical: "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700",
  default: "bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700",
};

const columns = [
  {
    header: "Manhole ID",
    accessorKey: "manholeId",
    cell: (info) => (
      <span className="font-medium text-foreground">{info.getValue()}</span>
    ),
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent text-foreground"
      >
        Timestamp
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "createdAt",
    cell: (info) => {
      const rawValue = info.getValue();
      const date = new Date(rawValue);

      return (
        <span className="text-foreground">
          {isNaN(date.getTime())
            ? "Invalid date"
            : format(date, "yyyy-MM-dd HH:mm:ss")}
        </span>
      );
    }

  },
  {
    header: "Sewage Level (cm)",
    accessorKey: "sensors.sewageLevel",
    cell: (info) => (
      <span className="text-foreground">{info.getValue()} cm</span>
    ),
  },
  {
    header: "Methane Level (ppm)",
    accessorKey: "sensors.methaneLevel",
    cell: (info) => (
      <span className="text-foreground">{info.getValue()} ppm</span>
    ),
  },
  {
    header: "Flow Rate (L/s)",
    accessorKey: "sensors.flowRate",
    cell: (info) => (
      <span className="text-foreground">{info.getValue()} L/s</span>
    ),
  },
  {
    header: "Battery",
    accessorKey: "batteryLevel",
    cell: (info) => (
      <div className="flex items-center">
        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
          <div
            className={`h-2.5 rounded-full ${info.getValue() > 30
              ? "bg-green-500 dark:bg-green-400"
              : "bg-red-500 dark:bg-red-400"
              }`}
            style={{ width: `${info.getValue()}%` }}
          ></div>
        </div>
        <span className="text-foreground">{info.getValue()}%</span>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const value = info.getValue();
      const colorClass = statusColors[value] || statusColors.default;
      return (
        <Badge className={`${colorClass} text-white dark:text-gray-100`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      );
    },
  },
];

export default function SensorTable() {
  const [sensorReadings, setSensorReadings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const { manholes, fetchManholes } = useSensorsStore();
  const socketRef = useRef(null);

  console.log("Sensor Readings:", sensorReadings);

  useEffect(() => {
    // Fetch initial data
    try {
      setLoading(true);
      fetchManholes();
      setSensorReadings(manholes);
    } catch (err) {
      setError(err.message || "Failed to fetch sensor data");
    } finally {
      setLoading(false);
    }





    //  try {
    //     setLoading(true);
    //      fetchManholes();
    //     setSensorReadings(manholes);
    //   } catch (err) {
    //     setError(err.message || "Failed to fetch sensor data");
    //   } finally {
    //     setLoading(false);
    //   }
    //  



  }, [manholes, fetchManholes]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       setLoading(true);
  //       await fetchManholes();
  //       setSensorReadings(manholes);
  //     } catch (err) {
  //       setError(err.message || "Failed to fetch sensor data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [fetchManholes, manholes,]);

  console.log("Manholes Readings:", manholes);

  const table = useReactTable({
    data: sensorReadings,
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
        <span className="ml-2 text-foreground">Loading sensor data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Manhole Sensor Readings
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
                    row.original.status === "critical"
                      ? "bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50"
                      : row.original.status === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
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
                  No results.
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
          manholes
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