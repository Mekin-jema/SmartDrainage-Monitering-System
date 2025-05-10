import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Gauge,
  Droplets,
  Thermometer,
  Waves,
  HardHat,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SewageSystemMap from "./map";

const Dashboard = () => {
  // Sample data - replace with API calls in a real implementation
  const [dashboardData, setDashboardData] = useState({
    systemStatus: {
      totalManholes: 42,
      monitoredManholes: 38,
      criticalIssues: 7,
      maintenanceOngoing: 3,
      systemHealth: 82, // percentage
    },
    sensorStatistics: {
      waterLevel: {
        normal: 28,
        warning: 8,
        critical: 6,
      },
      gasLevel: {
        normal: 35,
        warning: 5,
        critical: 2,
      },
      flowRate: {
        normal: 30,
        warning: 9,
        critical: 3,
      },
    },
    recentAlerts: [
      {
        id: 1,
        type: "High Water Level",
        location: "Manhole #12",
        timestamp: "2025-04-30T08:15:00",
        status: "pending",
      },
      {
        id: 2,
        type: "Gas Leak Detected",
        location: "Manhole #07",
        timestamp: "2025-04-30T07:30:00",
        status: "assigned",
      },
      {
        id: 3,
        type: "Blockage Detected",
        location: "Manhole #23",
        timestamp: "2025-04-29T16:45:00",
        status: "resolved",
      },
      {
        id: 4,
        type: "Sensor Failure",
        location: "Manhole #18",
        timestamp: "2025-04-29T14:20:00",
        status: "pending",
      },
    ],
    maintenanceLogs: [
      {
        id: 1,
        manhole: "#05",
        type: "Routine Check",
        technician: "Abebe K.",
        status: "completed",
        date: "2025-04-28",
      },
      {
        id: 2,
        manhole: "#12",
        type: "Emergency Repair",
        technician: "Mekdes T.",
        status: "in-progress",
        date: "2025-04-29",
      },
      {
        id: 3,
        manhole: "#22",
        type: "Sensor Replacement",
        technician: "Yohannes A.",
        status: "scheduled",
        date: "2025-05-02",
      },
    ],
    sensorTrends: [
      { hour: "00:00", waterLevel: 2.1, gasLevel: 12, flowRate: 1.2 },
      { hour: "04:00", waterLevel: 2.3, gasLevel: 15, flowRate: 1.1 },
      { hour: "08:00", waterLevel: 2.8, gasLevel: 18, flowRate: 1.4 },
      { hour: "12:00", waterLevel: 3.2, gasLevel: 22, flowRate: 1.6 },
      { hour: "16:00", waterLevel: 3.5, gasLevel: 25, flowRate: 1.8 },
      { hour: "20:00", waterLevel: 3.1, gasLevel: 20, flowRate: 1.5 },
    ],
  });

  // Updated color palette
  const COLORS = {
    primary: "#2563eb", // Vibrant blue
    secondary: "#ea580c", // Orange
    success: "#16a34a", // Green
    warning: "#d97706", // Amber
    danger: "#dc2626", // Red
    info: "#0284c7", // Sky blue

    // Status colors
    normal: "#16a34a",
    warning: "#d97706",
    critical: "#dc2626",
    pending: "#d97706",
    assigned: "#2563eb",
    resolved: "#16a34a",
    completed: "#16a34a",
    inProgress: "#2563eb",
    scheduled: "#4b5563",
  };

  // Data for water level pie chart
  const waterLevelData = [
    {
      name: "Normal",
      value: dashboardData.sensorStatistics.waterLevel.normal,
      color: COLORS.normal,
    },
    {
      name: "Warning",
      value: dashboardData.sensorStatistics.waterLevel.warning,
      color: COLORS.warning,
    },
    {
      name: "Critical",
      value: dashboardData.sensorStatistics.waterLevel.critical,
      color: COLORS.critical,
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`tooltip-${index}`}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Smart Sewage System Dashboard
      </h1>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Manholes
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardData.systemStatus.totalManholes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dashboardData.systemStatus.monitoredManholes} monitored
              </p>
            </div>
            <MapPin className="w-10 h-10" style={{ color: COLORS.primary }} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Critical Issues
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: COLORS.danger }}
              >
                {dashboardData.systemStatus.criticalIssues}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                needing attention
              </p>
            </div>
            <AlertCircle
              className="w-10 h-10"
              style={{ color: COLORS.danger }}
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                System Health
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  color:
                    dashboardData.systemStatus.systemHealth > 80
                      ? COLORS.success
                      : dashboardData.systemStatus.systemHealth > 60
                      ? COLORS.warning
                      : COLORS.danger,
                }}
              >
                {dashboardData.systemStatus.systemHealth}%
              </p>
            </div>
            <Gauge
              className="w-10 h-10"
              style={{
                color:
                  dashboardData.systemStatus.systemHealth > 80
                    ? COLORS.success
                    : dashboardData.systemStatus.systemHealth > 60
                    ? COLORS.warning
                    : COLORS.danger,
              }}
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Maintenance
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardData.systemStatus.maintenanceOngoing}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ongoing jobs
              </p>
            </div>
            <HardHat
              className="w-10 h-10"
              style={{ color: COLORS.secondary }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Level Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Water Level Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={waterLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {waterLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Trends */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Sensor Trends (Last 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.sensorTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeOpacity={0.3}
                  />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="waterLevel"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    name="Water Level (m)"
                    dot={{ r: 4, fill: COLORS.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gasLevel"
                    stroke={COLORS.danger}
                    strokeWidth={2}
                    name="Gas Level (ppm)"
                    dot={{ r: 4, fill: COLORS.danger }}
                  />
                  <Line
                    type="monotone"
                    dataKey="flowRate"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    name="Flow Rate (m/s)"
                    dot={{ r: 4, fill: COLORS.success }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gas Level Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Gas Level Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Normal",
                      value: dashboardData.sensorStatistics.gasLevel.normal,
                    },
                    {
                      name: "Warning",
                      value: dashboardData.sensorStatistics.gasLevel.warning,
                    },
                    {
                      name: "Critical",
                      value: dashboardData.sensorStatistics.gasLevel.critical,
                    },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeOpacity={0.3}
                  />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Manholes">
                    <Cell fill={COLORS.normal} />
                    <Cell fill={COLORS.warning} />
                    <Cell fill={COLORS.critical} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full ${
                      alert.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : alert.status === "assigned"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    {alert.status === "pending" ? (
                      <AlertCircle className="text-amber-600 dark:text-amber-400" />
                    ) : alert.status === "assigned" ? (
                      <XCircle className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <CheckCircle className="text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {alert.type}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          alert.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : alert.status === "assigned"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alert.location}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Logs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Maintenance Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.maintenanceLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full ${
                      log.status === "completed"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : log.status === "in-progress"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {log.status === "completed" ? (
                      <CheckCircle className="text-green-600 dark:text-green-400" />
                    ) : log.status === "in-progress" ? (
                      <Activity className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <HardHat className="text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {log.type}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          log.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : log.status === "in-progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manhole {log.manhole} • {log.technician}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Scheduled: {log.date}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                View Maintenance Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Visualization Placeholder */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Manhole Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SewageSystemMap />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
