import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  HardHat,
  MapPin,
  Filter,
  Search,
  User,
  Clock,
  ChevronRight,
  ChevronDown,
  Settings,
  Route,
} from "lucide-react";

const SewageSystemMap = () => {
  const style = import.meta.env.VITE_MAP_STYLE;
  // Refs
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  // State
  const [manholes, setManholes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedManhole, setSelectedManhole] = useState(null);
  const [readings, setReadings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    alertLevel: "all",
    zone: "all",
  });
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [route, setRoute] = useState(null);

  // Load initial data
  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockManholes = [
      {
        id: "1",
        code: "MH-001",
        location: [38.7636, 9.0054],
        status: "functional",
        zone: "A",
        lastInspection: "2023-05-15",
      },
      {
        id: "2",
        code: "MH-002",
        location: [38.7645, 9.0062],
        status: "damaged",
        zone: "A",
        lastInspection: "2023-04-20",
      },
      {
        id: "3",
        code: "MH-003",
        location: [38.7653, 9.0048],
        status: "overflowing",
        zone: "B",
        lastInspection: "2023-06-01",
      },
    ];

    const mockAlerts = [
      {
        id: "A1",
        manholeId: "2",
        alertType: "structural_damage",
        alertLevel: "critical",
        timestamp: "2023-06-10T08:30:00",
      },
      {
        id: "A2",
        manholeId: "3",
        alertType: "overflow",
        alertLevel: "warning",
        timestamp: "2023-06-11T14:15:00",
      },
    ];

    const mockWorkers = [
      {
        id: "W1",
        name: "John Doe",
        status: "available",
        location: [38.764, 9.007],
      },
      {
        id: "W2",
        name: "Jane Smith",
        status: "available",
        location: [38.763, 9.003],
      },
    ];

    setManholes(mockManholes);
    setAlerts(mockAlerts);
    setWorkers(mockWorkers);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style, // Replace with your style
      center: [38.7636, 9.0054], // Initial center
      zoom: 15,
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl());

    return () => map.remove();
  }, []);

  // Add manholes and alerts to map
  useEffect(() => {
    if (!mapRef.current || manholes.length === 0) return;

    const map = mapRef.current;

    // Add manhole markers
    manholes.forEach((manhole) => {
      const color = {
        functional: "#4ade80",
        damaged: "#f87171",
        overflowing: "#60a5fa",
      }[manhole.status];

      const el = document.createElement("div");
      el.className = "manhole-marker";
      el.style.backgroundColor = color;
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";

      // Add click handler
      el.addEventListener("click", () => handleManholeClick(manhole));

      new maplibregl.Marker(el).setLngLat(manhole.location).addTo(map);
    });

    // Add alert markers
    alerts.forEach((alert) => {
      if (alert.resolved) return;

      const manhole = manholes.find((m) => m.id === alert.manholeId);
      if (!manhole) return;

      const el = document.createElement("div");
      el.className = "alert-marker";
      el.innerHTML = alert.alertLevel === "critical" ? "⚠️" : "🔔";
      el.style.fontSize = "24px";
      el.style.cursor = "pointer";

      // Add pulsing animation for critical alerts
      if (alert.alertLevel === "critical") {
        el.style.animation = "pulse 1.5s infinite";
      }

      el.addEventListener("click", () => handleAlertClick(alert));

      new maplibregl.Marker(el).setLngLat(manhole.location).addTo(map);
    });
  }, [manholes, alerts]);

  // Handle manhole click
  const handleManholeClick = (manhole) => {
    setSelectedManhole(manhole);
    // Fetch readings and logs for this manhole
    const mockReadings = [
      {
        timestamp: "2023-06-01T10:00",
        waterLevel: 30,
        methaneLevel: 5,
        temperature: 25,
      },
      {
        timestamp: "2023-06-01T12:00",
        waterLevel: 45,
        methaneLevel: 7,
        temperature: 26,
      },
      {
        timestamp: "2023-06-01T14:00",
        waterLevel: 60,
        methaneLevel: 8,
        temperature: 27,
      },
    ];
    setReadings(mockReadings);

    const mockLogs = [
      {
        timestamp: "2023-05-15T09:30",
        workerId: "W1",
        action: "routine_inspection",
        notes: "No issues found",
      },
      {
        timestamp: "2023-04-20T11:15",
        workerId: "W2",
        action: "repair",
        notes: "Replaced damaged cover",
      },
    ];
    setLogs(mockLogs);
  };

  // Handle alert click
  const handleAlertClick = (alert) => {
    const manhole = manholes.find((m) => m.id === alert.manholeId);
    if (manhole) {
      handleManholeClick(manhole);
    }
  };

  // Assign worker to alert
  const assignWorker = (alertId, workerId) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, assignedWorker: workerId } : alert
      )
    );
    setWorkers(
      workers.map((worker) =>
        worker.id === workerId ? { ...worker, status: "assigned" } : worker
      )
    );
  };

  // Generate optimal route
  const generateRoute = () => {
    // In a real app, use a routing API
    const mockRoute = {
      coordinates: [
        [38.7636, 9.0054],
        [38.7645, 9.0062],
        [38.7653, 9.0048],
      ],
      distance: "2.5 km",
      duration: "15 min",
    };
    setRoute(mockRoute);

    // Draw route on map
    if (mapRef.current) {
      const map = mapRef.current;
      if (map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: mockRoute.coordinates,
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });
    }
  };

  // Filter manholes
  const filteredManholes = manholes.filter((manhole) => {
    if (filters.status !== "all" && manhole.status !== filters.status)
      return false;
    if (filters.zone !== "all" && manhole.zone !== filters.zone) return false;
    return true;
  });

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (showCriticalOnly && alert.alertLevel !== "critical") return false;
    if (filters.alertLevel !== "all" && alert.alertLevel !== filters.alertLevel)
      return false;
    return !alert.resolved;
  });

  return (
    <div className="flex h-screen">
      {/* Map container */}
      <div ref={mapContainer} className="flex-1" />

      {/* Side panel */}
      <div className="w-96 bg-white border-l overflow-y-auto">
        <Tabs defaultValue="manholes">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="manholes">
              <MapPin className="w-4 h-4 mr-2" /> Manholes
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertCircle className="w-4 h-4 mr-2" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="workers">
              <HardHat className="w-4 h-4 mr-2" /> Workers
            </TabsTrigger>
          </TabsList>

          {/* Manholes tab */}
          <TabsContent value="manholes" className="p-4">
            <div className="flex items-center mb-4">
              <Input placeholder="Search manholes..." className="flex-1" />
              <Button variant="outline" className="ml-2">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              <Label>Filters</Label>
              <div className="flex gap-2">
                <Select
                  value={filters.status}
                  onValueChange={(val) =>
                    setFilters({ ...filters, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="overflowing">Overflowing</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.zone}
                  onValueChange={(val) => setFilters({ ...filters, zone: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="A">Zone A</SelectItem>
                    <SelectItem value="B">Zone B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredManholes.map((manhole) => (
                <Card
                  key={manhole.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleManholeClick(manhole)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {manhole.code}
                      </CardTitle>
                      <Badge
                        variant={
                          manhole.status === "functional"
                            ? "success"
                            : manhole.status === "damaged"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {manhole.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts tab */}
          <TabsContent value="alerts" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Switch
                  id="critical-only"
                  checked={showCriticalOnly}
                  onCheckedChange={setShowCriticalOnly}
                />
                <Label htmlFor="critical-only" className="ml-2">
                  Critical Only
                </Label>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>

            <div className="space-y-2">
              {filteredAlerts.map((alert) => {
                const manhole = manholes.find((m) => m.id === alert.manholeId);
                return (
                  <Card
                    key={alert.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {manhole?.code || "Unknown"} - {alert.alertType}
                        </CardTitle>
                        <Badge
                          variant={
                            alert.alertLevel === "critical"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {alert.alertLevel}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      {alert.assignedWorker && (
                        <div className="text-xs mt-1 flex items-center">
                          <User className="w-3 h-3 mr-1" /> Assigned
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Workers tab */}
          <TabsContent value="workers" className="p-4">
            <div className="space-y-2">
              {workers.map((worker) => (
                <Card key={worker.id}>
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {worker.name}
                      </CardTitle>
                      <Badge
                        variant={
                          worker.status === "available"
                            ? "success"
                            : worker.status === "assigned"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {worker.status}
                      </Badge>
                    </div>
                    {worker.currentAssignment && (
                      <div className="text-xs mt-1">
                        Assigned to: {worker.currentAssignment}
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected manhole details */}
        {selectedManhole && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{selectedManhole.code}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedManhole(null)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Status</Label>
                  <div>{selectedManhole.status}</div>
                </div>
                <div>
                  <Label>Last Inspection</Label>
                  <div>{selectedManhole.lastInspection}</div>
                </div>
                <div>
                  <Label>Zone</Label>
                  <div>{selectedManhole.zone}</div>
                </div>
              </div>

              <div>
                <Label>Sensor Readings</Label>
                <div className="h-40 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={readings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="waterLevel"
                        stroke="#3b82f6"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <Label>Maintenance History</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button className="w-full" onClick={generateRoute}>
                <Route className="w-4 h-4 mr-2" /> Generate Optimal Route
              </Button>
            </div>
          </div>
        )}

        {/* Route details */}
        {route && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Optimal Route</h3>
              <Button variant="ghost" size="sm" onClick={() => setRoute(null)}>
                Close
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span>{route.distance}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{route.duration}</span>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Stops:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  {route.coordinates.map((coord, i) => (
                    <li key={i}>Manhole {i + 1}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SewageSystemMap;
