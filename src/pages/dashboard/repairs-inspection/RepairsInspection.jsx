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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// 🧪 Sample maintenance logs
const logs = [
  {
    _id: "log001",
    manholeId: "MH-001",
    userId: "user01",
    type: "inspection",
    description: "Routine inspection of cover and flow.",
    status: "completed",
    scheduledDate: new Date("2025-04-25"),
    actualStart: new Date("2025-04-25T08:00:00Z"),
    actualEnd: new Date("2025-04-25T09:30:00Z"),
    partsReplaced: [],
    notes: "Everything normal.",
    createdAt: new Date("2025-04-24"),
    updatedAt: new Date("2025-04-25"),
  },
  {
    _id: "log002",
    manholeId: "MH-002",
    userId: "user02",
    type: "repair",
    description: "Replaced rusted bolts and fixed minor crack.",
    status: "in_progress",
    scheduledDate: new Date("2025-04-27"),
    actualStart: new Date("2025-04-27T10:00:00Z"),
    actualEnd: null,
    partsReplaced: [
      { name: "Bolt", quantity: 4 },
      { name: "Sealant", quantity: 1 },
    ],
    notes: "Work ongoing. Crack sealing remains.",
    createdAt: new Date("2025-04-26"),
    updatedAt: new Date("2025-04-27"),
  },
];

// 🏷️ Status badge
const StatusBadge = ({ status }) => {
  const colors = {
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  };
  return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
};

// 📄 Columns for maintenance table
const columns = [
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => (
      <Badge className="capitalize">{getValue()}</Badge>
    ),
  },
  {
    header: "Manhole ID",
    accessorKey: "manholeId",
  },
  {
    header: "User ID",
    accessorKey: "userId",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    header: "Scheduled",
    accessorFn: (row) => row.scheduledDate,
    cell: ({ getValue }) => format(getValue(), "yyyy-MM-dd"),
  },
  {
    header: "Start",
    accessorFn: (row) => row.actualStart,
    cell: ({ getValue }) =>
      getValue() ? format(new Date(getValue()), "yyyy-MM-dd HH:mm") : "-",
  },
  {
    header: "End",
    accessorFn: (row) => row.actualEnd,
    cell: ({ getValue }) =>
      getValue() ? format(new Date(getValue()), "yyyy-MM-dd HH:mm") : "-",
  },
  {
    header: "Parts Replaced",
    accessorKey: "partsReplaced",
    cell: ({ row }) => {
      const parts = row.original.partsReplaced;
      return parts.length ? (
        <div className="space-y-1">
          {parts.map((p, i) => (
            <div key={i} className="text-sm">
              {p.quantity}× {p.name}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-muted">None</span>
      );
    },
  },
  {
    header: "Notes",
    accessorKey: "notes",
  },
];

const RepairsInspection = () => {
  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Repairs & Inspections</h2>
      <div className="rounded-md border overflow-x-auto">
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
                  No maintenance logs available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RepairsInspection;
