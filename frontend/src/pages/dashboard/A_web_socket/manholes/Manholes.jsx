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

// 🧪 Mock Manholes Data
const manholes = [
  {
    _id: "1",
    code: "MH-001",
    location: {
      coordinates: [38.7635, 9.0301],
      address: "Addis Ababa, Bole",
      zone: "Zone A",
    },
    installedDate: new Date("2020-05-20"),
    lastInspection: new Date("2025-03-10"),
    status: "functional",
    notes: "Installed near school",
  },
  {
    _id: "2",
    code: "MH-002",
    location: {
      coordinates: [38.7540, 9.0234],
      address: "Addis Ababa, Yeka",
      zone: "Zone B",
    },
    installedDate: new Date("2021-03-15"),
    lastInspection: new Date("2025-02-01"),
    status: "damaged",
    notes: "Cover broken, needs replacement",
  },
  {
    _id: "3",
    code: "MH-003",
    location: {
      coordinates: [38.7610, 9.0268],
      address: "Addis Ababa, Kirkos",
      zone: "Zone C",
    },
    installedDate: new Date("2019-08-10"),
    lastInspection: new Date("2025-01-10"),
    status: "under_maintenance",
    notes: "Pipe repair ongoing",
  },
];

// 🏷️ Status Badge UI
const StatusBadge = ({ status }) => {
  const colors = {
    functional: "bg-green-100 text-green-800",
    damaged: "bg-red-100 text-red-800",
    under_maintenance: "bg-yellow-100 text-yellow-800",
  };
  const label = {
    functional: "Functional",
    damaged: "Damaged",
    under_maintenance: "Under Maintenance",
  };

  return <Badge className={colors[status]}>{label[status]}</Badge>;
};

// 📄 Table Columns
const columns = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Zone",
    accessorKey: "location.zone",
    cell: ({ row }) => row.original.location.zone,
  },
  {
    header: "Address",
    accessorKey: "location.address",
    cell: ({ row }) => row.original.location.address,
  },
  {
    header: "Coordinates",
    accessorKey: "location.coordinates",
    cell: ({ row }) =>
      row.original.location.coordinates.map((val) => val.toFixed(4)).join(", "),
  },
  {
    header: "Installed",
    accessorKey: "installedDate",
    cell: ({ getValue }) => format(new Date(getValue()), "yyyy-MM-dd"),
  },
  {
    header: "Last Inspection",
    accessorKey: "lastInspection",
    cell: ({ getValue }) => format(new Date(getValue()), "yyyy-MM-dd"),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    header: "Notes",
    accessorKey: "notes",
  },
];

const Manholes = () => {
  const table = useReactTable({
    data: manholes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manholes Overview</h2>
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
                  No manholes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Manholes;
