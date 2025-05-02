import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  HardHat
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SewageSystemMap from './mpa';

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
        critical: 6
      },
      gasLevel: {
        normal: 35,
        warning: 5,
        critical: 2
      },
      flowRate: {
        normal: 30,
        warning: 9,
        critical: 3
      }
    },
    recentAlerts: [
      { id: 1, type: 'High Water Level', location: 'Manhole #12', timestamp: '2025-04-30T08:15:00', status: 'pending' },
      { id: 2, type: 'Gas Leak Detected', location: 'Manhole #07', timestamp: '2025-04-30T07:30:00', status: 'assigned' },
      { id: 3, type: 'Blockage Detected', location: 'Manhole #23', timestamp: '2025-04-29T16:45:00', status: 'resolved' },
      { id: 4, type: 'Sensor Failure', location: 'Manhole #18', timestamp: '2025-04-29T14:20:00', status: 'pending' },
    ],
    maintenanceLogs: [
      { id: 1, manhole: '#05', type: 'Routine Check', technician: 'Abebe K.', status: 'completed', date: '2025-04-28' },
      { id: 2, manhole: '#12', type: 'Emergency Repair', technician: 'Mekdes T.', status: 'in-progress', date: '2025-04-29' },
      { id: 3, manhole: '#22', type: 'Sensor Replacement', technician: 'Yohannes A.', status: 'scheduled', date: '2025-05-02' },
    ],
    sensorTrends: [
      { hour: '00:00', waterLevel: 2.1, gasLevel: 12, flowRate: 1.2 },
      { hour: '04:00', waterLevel: 2.3, gasLevel: 15, flowRate: 1.1 },
      { hour: '08:00', waterLevel: 2.8, gasLevel: 18, flowRate: 1.4 },
      { hour: '12:00', waterLevel: 3.2, gasLevel: 22, flowRate: 1.6 },
      { hour: '16:00', waterLevel: 3.5, gasLevel: 25, flowRate: 1.8 },
      { hour: '20:00', waterLevel: 3.1, gasLevel: 20, flowRate: 1.5 },
    ]
  });

  // Colors for charts
  const COLORS = {
    normal: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    pending: '#f59e0b',
    assigned: '#3b82f6',
    resolved: '#10b981'
  };

  // Data for water level pie chart
  const waterLevelData = [
    { name: 'Normal', value: dashboardData.sensorStatistics.waterLevel.normal, color: COLORS.normal },
    { name: 'Warning', value: dashboardData.sensorStatistics.waterLevel.warning, color: COLORS.warning },
    { name: 'Critical', value: dashboardData.sensorStatistics.waterLevel.critical, color: COLORS.critical },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Smart Sewage System Dashboard</h1>
      
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Manholes</p>
              <p className="text-3xl font-bold">{dashboardData.systemStatus.totalManholes}</p>
              <p className="text-sm text-gray-500">{dashboardData.systemStatus.monitoredManholes} monitored</p>
            </div>
            <MapPin className="w-10 h-10 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Issues</p>
              <p className="text-3xl font-bold text-red-600">{dashboardData.systemStatus.criticalIssues}</p>
              <p className="text-sm text-gray-500">needing attention</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <p className="text-3xl font-bold" style={{ 
                color: dashboardData.systemStatus.systemHealth > 80 ? COLORS.normal : 
                      dashboardData.systemStatus.systemHealth > 60 ? COLORS.warning : COLORS.critical 
              }}>
                {dashboardData.systemStatus.systemHealth}%
              </p>
            </div>
            <Gauge className="w-10 h-10" style={{ 
              color: dashboardData.systemStatus.systemHealth > 80 ? COLORS.normal : 
                    dashboardData.systemStatus.systemHealth > 60 ? COLORS.warning : COLORS.critical 
            }} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Maintenance</p>
              <p className="text-3xl font-bold">{dashboardData.systemStatus.maintenanceOngoing}</p>
              <p className="text-sm text-gray-500">ongoing jobs</p>
            </div>
            <HardHat className="w-10 h-10 text-amber-600" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Level Status */}
        <Card>
          <CardHeader>
            <CardTitle>Water Level Status</CardTitle>
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {waterLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Trends (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.sensorTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" name="Water Level (m)" />
                  <Line type="monotone" dataKey="gasLevel" stroke="#ef4444" name="Gas Level (ppm)" />
                  <Line type="monotone" dataKey="flowRate" stroke="#10b981" name="Flow Rate (m/s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gas Level Status */}
        <Card>
          <CardHeader>
            <CardTitle>Gas Level Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Normal', value: dashboardData.sensorStatistics.gasLevel.normal },
                    { name: 'Warning', value: dashboardData.sensorStatistics.gasLevel.warning },
                    { name: 'Critical', value: dashboardData.sensorStatistics.gasLevel.critical },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentAlerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${alert.status === 'pending' ? 'bg-amber-100' : alert.status === 'assigned' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {alert.status === 'pending' ? <AlertCircle className="text-amber-600" /> : 
                     alert.status === 'assigned' ? <XCircle className="text-blue-600" /> : <CheckCircle className="text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{alert.type}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                        alert.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.location}</p>
                    <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.maintenanceLogs.map(log => (
                <div key={log.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    log.status === 'completed' ? 'bg-green-100' : 
                    log.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {log.status === 'completed' ? <CheckCircle className="text-green-600" /> : 
                     log.status === 'in-progress' ? <Activity className="text-blue-600" /> : <HardHat className="text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{log.type}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        log.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Manhole {log.manhole} • {log.technician}</p>
                    <p className="text-xs text-gray-500">Scheduled: {log.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View Maintenance Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Visualization Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Manhole Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <SewageSystemMap/>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;