import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Using the updated import pattern
import { ChevronDown } from 'lucide-react';

// Example data for maintenance logs
const maintenanceLogs = [
  {
    id: '1',
    manholeId: 'MH-001',
    userId: 'Tech-001',
    type: 'Inspection',
    description: 'Routine inspection for sewage overflow.',
    status: 'completed',
    scheduledDate: '2025-04-20',
    actualStart: '2025-04-20T10:00:00',
    actualEnd: '2025-04-20T12:00:00',
    partsReplaced: [{ name: 'Seals', quantity: 2 }],
    notes: 'Everything seems to be in order.',
    createdAt: '2025-04-20T09:00:00',
    updatedAt: '2025-04-20T12:30:00',
  },
  {
    id: '2',
    manholeId: 'MH-002',
    userId: 'Tech-002',
    type: 'Repair',
    description: 'Gas leak repair due to pipe corrosion.',
    status: 'in_progress',
    scheduledDate: '2025-04-21',
    actualStart: '2025-04-21T08:00:00',
    actualEnd: null,
    partsReplaced: [{ name: 'Pipe', quantity: 1 }],
    notes: 'Repair work is underway.',
    createdAt: '2025-04-21T07:00:00',
    updatedAt: '2025-04-21T08:30:00',
  },
  {
    id: '3',
    manholeId: 'MH-003',
    userId: 'Tech-003',
    type: 'Inspection',
    description: 'Inspection for possible blockage.',
    status: 'scheduled',
    scheduledDate: '2025-04-22',
    actualStart: null,
    actualEnd: null,
    partsReplaced: [],
    notes: 'Scheduled for tomorrow.',
    createdAt: '2025-04-21T15:00:00',
    updatedAt: '2025-04-21T15:30:00',
  },
];

const MaintenanceLogs = () => {
  const [logs, setLogs] = useState(maintenanceLogs);
  const [filteredLogs, setFilteredLogs] = useState(maintenanceLogs);
  const [filter, setFilter] = useState('all'); // Filter options: all, inspection, repair, etc.

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter((log) => log.status === status));
    }
  };

  useEffect(() => {
    // Fetch data and set logs if needed (can also use this to fetch from a database)
    setLogs(maintenanceLogs);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Filter Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Maintenance Logs</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Filter by Status</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 bg-white p-2 shadow-lg rounded-lg">
            <DropdownMenuLabel>Choose Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('scheduled')}>Scheduled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('in_progress')}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('completed')}>Completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Maintenance Logs Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Manhole ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Actual Start</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.manholeId}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        log.status === 'completed'
                          ? 'text-green-500'
                          : log.status === 'in_progress'
                          ? 'text-yellow-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell>{log.scheduledDate}</TableCell>
                  <TableCell>{log.actualStart ? new Date(log.actualStart).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceLogs;
