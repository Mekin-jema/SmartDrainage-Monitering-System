import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  TableCell,
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

  Route,
  Upload,
  XCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// SVG Icons for manholes


const SewageSystemMap = () => {
  const style ="https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0d3e5c9668f242409228bfa012c04031"
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [manholes, setManholes] = useState([]);
  const [pipes, setPipes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedManhole, setSelectedManhole] = useState(null);
  const [selectedPipe, setSelectedPipe] = useState(null);
  const [readings, setReadings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    alertLevel: "all",
    zone: "all",
  });
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [route, setRoute] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [newManholeLocation, setNewManholeLocation] = useState(null);
  const [connectingManhole, setConnectingManhole] = useState(null);

  // Load initial data
  useEffect(() => {
const mockManholes = [
  // Mainline (MH-001 to MH-010)
  { id: "1", code: "MH-001", location: [38.7636, 9.0054], status: "functional", zone: "A", lastInspection: "2023-05-15", cover_status: "closed", overflow_level: "good", connections: ["2"] },
  { id: "2", code: "MH-002", location: [38.7645, 9.0062], status: "damaged", zone: "A", lastInspection: "2023-04-20", cover_status: "open", overflow_level: "risk", connections: ["1", "3"] },
  { id: "3", code: "MH-003", location: [38.7653, 9.0048], status: "overflowing", zone: "B", lastInspection: "2023-06-01", cover_status: "closed", overflow_level: "overflow", connections: ["2", "4"] },
  { id: "4", code: "MH-004", location: [38.7660, 9.0035], status: "functional", zone: "B", lastInspection: "2023-05-25", cover_status: "closed", overflow_level: "good", connections: ["3", "5"] },
  { id: "5", code: "MH-005", location: [38.7672, 9.0021], status: "under_maintenance", zone: "C", lastInspection: "2023-06-05", cover_status: "open", overflow_level: "moderate", connections: ["4", "6"] },
  { id: "6", code: "MH-006", location: [38.7680, 9.0010], status: "functional", zone: "C", lastInspection: "2023-06-07", cover_status: "closed", overflow_level: "good", connections: ["5", "7"] },
  { id: "7", code: "MH-007", location: [38.7685, 9.0002], status: "damaged", zone: "C", lastInspection: "2023-05-10", cover_status: "open", overflow_level: "risk", connections: ["6", "8"] },
  { id: "8", code: "MH-008", location: [38.7693, 8.9990], status: "functional", zone: "D", lastInspection: "2023-06-03", cover_status: "closed", overflow_level: "good", connections: ["7", "9"] },
  { id: "9", code: "MH-009", location: [38.7701, 8.9980], status: "overflowing", zone: "D", lastInspection: "2023-06-01", cover_status: "open", overflow_level: "overflow", connections: ["8", "10"] },
  { id: "10", code: "MH-010",location: [38.7710, 8.9970], status: "functional", zone: "D", lastInspection: "2023-06-08", cover_status: "closed", overflow_level: "good", connections: ["9"] },

  // Branch A
  { id: "11", code: "MH-011", location: [38.7658, 9.0065], status: "functional", zone: "A", lastInspection: "2023-06-10", cover_status: "closed", overflow_level: "good", connections: ["2", "12"] },
  { id: "12", code: "MH-012", location: [38.7665, 9.0075], status: "damaged", zone: "B", lastInspection: "2023-05-15", cover_status: "open", overflow_level: "risk", connections: ["11"] },

  // Branch B
  { id: "13", code: "MH-013", location: [38.7665, 9.0028], status: "under_maintenance", zone: "C", lastInspection: "2023-06-02", cover_status: "open", overflow_level: "moderate", connections: ["4", "14"] },
  { id: "14", code: "MH-014", location: [38.7670, 9.0036], status: "functional", zone: "C", lastInspection: "2023-06-03", cover_status: "closed", overflow_level: "good", connections: ["13"] },

  // Branch C
  { id: "15", code: "MH-015", location: [38.7682, 9.0009], status: "overflowing", zone: "C", lastInspection: "2023-06-06", cover_status: "open", overflow_level: "overflow", connections: ["6"] },
];


const mockPipes = [
  { id: "p1", start: "1", end: "2", blockage: false },
  { id: "p2", start: "2", end: "3", blockage: true },
  { id: "p3", start: "3", end: "4", blockage: false },
  { id: "p4", start: "4", end: "5", blockage: false },
  { id: "p5", start: "5", end: "6", blockage: true },
  { id: "p6", start: "6", end: "7", blockage: false },
  { id: "p7", start: "7", end: "8", blockage: false },
  { id: "p8", start: "8", end: "9", blockage: false },
  { id: "p9", start: "9", end: "10", blockage: false },
  // Branches
  { id: "p10", start: "2", end: "11", blockage: false },
  { id: "p11", start: "11", end: "12", blockage: true },
  { id: "p12", start: "4", end: "13", blockage: false },
  { id: "p13", start: "13", end: "14", blockage: false },
  { id: "p14", start: "6", end: "15", blockage: true },
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
  {
    id: "A3",
    manholeId: "9",
    alertType: "overflow",
    alertLevel: "critical",
    timestamp: "2023-06-12T11:00:00",
  },
  {
    id: "A4",
    manholeId: "5",
    alertType: "cover_open",
    alertLevel: "warning",
    timestamp: "2023-06-09T09:45:00",
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
    setPipes(mockPipes);
    setAlerts(mockAlerts);
    setWorkers(mockWorkers);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: [38.7636, 9.0054],
      zoom: 15,
    });

    map.addControl(new maplibregl.NavigationControl(),"top-left");
    map.addControl(new maplibregl.FullscreenControl(), "top-left");
    mapRef.current = map;

    // Handle map clicks for drawing mode
    map.on("click", (e) => {
      if (drawingMode) {
        if (!newManholeLocation) {
          setNewManholeLocation(e.lngLat);
        } else if (!connectingManhole) {
          // Select first manhole to connect
          const clickedManhole = findManholeAtPoint(e.point);
          if (clickedManhole) {
            setConnectingManhole(clickedManhole.id);
          }
        } else {
          // Select second manhole to complete connection
          const clickedManhole = findManholeAtPoint(e.point);
          if (clickedManhole && clickedManhole.id !== connectingManhole) {
            // Add new pipe
            const newPipe = {
              id: `p${pipes.length + 1}`,
              start: connectingManhole,
              end: clickedManhole.id,
              blockage: false,
            };
            setPipes([...pipes, newPipe]);
            
            // Update manhole connections
            setManholes(manholes.map(m => {
              if (m.id === connectingManhole && !m.connections.includes(clickedManhole.id)) {
                return {...m, connections: [...m.connections, clickedManhole.id]};
              }
              if (m.id === clickedManhole.id && !m.connections.includes(connectingManhole)) {
                return {...m, connections: [...m.connections, connectingManhole]};
              }
              return m;
            }));
            
            setConnectingManhole(null);
          }
        }
      }
    });

    return () => map.remove();
  }, [drawingMode, newManholeLocation, connectingManhole]);

  // Find manhole at map point
  const findManholeAtPoint = (point) => {
    if (!mapRef.current) return null;
    
    const features = mapRef.current.queryRenderedFeatures(point, {
      layers: ['manholes-layer']
    });
    
    if (features.length > 0) {
      return manholes.find(m => m.id === features[0].properties.id);
    }
    return null;
  };


  const updateLayers = (map) => {
  // Remove existing layers and sources if they exist
  // Remove existing layers and sources if they exist
    if (map.getLayer('manholes-layer')) map.removeLayer('manholes-layer');
    if (map.getLayer('pipes-layer')) map.removeLayer('pipes-layer');
    if (map.getSource('manholes')) map.removeSource('manholes');
    if (map.getSource('pipes')) map.removeSource('pipes');

    // Add pipes as lines
    const pipeFeatures = pipes.map(pipe => {
      const startManhole = manholes.find(m => m.id === pipe.start);
      const endManhole = manholes.find(m => m.id === pipe.end);
      
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [startManhole.location, endManhole.location]
        },
        properties: {
          id: pipe.id,
          blockage: pipe.blockage,
          start: pipe.start,
          end: pipe.end
        }
      };
    });

    map.addSource('pipes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: pipeFeatures
      }
    });

    map.addLayer({
      id: 'pipes-layer',
      type: 'line',
      source: 'pipes',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'blockage'], true],
          '#ef4444',
          '#10b981'
        ],
        'line-width': 3
      }
    });

    // Add manholes as circle markers
    const manholeFeatures = manholes.map(manhole => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: manhole.location
      },
      properties: {
        id: manhole.id,
        code: manhole.code,
        cover_status: manhole.cover_status,
        overflow_level: manhole.overflow_level,
        status: manhole.status
      }
    }));

    map.addSource('manholes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: manholeFeatures
      }
    });

    map.addLayer({
      id: 'manholes-layer',
      type: 'circle',
      source: 'manholes',
      paint: {
        'circle-radius': 12,
        'circle-color': [
          'case',
          ['==', ['get', 'overflow_level'], 'overflow'], '#ef4444',
          ['==', ['get', 'overflow_level'], 'risk'], '#f59e0b',
          '#10b981'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add symbol layer for cover status
    map.addLayer({
      id: 'manholes-symbol',
      type: 'symbol',
      source: 'manholes',
      layout: {
        'text-field': [
          'case',
          ['==', ['get', 'cover_status'], 'open'], '✕',
          '✓'
        ],
        'text-size': 12,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold']
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    // Click handlers
    map.on('click', 'manholes-layer', (e) => {
      const manhole = manholes.find(m => m.id === e.features[0].properties.id);
      if (manhole) handleManholeClick(manhole);
    });

    map.on('click', 'pipes-layer', (e) => {
      const pipe = pipes.find(p => p.id === e.features[0].properties.id);
      if (pipe) {
        setSelectedPipe(pipe);
        setSelectedManhole(null);
      }
    });

  //   // Hover effects
    map.on('mouseenter', 'manholes-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'manholes-layer', () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'pipes-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'pipes-layer', () => {
      map.getCanvas().style.cursor = '';
    });
  // ... rest of your code for map.addSource, map.addLayer, etc.
};

  // Update map when data changes
  useEffect(() => {
    if (!mapRef.current || manholes.length === 0 || pipes.length === 0) return;

    const map = mapRef.current;
      if (!map.isStyleLoaded()) {
    map.once('load', () => {
      updateLayers(map);
    });
  } else {
    updateLayers(map);
  }
   
  }, [manholes, pipes]);

  // Handle manhole click
  const handleManholeClick = (manhole) => {
    setSelectedManhole(manhole);
    setSelectedPipe(null);
    
    // Fetch readings and logs for this manhole
    const mockReadings = [
      { timestamp: "2023-06-01T10:00", waterLevel: 30, methaneLevel: 5, temperature: 25 },
      { timestamp: "2023-06-01T12:00", waterLevel: 45, methaneLevel: 7, temperature: 26 },
      { timestamp: "2023-06-01T14:00", waterLevel: 60, methaneLevel: 8, temperature: 27 },
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

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.type === "FeatureCollection") {
          // Process GeoJSON
          const newManholes = [];
          const newPipes = [];
          
          data.features.forEach(feature => {
            if (feature.geometry.type === "Point") {
              newManholes.push({
                id: feature.properties.id || `mh-${newManholes.length + 1}`,
                code: feature.properties.code || `MH-${newManholes.length + 1}`,
                location: feature.geometry.coordinates,
                status: feature.properties.status || "functional",
                zone: feature.properties.zone || "A",
                lastInspection: feature.properties.lastInspection || new Date().toISOString().split('T')[0],
                cover_status: feature.properties.cover_status || "closed",
                overflow_level: feature.properties.overflow_level || "good",
                connections: feature.properties.connections || []
              });
            } else if (feature.geometry.type === "LineString") {
              newPipes.push({
                id: feature.properties.id || `p-${newPipes.length + 1}`,
                start: feature.properties.start,
                end: feature.properties.end,
                blockage: feature.properties.blockage || false
              });
            }
          });
          
          setManholes(newManholes);
          setPipes(newPipes);
        }
      } catch (error) {
        console.error("Error parsing GeoJSON:", error);
      }
    };
    reader.readAsText(file);
  };

  // Generate optimal route
  const generateRoute = () => {
    // Simple implementation - in a real app you'd use a proper routing algorithm
    const routeCoordinates = manholes.map(m => m.location);
    
    const mockRoute = {
      coordinates: routeCoordinates,
      distance: `${(manholes.length * 0.2).toFixed(1)} km`,
      duration: `${manholes.length * 5} min`,
    };
    
    setRoute(mockRoute);

    // Draw route on map
    if (mapRef.current) {
      const map = mapRef.current;
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: mockRoute.coordinates,
          },
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-dasharray': [2, 2],
        },
      });
    }
  };

  // Filter manholes
  const filteredManholes = manholes.filter((manhole) => {
    if (filters.status !== "all" && manhole.status !== filters.status) return false;
    if (filters.zone !== "all" && manhole.zone !== filters.zone) return false;
    return true;
  });

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (showCriticalOnly && alert.alertLevel !== "critical") return false;
    if (filters.alertLevel !== "all" && alert.alertLevel !== filters.alertLevel) return false;
    return !alert.resolved;
  });

  // Add new manhole
  const addNewManhole = () => {
    if (!newManholeLocation) return;
    
    const newManhole = {
      id: `${manholes.length + 1}`,
      code: `MH-${manholes.length + 1}`,
      location: [newManholeLocation.lng, newManholeLocation.lat],
      status: "functional",
      zone: "A",
      lastInspection: new Date().toISOString().split('T')[0],
      cover_status: "closed",
      overflow_level: "good",
      connections: []
    };
    
    setManholes([...manholes, newManhole]);
    setNewManholeLocation(null);
  };

  // Cancel drawing mode
  const cancelDrawing = () => {
    setDrawingMode(false);
    setNewManholeLocation(null);
    setConnectingManhole(null);
  };

  return (
  <div className="flex h-screen">
  {/* Map container */}
  <div ref={mapContainer} className="flex-1 relative">
    {/* Drawing mode controls */}
    {drawingMode && (
      <div className="absolute top-4 left-4 bg-background p-4 rounded-md shadow-md z-10 border">
        <h3 className="font-bold mb-2">Drawing Mode</h3>
        {!newManholeLocation ? (
          <p>Click on the map to place a new manhole</p>
        ) : !connectingManhole ? (
          <div>
            <p>Click on an existing manhole to connect</p>
            <Button onClick={addNewManhole} className="mt-2">
              Add Manhole Without Connections
            </Button>
          </div>
        ) : (
          <p>Click on another manhole to create a connection</p>
        )}
        <Button variant="destructive" onClick={cancelDrawing} className="mt-2">
          Cancel
        </Button>
      </div>
    )}
  </div>

  {/* Side panel */}
  <div className="w-96 bg-background border-l overflow-y-auto">
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

        <div className="flex gap-2 mb-4">
          <Button onClick={() => setDrawingMode(true)}>
            <MapPin className="w-4 h-4 mr-2" /> Add Manhole
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current.click()}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".geojson,.json"
            className="hidden"
          />
        </div>

        <div className="space-y-2 mb-4">
          <Label>Filters</Label>
          <div className="flex gap-2">
            <Select
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
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
              className="cursor-pointer hover:bg-accent"
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
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center mr-3">
                    {manhole.cover_status === "open" ? (
                      <span className="text-destructive">✕ Open</span>
                    ) : (
                      <span className="text-success">✓ Closed</span>
                    )}
                  </span>
                  <span>
                    {manhole.overflow_level === "good" ? (
                      <span className="text-success">Good</span>
                    ) : manhole.overflow_level === "risk" ? (
                      <span className="text-warning">Risk</span>
                    ) : (
                      <span className="text-destructive">Overflow</span>
                    )}
                  </span>
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
                className="cursor-pointer hover:bg-accent"
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
                  <div className="text-xs text-muted-foreground mt-1">
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
            <Card key={worker.id} className="hover:bg-accent">
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
                  <div className="text-xs text-muted-foreground mt-1">
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
            <div>
              <Label>Cover</Label>
              <div>
                {selectedManhole.cover_status === "open" ? (
                  <span className="text-destructive">Open ✕</span>
                ) : (
                  <span className="text-success">Closed ✓</span>
                )}
              </div>
            </div>
            <div>
              <Label>Overflow Level</Label>
              <div>
                {selectedManhole.overflow_level === "good" ? (
                  <span className="text-success">Good</span>
                ) : selectedManhole.overflow_level === "risk" ? (
                  <span className="text-warning">Risk</span>
                ) : (
                  <span className="text-destructive">Overflow</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Connected Manholes</Label>
            <div className="mt-2 space-y-1">
              {selectedManhole.connections.map(connId => {
                const connManhole = manholes.find(m => m.id === connId);
                return connManhole ? (
                  <div key={connId} className="flex items-center text-sm p-2 bg-accent rounded">
                    <span className="font-medium">{connManhole.code}</span>
                    <span className="mx-2">→</span>
                    <span>
                      {pipes.find(p => 
                        (p.start === selectedManhole.id && p.end === connId) || 
                        (p.start === connId && p.end === selectedManhole.id)
                      )?.blockage ? (
                        <span className="text-destructive">Blocked Pipe</span>
                      ) : (
                        <span className="text-success">Clear Pipe</span>
                      )}
                    </span>
                  </div>
                ) : null;
              })}
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
                  <TableRow key={log.timestamp}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
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

    {/* Selected pipe details */}
    {selectedPipe && (
      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Pipe Details</h3>
          <Button variant="ghost" size="sm" onClick={() => setSelectedPipe(null)}>
            Close
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>From:</span>
            <span>MH-{selectedPipe.start}</span>
          </div>
          <div className="flex justify-between">
            <span>To:</span>
            <span>MH-{selectedPipe.end}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span>
              {selectedPipe.blockage ? (
                <span className="text-destructive">Blocked</span>
              ) : (
                <span className="text-success">Clear</span>
              )}
            </span>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => {
              setPipes(pipes.map(p => 
                p.id === selectedPipe.id ? {...p, blockage: !p.blockage} : p
              ));
            }}
          >
            {selectedPipe.blockage ? "Mark as Clear" : "Mark as Blocked"}
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
    
    {/* Legend */}
    <div className="w-[200px] border border-white p-4 absolute left-0 bottom-10 shadow-lg  z-50 rounded-md bg-background">
      <h3 className="text-lg font-bold">Legend</h3>
      <div className="flex items-center my-2">
        <XCircle className="mr-2" size={20} color="red" /> Overflow
      </div>
      <div className="flex items-center my-2">
        <AlertTriangle className="mr-2" size={20} color="yellow" /> Risk of Overflow
      </div>
      <div className="flex items-center my-2">
        <CheckCircle className="mr-2" size={20} color="green" /> All Good
      </div>
    </div>
  </div>
</div>
  );
};

export default SewageSystemMap;