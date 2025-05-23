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

// Status and role definitions with fallbacks
const statuses = {
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
    "in-progress": { label: "In Progress", icon: Loader2, color: "bg-blue-500" },
    completed: { label: "Completed", icon: CheckCircle, color: "bg-green-500" },
    default: { label: "Unknown", icon: AlertCircle, color: "bg-gray-500" },
};

const priorities = {
    high: { label: "High", color: "bg-red-500" },
    medium: { label: "Medium", color: "bg-orange-500" },
    low: { label: "Low", color: "bg-green-500" },
    default: { label: "Unknown", color: "bg-gray-500" },
};

const userStatuses = {
    active: { label: "Active", color: "bg-green-500" },
    inactive: { label: "Inactive", color: "bg-gray-500" },
    default: { label: "Unknown", color: "bg-gray-500" },
};

const roles = {
    admin: { label: "Admin", color: "bg-purple-500" },
    supervisor: { label: "Supervisor", color: "bg-blue-500" },
    worker: { label: "Worker", color: "bg-orange-500" },
    default: { label: "Unknown", color: "bg-gray-500" },
};

// Safe accessor functions
const getStatusInfo = (status) => {
    return statuses[status] || statuses.default;
};

const getPriorityInfo = (priority) => {
    return priorities[priority] || priorities.default;
};

const getUserStatusInfo = (status) => {
    return userStatuses[status] || userStatuses.default;
};

const getRoleInfo = (role) => {
    return roles[role] || roles.default;
};

const AdminDashboard = () => {
    const { theme, setTheme } = useTheme();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("tasks");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [selectedUser, setSelectedUser] = useState("all");

    const { user, getAllUsers } = useUserStore();
    console.log("user", user);
    const { userOverview, fetchUserOverview } = useUserStore();
    const { fetchTasksOverviewWithList, task } = useTaskStore();


    useEffect(() => {
    
            try {
                setLoading(true);
                 getAllUsers();
                 fetchUserOverview();
                 fetchTasksOverviewWithList();
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            
        }


    }, []);

    useEffect(() => {
        if (task) {
            setTasks(task);
        }
    }, [task]);

    useEffect(() => {
        if (user) {
            setUsers(user);
        }
    }, [user]);

    const taskColumns = React.useMemo(() => [
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
                const user = users.find((u) => u.id === row.getValue("assignedTo"));
                return user ? user.name : "Unassigned";
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const statusValue = row.getValue("status") || "default";
                const status = getStatusInfo(statusValue);
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
                const priorityValue = row.getValue("priority") || "default";
                const priority = getPriorityInfo(priorityValue);
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
                    <Progress value={row.getValue("progress") || 0} className="h-2 w-[100px]" />
                    <span className="text-sm text-muted-foreground">
                        {row.getValue("progress") || 0}%
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
            cell: ({ row }) =>
                row.getValue("dueDate")
                    ? format(new Date(row.getValue("dueDate")), "MMM dd, yyyy")
                    : "No date",
        },
    ], [users]);

    const userColumns = React.useMemo(() => [
        {
            accessorKey: "fullname",
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
                const roleValue = row.getValue("role") || "default";
                const role = getRoleInfo(roleValue);
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
                const statusValue = row.getValue("status") || "default";
                const status = getUserStatusInfo(statusValue);
                return (
                    <Badge className={status.color}>
                        {statusValue.availability}

                    </Badge>
                );
            },
        },
{
  accessorKey: "assignments",
  header: "Tasks Assigned",
  cell: ({ row }) => {
    const assignments = row.getValue("assignments") || [];

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return <span>No tasks</span>;
    }

    return (
      <div className="flex flex-col gap-1">
        {assignments.map((task) => (
          <Badge key={task._id} className="w-fit bg-gray-400">
            <div className="text-left">
              <div>{task.task}</div>
              <div className="text-xs opacity-70">
                {format(new Date(task.date), "PPP")}
              </div>
            </div>
          </Badge>
        ))}
      </div>
    );
  },
}
    ], []);

    const filteredTasks = selectedUser === "all"
        ? tasks
        : tasks.filter((task) => task.assignedTo === selectedUser);

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
                        <div className="text-2xl font-bold">{userOverview.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            All system users
                        </p>
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                        <Badge variant="outline" className="text-sm">
                            {userOverview.activeWorkers}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {userOverview.activeWorkers}
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
                        <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
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
                                value={(userTable.getColumn("fullname")?.getFilterValue() ?? "")}
                                onChange={(event) =>
                                    userTable.getColumn("fullname")?.setFilterValue(event.target.value)
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