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

// 🧪 Mock Users Data
const users = [
  {
    _id: "u1",
    name: "Mekdes T.",
    contact: {
      phone: "+251912345678",
      email: "mekdes@example.com",
    },
    credentials: {
      password: "hashed_pass_1",
      role: "Technician",
    },
    status: {
      availability: "Available",
      lastActive: new Date("2025-04-28T09:00:00Z"),
    },
    assignments: [
      {
        manholeId: "MH-001",
        task: "Inspection",
        date: new Date("2025-04-27"),
      },
    ],
    salary: 8000,
  },
  {
    _id: "u2",
    name: "Samuel Y.",
    contact: {
      phone: "+251911223344",
      email: "samuel@example.com",
    },
    credentials: {
      password: "hashed_pass_2",
      role: "Supervisor",
    },
    status: {
      availability: "On Leave",
      lastActive: new Date("2025-04-25T12:30:00Z"),
    },
    assignments: [],
    salary: 12000,
  },
];

// 🎯 Badge: Role
const RoleBadge = ({ role }) => {
  const map = {
    Technician: "bg-sky-100 text-sky-800",
    Supervisor: "bg-purple-100 text-purple-800",
    Admin: "bg-green-100 text-green-800",
  };
  return <Badge className={map[role] || "bg-gray-100 text-gray-800"}>{role}</Badge>;
};

// 🎯 Badge: Availability
const AvailabilityBadge = ({ availability }) => {
  const map = {
    Available: "bg-green-100 text-green-800",
    Assigned: "bg-yellow-100 text-yellow-800",
    "On Leave": "bg-red-100 text-red-800",
  };
  return <Badge className={map[availability]}>{availability}</Badge>;
};

// 📄 Table columns
const columns = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Phone",
    accessorFn: (row) => row.contact.phone,
  },
  {
    header: "Email",
    accessorFn: (row) => row.contact.email,
  },
  {
    header: "Role",
    accessorFn: (row) => row.credentials.role,
    cell: ({ getValue }) => <RoleBadge role={getValue()} />,
  },
  {
    header: "Availability",
    accessorFn: (row) => row.status.availability,
    cell: ({ getValue }) => <AvailabilityBadge availability={getValue()} />,
  },
  {
    header: "Last Active",
    accessorFn: (row) => row.status.lastActive,
    cell: ({ getValue }) =>
      format(new Date(getValue()), "yyyy-MM-dd HH:mm"),
  },
  {
    header: "Salary (ETB)",
    accessorKey: "salary",
  },
  {
    header: "Assignments",
    accessorKey: "assignments",
    cell: ({ row }) => {
      const [expanded, setExpanded] = useState(false);
      const assignments = row.original.assignments;

      return (
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Hide" : "View"}
          </Button>
          {expanded && assignments.length > 0 ? (
            <div className="mt-2 space-y-1 text-sm">
              {assignments.map((a, idx) => (
                <div
                  key={idx}
                  className="border p-2 rounded-md bg-muted"
                >
                  <div>
                    <strong>Manhole:</strong> {a.manholeId}
                  </div>
                  <div>
                    <strong>Task:</strong> {a.task}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {format(new Date(a.date), "yyyy-MM-dd")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            expanded && <div className="text-muted text-sm mt-1">No tasks</div>
          )}
        </div>
      );
    },
  },
];

const Users = () => {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Users</h2>
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
