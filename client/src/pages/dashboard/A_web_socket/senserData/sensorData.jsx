"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "../useContext/SocketContext";
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

// 🏷️ Status badge styling
const StatusBadge = ({ status }) => {
  const colors = {
    normal: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-700",
  };

  return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>;
};

// 🧾 Columns definition
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
  const [sensorReadings, setSensorReadings] = useState([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleSensorData = (data) => {

      setSensorReadings((prev) => {
        const exists = prev.find((item) => item._id === data._id);
        if (exists) {
          return prev.map((item) => (item._id === data._id ? data : item));
        }
        return [...prev, data];
      });
    };

    socket.on("sensorData", handleSensorData);

    return () => {
      socket.off("sensorData", handleSensorData);
    };
  }, [socket]);

  const table = useReactTable({
    data: sensorReadings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Live Sensor Data {isConnected ? "(Connected)" : "(Disconnected)"}
      </h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
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
                <TableRow key={row.id}>
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
