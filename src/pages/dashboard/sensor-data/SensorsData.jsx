"use client";

import React from "react";
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

// 🧪 Mock Data Based on Your SensorReadings Schema
const sensorReadings = [
  {
    _id: "1",
    manholeId: "MH001",
    timestamp: new Date(),
    sensors: {
      sewageLevel: 88,
      methaneLevel: 320,
      flowRate: 14.2,
      temperature: 26,
      humidity: 60,
      batteryLevel: 85,
    },
    thresholds: {
      maxDistance: 90,
      maxGas: 1000,
      minFlow: 3.0,
    },
    lastCalibration: new Date("2025-01-01"),
    batteryLevel: 85,
    status: "normal",
    alertTypes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    manholeId: "MH002",
    timestamp: new Date(),
    sensors: {
      sewageLevel: 98,
      methaneLevel: 1200,
      flowRate: 1.2,
      temperature: 30,
      humidity: 70,
      batteryLevel: 43,
    },
    thresholds: {
      maxDistance: 85,
      maxGas: 1000,
      minFlow: 2.5,
    },
    lastCalibration: new Date("2025-02-15"),
    batteryLevel: 43,
    status: "critical",
    alertTypes: ["sewage_overflow", "gas_leak"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    manholeId: "MH003",
    timestamp: new Date(),
    sensors: {
      sewageLevel: 75,
      methaneLevel: 600,
      flowRate: 6.5,
      temperature: 24,
      humidity: 50,
      batteryLevel: 67,
    },
    thresholds: {
      maxDistance: 90,
      maxGas: 1000,
      minFlow: 3.0,
    },
    lastCalibration: new Date("2025-03-10"),
    batteryLevel: 67,
    status: "warning",
    alertTypes: ["low_flow"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 🏷️ Status badge styling
const StatusBadge = ({ status }) => {
  const colors = {
    normal: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-700",
  };

  return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>;
};

// 🧾 Columns
const columns = [
  {
    header: "Manhole ID",
    accessorKey: "manholeId",
  },
  {
    header: "Sewage Level (cm)",
    accessorKey: "sensors.sewageLevel",
    cell: ({ row }) => row.original.sensors.sewageLevel,
  },
  {
    header: "Methane (ppm)",
    accessorKey: "sensors.methaneLevel",
    cell: ({ row }) => row.original.sensors.methaneLevel,
  },
  {
    header: "Flow Rate (L/s)",
    accessorKey: "sensors.flowRate",
    cell: ({ row }) => row.original.sensors.flowRate,
  },
  {
    header: "Battery (%)",
    accessorKey: "sensors.batteryLevel",
    cell: ({ row }) => row.original.sensors.batteryLevel + "%",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    header: "Alerts",
    accessorKey: "alertTypes",
    cell: ({ getValue }) =>
      getValue().length ? (
        getValue().map((type, index) => (
          <Badge key={index} className="bg-red-100 text-red-700 mr-1">
            {type}
          </Badge>
        ))
      ) : (
        <span className="text-muted-foreground italic">None</span>
      ),
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ getValue }) =>
      format(new Date(getValue()), "dd MMM yyyy, HH:mm"),
  },
];

const SensorsData = () => {
  const table = useReactTable({
    data: sensorReadings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Sensor Data (Mock)</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SensorsData;
