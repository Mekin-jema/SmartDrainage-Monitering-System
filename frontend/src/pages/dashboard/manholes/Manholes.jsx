
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
import { useManholeStore } from "@/store/useManholeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight, Search, AlertCircle, CheckCircle2, Wrench, Gauge, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const statusIcons = {
  functional: <CheckCircle2 className="h-4 w-4 mr-1" />,
  damaged: <AlertCircle className="h-4 w-4 mr-1" />,
  maintenance: <Wrench className="h-4 w-4 mr-1" />,
};

const overflowColors = {
  good: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
  moderate: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
  overflow: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200",
  unknown: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
};

const columns = [
  {
    header: "Code",
    accessorKey: "code",
    cell: ({ row }) => (
      <div className="font-medium text-primary">
        #{row.getValue("code")}
      </div>
    ),
  },
  {
    header: "Zone",
    accessorKey: "zone",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-primary/20">
        {row.getValue("zone")}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="flex items-center">
          {statusIcons[row.original.status]}
          <Badge
            variant={
              row.original.status === "functional"
                ? "success"
                : row.original.status === "damaged"
                  ? "destructive"
                  : "warning"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    header: "Cover",
    accessorKey: "cover_status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.cover_status === "closed" ? "secondary" : "outline"}
        className={row.original.cover_status === "open" ? "border-rose-200 text-rose-800 dark:border-rose-800 dark:text-rose-200" : ""}
      >
        {row.original.cover_status === "closed" ? "Secured" : "Unsecured"}
      </Badge>
    ),
  },
  {
    header: "Overflow",
    accessorKey: "overflow_level",
    cell: ({ row }) => {
      const level = row.getValue("overflow_level");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className={`flex items-center px-3 py-1 rounded-full ${overflowColors[row.original.overflow_level]}`}>
                <Gauge className="h-3 w-3 mr-2" />
                <span className="text-xs font-medium capitalize">{level}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Water level status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: "Elevation",
    accessorKey: "elevation",
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {row.getValue("elevation")}m
      </div>
    ),
  },
  {
    header: "Last Inspection",
    accessorKey: "lastInspection",
    cell: ({ getValue }) => (
      <div className="flex items-center text-sm">
        <Calendar className="h-4 w-4 mr-2 opacity-70" />
        {format(new Date(getValue()), "MMM d, yyyy")}
      </div>
    ),
  },
];

export default function ManholeTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [manholes, setManholes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchManholes, manholesData } = useManholeStore();
  console.log("manholes data ", manholesData);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchManholes();
        setManholes(manholesData);
      } catch (error) {
        console.error("Failed to fetch manholes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchManholes]);

  const table = useReactTable({
    data: manholes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <Card className="p-4 bg-background">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Manhole Monitoring System</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search manholes..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {manholes.length} manholes
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}