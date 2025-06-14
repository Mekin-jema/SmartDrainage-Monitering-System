import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, CheckCircle, Activity, Gauge, Droplets, Thermometer, Waves, HardHat, Battery, Fuel, WavesIcon, Info } from "lucide-react"; import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SewageSystemMap from "./map";
import { useManholeStore } from "@/store/useManholeStore";
import useSensorsStore from "@/store/useSensorsStore";
import useAlertStore from "@/store/useAlertStore";
import useMaintenanceStore from "@/store/usemantenanceStore";


const Dashboard = () => {
  // Initialize with default values to prevent undefined errors
  const [dashboardData, setDashboardData] = useState({
    systemStatus: {
      totalManholes: 0,
      monitoredManholes: 0,
      criticalIssues: 0,
      maintenanceOngoing: 0,
      systemHealth: 0,
    },
    manholes: [],
    recentAlerts: [],
    maintenanceLogs: [],
    sensorTrends: []
  });

  const { status, fetchSystemStatus } = useManholeStore();
  const { manholes, fetchManholes, sensorTrends, fetchSensorTrends } = useSensorsStore();
  const { maintenanceLogs, fetchMaintenanceLogs } = useMaintenanceStore();
  const { recentAlerts, fetchRecentAlerts } = useAlertStore();
  const [showCriticalManholes, setShowCriticalManholes] = useState(false);



  useEffect(() => {
    // Fetch initial data
    fetchSystemStatus();
    fetchManholes();
    fetchSensorTrends();
    fetchRecentAlerts();
    fetchMaintenanceLogs();




  }, []);

  useEffect(() => {
    // Update dashboard data when any of the dependent data changes
    setDashboardData(prev => ({
      ...prev,
      systemStatus: {
        totalManholes: status?.totalManholes || 0,
        monitoredManholes: status?.monitoredManholes || 0,
        criticalIssues: status?.criticalIssues || 0,
        maintenanceOngoing: status?.maintenanceOngoing || 0,
        systemHealth: status?.systemHealth || 0,
      },
      manholes: manholes || [],
      recentAlerts: recentAlerts || [],
      maintenanceLogs: maintenanceLogs || [],
      sensorTrends: sensorTrends || []
    }));
  }, [manholes]);

  // Rest of your component code remains the same...
  // (All your helper functions, COLORS object, component rendering, etc.)


  // Updated color palette
  const COLORS = {
    primary: "#2563eb", // Vibrant blue
    secondary: "#ea580c", // Orange
    success: "#16a34a", // Green
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



  // Calculate sensor statistics based on actual manhole data
  const calculateSensorStats = () => {
    const stats = {
      waterLevel: { normal: 0, warning: 0, critical: 0 },
      gasLevel: { normal: 0, warning: 0, critical: 0 },
      flowRate: { normal: 0, warning: 0, critical: 0 },
      temperature: { normal: 0, warning: 0, critical: 0 } // Added temperature stats
    };

    dashboardData.manholes.forEach(manhole => {
      // Water level analysis
      if (!manhole.sensors.sewageLevel) {
        // Sensor missing or not reporting
        console.log(`Sensor data missing for manhole ${manhole.manholeId}`);
      } else {
        const percentage = (manhole.sensors.sewageLevel / manhole.thresholds.maxDistance) * 100;
        if (percentage > 90) {
          stats.waterLevel.critical++;
        } else if (percentage > 75) {
          stats.waterLevel.warning++;
        } else {
          stats.waterLevel.normal++;
        }
      }

      // Gas level analysis
      if (!manhole.sensors.methaneLevel) {
        // Sensor missing or not reporting
      } else {
        if (manhole.sensors.methaneLevel > manhole.thresholds.maxGas) {
          stats.gasLevel.critical++;
        } else if (manhole.sensors.methaneLevel > manhole.thresholds.maxGas * 0.7) {
          stats.gasLevel.warning++;
        } else {
          stats.gasLevel.normal++;
        }
      }

      // Flow rate analysis
      if (!manhole.sensors.flowRate) {
        // Sensor missing or not reporting
      } else {
        if (manhole.sensors.flowRate < manhole.thresholds.minFlow) {
          stats.flowRate.critical++;
        } else if (manhole.sensors.flowRate < manhole.thresholds.minFlow * 1.3) {
          stats.flowRate.warning++;
        } else {
          stats.flowRate.normal++;
        }
      }

      // // Battery level analysis
      // if (manhole.sensors.batteryLevel !== undefined) {
      //   if (manhole.sensors.batteryLevel < 20) {
      //     stats.batteryLevel.critical++;
      //   } else if (manhole.sensors.batteryLevel < 40) {
      //     stats.batteryLevel.warning++;
      //   } else {
      //     stats.batteryLevel.normal++;
      //   }
      // }

      // Temperature analysis (assuming thresholds: critical > 40°C or < 0°C, warning > 35°C or < 5°C)
      if (manhole.sensors.temperature !== undefined) {
        if (manhole.sensors.temperature > 40 || manhole.sensors.temperature < 0) {
          stats.temperature.critical++;
        } else if (manhole.sensors.temperature > 35 || manhole.sensors.temperature < 5) {
          stats.temperature.warning++;
        } else {
          stats.temperature.normal++;
        }
      }
    });

    return stats;
  };
  const sensorStatistics = calculateSensorStats();
  // Data for charts
  const waterLevelData = [
    { name: "Normal", value: sensorStatistics.waterLevel.normal, color: COLORS.normal },
    { name: "Warning", value: sensorStatistics.waterLevel.warning, color: COLORS.warning },
    { name: "Critical", value: sensorStatistics.waterLevel.critical, color: COLORS.critical },
  ];

  const gasLevelData = [
    { name: "Normal", value: sensorStatistics.gasLevel.normal, color: COLORS.normal },
    { name: "Warning", value: sensorStatistics.gasLevel.warning, color: COLORS.warning },
    { name: "Critical", value: sensorStatistics.gasLevel.critical, color: COLORS.critical },
  ];
  const temperatureData = [
    { name: "Normal", value: sensorStatistics.temperature.normal, color: COLORS.normal },
    { name: "Warning", value: sensorStatistics.temperature.warning, color: COLORS.warning },
    { name: "Critical", value: sensorStatistics.temperature.critical, color: COLORS.critical },
  ];


  // Manhole status card component
  const ManholeStatusCard = ({ manhole }) => {
    const getStatusColor = () => {
      switch (manhole.status) {
        case "critical": return COLORS.danger;
        case "warning": return COLORS.warning;
        default: return COLORS.success;
      }
    };

    return (
      <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-gray-900 dark:text-white">
              {`MH-${manhole.manholeId}`}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${manhole.status === "critical"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : manhole.status === "warning"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}
              >
                {manhole.status}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(manhole.timestamp).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Sewage Level */}
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5" style={{ color: COLORS.primary }} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sewage Level</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {manhole.sensors.sewageLevel} cm
                  </p>
                  <span className="text-xs text-gray-500">
                    (max: {manhole.thresholds.maxDistance}cm)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${(manhole.sensors.sewageLevel / manhole.thresholds.maxDistance) > 0.9
                      ? "bg-red-600"
                      : (manhole.sensors.sewageLevel / manhole.thresholds.maxDistance) > 0.75
                        ? "bg-amber-500"
                        : "bg-green-600"
                      }`}
                    style={{
                      width: `${Math.min(100, (manhole.sensors.sewageLevel / manhole.thresholds.maxDistance) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Methane Level */}
            <div className="flex items-center gap-3">
              <Fuel className="w-5 h-5" style={{ color: COLORS.danger }} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Methane</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {manhole.sensors.methaneLevel} ppm
                  </p>
                  <span className="text-xs text-gray-500">
                    (max: {manhole.thresholds.maxGas}ppm)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${manhole.sensors.methaneLevel > manhole.thresholds.maxGas
                      ? "bg-red-600"
                      : manhole.sensors.methaneLevel > manhole.thresholds.maxGas * 0.7
                        ? "bg-amber-500"
                        : "bg-green-600"
                      }`}
                    style={{
                      width: `${Math.min(100, (manhole.sensors.methaneLevel / manhole.thresholds.maxGas) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Flow Rate */}
            <div className="flex items-center gap-3">
              <WavesIcon className="w-5 h-5" style={{ color: COLORS.info }} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Flow Rate</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {manhole.sensors.flowRate} L/s
                  </p>
                  <span className="text-xs text-gray-500">
                    (min: {manhole.thresholds.minFlow}L/s)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${manhole.sensors.flowRate < manhole.thresholds.minFlow
                      ? "bg-red-600"
                      : manhole.sensors.flowRate < manhole.thresholds.minFlow * 1.3
                        ? "bg-amber-500"
                        : "bg-green-600"
                      }`}
                    style={{
                      width: `${Math.min(100, (manhole.sensors.flowRate / (manhole.thresholds.minFlow * 3)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Battery Level
            <div className="flex items-center gap-3">
              <Battery className="w-5 h-5" style={{ 
                color: manhole.sensors.batteryLevel < 20 
                  ? COLORS.danger 
                  : manhole.sensors.batteryLevel < 40 
                  ? COLORS.warning 
                  : COLORS.success 
              }} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Battery</p>
                <p className="font-medium">
                  {manhole.sensors.batteryLevel}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${
                      manhole.sensors.batteryLevel < 20 
                        ? "bg-red-600" 
                        : manhole.sensors.batteryLevel < 40 
                        ? "bg-amber-500" 
                        : "bg-green-600"
                    }`} 
                    style={{ width: `${manhole.sensors.batteryLevel}%` }}
                  ></div>
                </div>
              </div>
            </div> */}
            {/* Temperature */}
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5" style={{
                color: manhole.sensors.temperature > 40 || manhole.sensors.temperature < 0
                  ? COLORS.danger
                  : manhole.sensors.temperature > 35 || manhole.sensors.temperature < 5
                    ? COLORS.warning
                    : COLORS.success
              }} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                <p className="font-medium">
                  {manhole.sensors.temperature}°C
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${manhole.sensors.temperature > 40 || manhole.sensors.temperature < 0
                      ? "bg-red-600"
                      : manhole.sensors.temperature > 35 || manhole.sensors.temperature < 5
                        ? "bg-amber-500"
                        : "bg-green-600"
                      }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, (manhole.sensors.temperature / 50) * 100))}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert types */}
          {manhole.alertTypes && manhole.alertTypes.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Active Alerts:
              </p>
              <div className="flex flex-wrap gap-2">
                {manhole.alertTypes.map((alert, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  >
                    {alert.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Enhanced Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label, valueSuffix = '', formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-4 rounded-lg shadow-lg border">
          <p className="font-medium">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center mt-1">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm">
                {formatter
                  ? formatter(entry.value)[0]
                  : entry.value}
                {valueSuffix}
              </p>
              {formatter && (
                <span className="text-muted-foreground text-xs ml-2">
                  {formatter(entry.value)[1]}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Smart Drainage System Dashboard
      </h1>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow  dark:bg-inherit bg-slate-200">
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

        <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit cursor-pointer " onClick={() => setShowCriticalManholes(!showCriticalManholes)}>
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



        <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit">
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

        <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit">
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

      {/* Map Visualization */}
      <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit ">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Manhole Locations
          </CardTitle>
        </CardHeader>

        {/* Critical Manholes */}
        {
          showCriticalManholes && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Critical Manholes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(
                  dashboardData.manholes.reduce((acc, curr) => {
                    const id = curr.manholeId;

                    // Only consider critical status
                    if (curr.status === "critical") {
                      if (!acc[id] || new Date(curr.createdAt) > new Date(acc[id].createdAt)) {
                        acc[id] = curr; // keep the most recent critical
                      }
                    }

                    return acc;
                  }, {})
                ).map(manhole => (
                  <ManholeStatusCard key={manhole._id} manhole={manhole} />
                ))}

              </div>
            </div>
          )
        }


        <CardContent>
          <SewageSystemMap manholes={dashboardData.manholes} />
        </CardContent>
      </Card>





      {/* Sensor Trends */}
      <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit mt-[300px]">
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
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke={COLORS.warning}
                  strokeWidth={2}
                  name="Tempreture (0°C)"
                  dot={{ r: 4, fill: COLORS.success }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit">
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
                    className={`p-2 rounded-full ${alert.severity === "critical"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                      }`}
                  >
                    {alert.severity === "critical" ? (
                      <AlertCircle className="text-red-600 dark:text-red-400" />
                    ) : (
                      <AlertCircle className="text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {alert.type}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${alert.status === "pending"
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
        <Card className="hover:shadow-lg transition-shadow bg-slate-200 dark:bg-inherit">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Maintenance Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.maintenanceLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full ${log.status === "completed"
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
                        className={`text-xs px-2 py-1 rounded-full ${log.status === "completed"
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

    </div>
  );
};

export default Dashboard;