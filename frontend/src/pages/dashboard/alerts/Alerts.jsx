"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
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
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, User } from "lucide-react";

// Mock Alerts Data
const alerts = [
  {
    _id: "a1",
    manholeId: "MH-001",
    sensorId: "SENSOR-ULTR-001",
    alertType: "sewage_overflow",
    alertLevel: "critical",
    description: "Water level exceeded 90cm threshold",
    timestamp: new Date("2025-04-28T09:00:00Z"),
    status: "Pending",
    assignedWorker: {
      id: "w123",
      name: "Abebe Kebede"
    },
    actions: [
      {
        workerId: "w123",
        action: "Acknowledged",
        notes: "Dispatched emergency response team",
        timestamp: new Date("2025-04-28T09:10:00Z"),
      },
    ],
    resolutionNotes: "",
  },
  {
    _id: "a2",
    manholeId: "MH-002",
    sensorId: "SENSOR-GAS-002",
    alertType: "gas_leak",
    alertLevel: "warning",
    description: "Methane levels reached 750ppm (threshold: 700ppm)",
    timestamp: new Date("2025-04-28T10:00:00Z"),
    status: "Resolved",
    assignedWorker: {
      id: "w456",
      name: "Mekdes Tilahun"
    },
    actions: [
      {
        workerId: "w456",
        action: "Acknowledged",
        notes: "Initial assessment completed",
        timestamp: new Date("2025-04-28T10:15:00Z"),
      },
      {
        workerId: "w456",
        action: "Repaired",
        notes: "Replaced faulty gas sensor and sealed leak",
        timestamp: new Date("2025-04-28T11:00:00Z"),
      },
    ],
    resolutionNotes: "Gas levels normalized after repair",
  },
  {
    _id: "a3",
    manholeId: "MH-005",
    sensorId: "SENSOR-PRES-005",
    alertType: "pressure_build_up",
    alertLevel: "warning",
    description: "Pressure exceeding normal operating range",
    timestamp: new Date("2025-04-29T14:30:00Z"),
    status: "Assigned",
    assignedWorker: {
      id: "w789",
      name: "Yohannes Assefa"
    },
    actions: [
      {
        workerId: "w789",
        action: "Acknowledged",
        notes: "Scheduled inspection for tomorrow",
        timestamp: new Date("2025-04-29T15:00:00Z"),
      },
    ],
    resolutionNotes: "",
  },
];

const LevelBadge = ({ level }) => {
  const config = {
    warning: {
      class: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    },
    critical: {
      class: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    },
  };
  
  return (
    <Badge className={`flex items-center ${config[level].class}`}>
      {config[level].icon}
      {level.toUpperCase()}
    </Badge>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    Pending: {
      class: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      icon: <Clock className="w-3 h-3 mr-1" />
    },
    Assigned: {
      class: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      icon: <User className="w-3 h-3 mr-1" />
    },
    Resolved: {
      class: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />
    },
  };
  
  return (
    <Badge className={`flex items-center ${config[status].class}`}>
      {config[status].icon}
      {status}
    </Badge>
  );
};

const columns = [
  {
    header: "Alert Type",
    accessorKey: "alertType",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className="capitalize">
          {value.replace(/_/g, ' ')}
        </span>
      );
    },
  },
  {
    header: "Level",
    accessorKey: "alertLevel",
    cell: ({ getValue }) => <LevelBadge level={getValue()} />,
  },
  {
    header: "Manhole ID",
    accessorKey: "manholeId",
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate hover:max-w-none">
        {getValue()}
      </div>
    ),
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ getValue }) => format(new Date(getValue()), "MMM dd, yyyy HH:mm"),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    header: "Assigned To",
    accessorKey: "assignedWorker",
    cell: ({ getValue }) => getValue()?.name || "Unassigned",
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      const [expanded, setExpanded] = useState(false);
      const actions = row.original.actions || [];
      
      return (
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? "Hide Details" : "View Details"}
          </Button>
          
          {expanded && actions.length > 0 && (
            <div className="mt-2 space-y-2">
              {actions.map((action, idx) => (
                <div 
                  key={`${row.id}-action-${idx}`}
                  className="p-2 text-sm border rounded bg-muted/50"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Action</p>
                      <p className="font-medium">{action.action}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">By</p>
                      <p className="font-medium">{action.workerId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {format(new Date(action.timestamp), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  {action.notes && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm">{action.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
];

const AlertsTable = () => {
  const table = useReactTable({
    data: alerts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sewage System Alerts</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Export</Button>
          <Button>New Alert</Button>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
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
                  No alerts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AlertsTable;