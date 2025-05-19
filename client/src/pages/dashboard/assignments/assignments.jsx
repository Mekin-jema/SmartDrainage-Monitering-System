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
    Users,
    UserPlus,
    FilePlus,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useTaskStore from "@/store/useTaskStore";

// Mock data for users and tasks
const mockUsers = [
    {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "worker",
        assignments: 5,
        status: "active",
    },
    {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "supervisor",
        assignments: 3,
        status: "active",
    },
    {
        id: "user-3",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "worker",
        assignments: 2,
        status: "inactive",
    },
    {
        id: "user-4",
        name: "Sarah Williams",
        email: "sarah@example.com",
        role: "admin",
        assignments: 0,
        status: "active",
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

const userStatuses = {
    active: { label: "Active", color: "bg-green-500" },
    inactive: { label: "Inactive", color: "bg-gray-500" },
};

const roles = {
    admin: { label: "Admin", color: "bg-purple-500" },
    supervisor: { label: "Supervisor", color: "bg-blue-500" },
    worker: { label: "Worker", color: "bg-orange-500" },
};

const taskColumns = [
    {
        accessorKey: "code",
        header: "Manhole Code",
        cell: ({ row }) => (
            <div className="font-medium">🧱 {row.getValue("code")}</div>
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
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => {
            const user = mockUsers.find(u => u.id === row.getValue("assignedTo"));
            return user ? user.name : "Unassigned";
        },
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

const userColumns = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = roles[row.getValue("role")];
            return (
                <Badge className={role.color}>
                    {role.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = userStatuses[row.getValue("status")];
            return (
                <Badge className={status.color}>
                    {status.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "assignments",
        header: "Tasks Assigned",
    },
];

const AdminDashboard = () => {
    const { user } = useUserStore();
    const { theme, setTheme } = useTheme();
    const [task, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("tasks");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [selectedUser, setSelectedUser] = useState("all");

       const {userOverview, fetchUserOverview}=useUserStore();
      const  {fetchTasksOverviewWithList,  overview,tasks }=useTaskStore();
    console.log("userOverview",userOverview);

    useEffect(() => {

        fetchUserOverview()
        fetchTasksOverviewWithList()
        const fetchMockData = () => {
            setTimeout(() => {
                setTasks(tasks);
                setUsers(mockUsers);
                setLoading(false);
            }, 1000);
        };

        if (user?._id) {
            try {
                fetchMockData();
            } catch (err) {
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        }
    }, [user]);

    const filteredTasks = selectedUser === "all" 
        ? task
        : task.filter(task => task.assignedTo === selectedUser);

    const taskTable = useReactTable({
        data: filteredTasks,
        columns: taskColumns,
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

    const userTable = useReactTable({
        data: users,
        columns: userColumns,
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
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.name || "Admin"}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userOverview. totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            All system users
                        </p>
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                        <Badge variant="outline" className="text-sm">
                            {userOverview. activeWorkers}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                                {userOverview. activeWorkers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Available for tasks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <Badge variant="outline" className="text-sm">
                            {task.length}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{task.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All assigned tasks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {task.filter(t => t.status === "completed").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Finished tasks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex space-x-4">
                <Button
                    variant={activeTab === "task" ? "default" : "outline"}
                    onClick={() => setActiveTab("task")}
                >
                    Task Management
                </Button>
                <Button
                    variant={activeTab === "users" ? "default" : "outline"}
                    onClick={() => setActiveTab("users")}
                >
                    User Management
                </Button>
            </div>

            {activeTab === "task" ? (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Task Management</CardTitle>
                                <CardDescription>
                                    View and manage all tasks assigned to workers
                                </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        {users.map(user => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button>
                                    <FilePlus className="mr-2 h-4 w-4" />
                                    New Task
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Filter tasks..."
                                value={(taskTable.getColumn("description")?.getFilterValue() ?? "")}
                                onChange={(event) =>
                                    taskTable.getColumn("description")?.setFilterValue(event.target.value)
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
                                                taskTable.getColumn("status")?.setFilterValue([status]);
                                            }}
                                        >
                                            {statuses[status].label}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            taskTable.getColumn("status")?.setFilterValue(undefined);
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
                                    {taskTable.getHeaderGroups().map((headerGroup) => (
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
                                    {taskTable.getRowModel().rows?.length ? (
                                        taskTable.getRowModel().rows.map((row) => (
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
                                                colSpan={taskColumns.length}
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
                                {taskTable.getFilteredSelectedRowModel().rows.length} of{" "}
                                {taskTable.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => taskTable.firstPage()}
                                    disabled={!taskTable.getCanPreviousPage()}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => taskTable.previousPage()}
                                    disabled={!taskTable.getCanPreviousPage()}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => taskTable.nextPage()}
                                    disabled={!taskTable.getCanNextPage()}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => taskTable.lastPage()}
                                    disabled={!taskTable.getCanNextPage()}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    View and manage all system users
                                </CardDescription>
                            </div>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Filter users..."
                                value={(userTable.getColumn("name")?.getFilterValue() ?? "")}
                                onChange={(event) =>
                                    userTable.getColumn("name")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Filter Role
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {Object.keys(roles).map((role) => (
                                        <DropdownMenuItem
                                            key={role}
                                            onSelect={() => {
                                                userTable.getColumn("role")?.setFilterValue([role]);
                                            }}
                                        >
                                            {roles[role].label}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            userTable.getColumn("role")?.setFilterValue(undefined);
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
                                    {userTable.getHeaderGroups().map((headerGroup) => (
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
                                    {userTable.getRowModel().rows?.length ? (
                                        userTable.getRowModel().rows.map((row) => (
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
                                                colSpan={userColumns.length}
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
                                {userTable.getFilteredSelectedRowModel().rows.length} of{" "}
                                {userTable.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => userTable.firstPage()}
                                    disabled={!userTable.getCanPreviousPage()}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => userTable.previousPage()}
                                    disabled={!userTable.getCanPreviousPage()}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => userTable.nextPage()}
                                    disabled={!userTable.getCanNextPage()}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => userTable.lastPage()}
                                    disabled={!userTable.getCanNextPage()}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboard;