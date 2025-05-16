import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

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
    CheckCircle,
    Clock,
    Sun,
    Moon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { useTheme } from "../theme-provider";

const mockTasks = [
    {
        id: "MH-101",
        description: "Inspect and clean the drainage system",
        status: "pending",
        priority: "high",
        location: "Addis Ketema, Sector 3",
        assignedDate: "2025-05-10",
        dueDate: "2025-05-15",
        progress: 0,
    },
    {
        id: "MH-202",
        description: "Report overflow and check gas levels",
        status: "in-progress",
        priority: "medium",
        location: "Kirkos Sub-city, Zone B",
        assignedDate: "2025-05-11",
        dueDate: "2025-05-16",
        progress: 45,
    },
    {
        id: "MH-303",
        description: "Routine maintenance check and seal cracks",
        status: "completed",
        priority: "low",
        location: "Bole Michael, Block D",
        assignedDate: "2025-05-12",
        dueDate: "2025-05-14",
        progress: 100,
    },
    {
        id: "MH-404",
        description: "Install new sensors and test functionality",
        status: "in-progress",
        priority: "high",
        location: "Yeka Sub-city, Zone 4",
        assignedDate: "2025-05-13",
        dueDate: "2025-05-18",
        progress: 30,
    },
    {
        id: "MH-505",
        description: "Clear debris from main drainage line",
        status: "pending",
        priority: "medium",
        location: "Lideta Sub-city, Block A",
        assignedDate: "2025-05-14",
        dueDate: "2025-05-20",
        progress: 0,
    },
];

const statuses = {
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
    "in-progress": { label: "In Progress", icon: Loader2, color: "bg-blue-500" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-green-500" },
};

const priorities = {
    high: { label: "High", color: "bg-red-500" },
    medium: { label: "Medium", color: "bg-orange-500" },
    low: { label: "Low", color: "bg-green-500" },
};

const columns = [
    {
        accessorKey: "id",
        header: "Manhole ID",
        cell: ({ row }) => (
            <div className="font-medium">🧱 {row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = statuses[row.getValue("status")];
            const Icon = status.icon;

            return (
                <Badge variant="outline" className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {status.label}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = priorities[row.getValue("priority")];

            return (
                <Badge className={priority.color}>
                    {priority.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Progress value={row.getValue("progress")} className="h-2 w-[100px]" />
                <span className="text-sm text-muted-foreground">
                    {row.getValue("progress")}%
                </span>
            </div>
        ),
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => format(new Date(row.getValue("dueDate")), "MMM dd, yyyy"),
    },
];

const WorkerDashboard = () => {
    const { user } = useUserStore();
    const { theme, setTheme } = useTheme();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        const fetchMockTasks = () => {
            setTimeout(() => {
                setTasks(mockTasks);
                setLoading(false);
            }, 1000);
        };

        if (user?._id) {
            try {
                fetchMockTasks();
            } catch (err) {
                setError("Failed to load tasks. Please try again later.");
                setLoading(false);
            }
        }
    }, [user]);

    const table = useReactTable({
        data: tasks,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Worker Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.name || "Worker"}
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <Badge variant="outline" className="text-sm">
                            {tasks.length}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tasks.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All assigned tasks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tasks.filter(t => t.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tasks not yet started
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tasks.filter(t => t.status === "in-progress").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active tasks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tasks.filter(t => t.status === "completed").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Finished tasks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Tasks</CardTitle>
                    <CardDescription>
                        All your assigned tasks with status and progress
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter tasks..."
                            value={(table.getColumn("description")?.getFilterValue() ?? "")}
                            onChange={(event) =>
                                table.getColumn("description")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Filter Status
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {Object.keys(statuses).map((status) => (
                                    <DropdownMenuItem
                                        key={status}
                                        onSelect={() => {
                                            table.getColumn("status")?.setFilterValue([status]);
                                        }}
                                    >
                                        {statuses[status].label}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                    onSelect={() => {
                                        table.getColumn("status")?.setFilterValue(undefined);
                                    }}
                                >
                                    Clear Filter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkerDashboard;