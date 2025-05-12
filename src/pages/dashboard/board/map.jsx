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
  Droplet,
  Wrench,
  ArrowRight,
  Circle

} from "lucide-react";


// SVG Icons for manholes


const SewageSystemMap = () => {
  const style = "https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0d3e5c9668f242409228bfa012c04031"
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
      { id: "10", code: "MH-010", location: [38.7710, 8.9970], status: "functional", zone: "D", lastInspection: "2023-06-08", cover_status: "closed", overflow_level: "good", connections: ["9"] },

      // Branch A
      { id: "11", code: "MH-011", location: [38.7658, 9.0065], status: "functional", zone: "A", lastInspection: "2023-06-10", cover_status: "closed", overflow_level: "good", connections: ["2", "12"] },
      { id: "12", code: "MH-012", location: [38.7665, 9.0075], status: "damaged", zone: "B", lastInspection: "2023-05-15", cover_status: "open", overflow_level: "risk", connections: ["11"] },

      // Branch B
      { id: "13", code: "MH-013", location: [38.7665, 9.0028], status: "under_maintenance", zone: "C", lastInspection: "2023-06-02", cover_status: "open", overflow_level: "moderate", connections: ["4", "14"] },
      { id: "14", code: "MH-014", location: [38.7670, 9.0036], status: "functional", zone: "C", lastInspection: "2023-06-03", cover_status: "closed", overflow_level: "good", connections: ["13"] },

      // Branch C
      { id: "15", code: "MH-015", location: [38.7682, 9.0009], status: "overflowing", zone: "C", lastInspection: "2023-06-06", cover_status: "open", overflow_level: "overflow", connections: ["6"] },
    ];

    const generatedPipes = [];

    // Helper function to get manhole by ID
    const getManhole = (id) => mockManholes.find(mh => mh.id === id);

    // Helper function to determine blockage
    const shouldBlock = (startId, endId) => {
      const startMh = getManhole(startId);
      const endMh = getManhole(endId);

      // If either is overflowing, pipe is blocked
      if (startMh.status === "overflowing" || endMh.status === "overflowing") {
        return true;
      }

      // If both are damaged, pipe is blocked
      if (startMh.status === "damaged" && endMh.status === "damaged") {
        return true;
      }

      // If one is damaged and the other has risk overflow
      if ((startMh.status === "damaged" && endMh.overflow_level === "risk") ||
        (endMh.status === "damaged" && startMh.overflow_level === "risk")) {
        return true;
      }

      // Random 10% chance for functional pipes to be blocked
      if (Math.random() < 0.1 && startMh.status === "functional" && endMh.status === "functional") {
        return true;
      }

      return false;
    };

    mockManholes.forEach((mh) => {
      mh.connections.forEach((connId) => {
        // Ensure each pipe is only added once (undirected edge)
        const existing = generatedPipes.find(
          (pipe) =>
            (pipe.start === mh.id && pipe.end === connId) ||
            (pipe.start === connId && pipe.end === mh.id)
        );

        if (!existing) {
          generatedPipes.push({
            id: `p-${mh.id}-${connId}`,
            start: mh.id,
            end: connId,
            blockage: shouldBlock(mh.id, connId)
          });
        }
      });
    });

    console.log(generatedPipes);



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
    setPipes(generatedPipes)
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

    map.addControl(new maplibregl.NavigationControl(), "top-left");
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
                return { ...m, connections: [...m.connections, clickedManhole.id] };
              }
              if (m.id === clickedManhole.id && !m.connections.includes(connectingManhole)) {
                return { ...m, connections: [...m.connections, connectingManhole] };
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


  const updateLayers = async (map) => {
    // Import the API key
    const API_KEY = "0d3e5c9668f242409228bfa012c04031"
    console.log("API_KEY", API_KEY);

    // Remove existing layers and sources
    const layersToRemove = [
      'manholes-circle', 'manholes-status-icon', 'manholes-cover-status',
      'manholes-code-label', 'pipes-line', 'pipes-arrows',
      'pipes-blocked-highlight', 'manholes-popup-highlight', 'pipes-flow-direction'
    ];

    layersToRemove.forEach(layer => {
      if (map.getLayer(layer)) map.removeLayer(layer);
    });

    if (map.getSource('manholes')) map.removeSource('manholes');
    if (map.getSource('pipes')) map.removeSource('pipes');

    // Load pipes with flow direction information
    const pipeFeatures = pipes.map(pipe => {
      const start = manholes.find(m => m.id === pipe.start);
      const end = manholes.find(m => m.id === pipe.end);
      if (!start || !end) return null;

      const dx = end.location[0] - start.location[0];
      const dy = end.location[1] - start.location[1];
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      // Calculate midpoint for flow direction indicators
      const midPoint = [
        start.location[0] + dx * 0.5,
        start.location[1] + dy * 0.5
      ];
      const quarterPoint = [
        start.location[0] + dx * 0.25,
        start.location[1] + dy * 0.25
      ];
      const threeQuarterPoint = [
        start.location[0] + dx * 0.75,
        start.location[1] + dy * 0.75
      ];

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [start.location, end.location]
        },
        properties: {
          id: pipe.id,
          blockage: pipe.blockage,
          start: pipe.start,
          end: pipe.end,
          angle,
          flowDirection: pipe.flowDirection || 'start_to_end', // default flow direction
          midPoint: midPoint,
          quarterPoint: quarterPoint,
          threeQuarterPoint: threeQuarterPoint
        }
      };
    }).filter(Boolean);

    map.addSource('pipes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: pipeFeatures
      }
    });

    // Load manholes
    const manholeFeatures = manholes.map(m => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: m.location
      },
      properties: {
        id: m.id,
        code: m.code,
        status: m.status,
        overflow_level: m.overflow_level,
        cover_status: m.cover_status,
        last_inspection: m.last_inspection,
        flow_rate: m.flow_rate
      }
    }));

    map.addSource('manholes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: manholeFeatures
      }
    });

    // === Improved icon definitions for manhole status ===
    const statusToIcon = {
      'functional': { icon: 'check-circle', color: 'green' },
      'damaged': { icon: 'alert-circle', color: 'red' },
      'overflowing': { icon: 'alert-triangle', color: 'purple' },
      'under_maintenance': { icon: 'wrench', color: 'orange' },
      'needs_cleaning': { icon: 'broom', color: 'yellow' },
      'default': { icon: 'help-circle', color: 'gray' }
    };

    const coverStatusToIcon = {
      'open': { icon: 'lock-open', color: 'red' },
      'closed': { icon: 'lock', color: 'green' },
      'damaged': { icon: 'alert-circle', color: 'orange' }
    };

    // Add a map event listener to handle missing icons
    map.on('styleimagemissing', async (event) => {
      const missingIconId = event.id;
      console.log(`Missing icon: ${missingIconId}`);

      // Check if it's a manhole status icon
      if (missingIconId.startsWith('geoapify-status-')) {
        const manholeId = missingIconId.replace('geoapify-status-', '');
        const manhole = manholes.find(m => m.id === manholeId);
        if (manhole) {
          const status = manhole.status || 'default';
          const iconDef = statusToIcon[status] || statusToIcon['default'];
          const iconUrl = `https://api.geoapify.com/v2/icon/?type=material&color=${iconDef.color}&size=42&icon=${iconDef.icon}&apiKey=${API_KEY}`;

          try {
            const response = await fetch(iconUrl);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);
            if (!map.hasImage(missingIconId)) {
              map.addImage(missingIconId, imageBitmap);
            }
          } catch (error) {
            console.error(`Failed to load icon for ${missingIconId}:`, error);
          }
        }
      }
      // Check if it's a cover status icon
      else if (missingIconId.startsWith('geoapify-cover-')) {
        const manholeId = missingIconId.replace('geoapify-cover-', '');
        const manhole = manholes.find(m => m.id === manholeId);
        if (manhole) {
          const status = manhole.cover_status || 'closed';
          const iconDef = coverStatusToIcon[status] || coverStatusToIcon['closed'];
          const iconUrl = `https://api.geoapify.com/v2/icon/?type=material&color=${iconDef.color}&size=24&icon=${iconDef.icon}&apiKey=${API_KEY}`;

          try {
            const response = await fetch(iconUrl);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);
            if (!map.hasImage(missingIconId)) {
              map.addImage(missingIconId, imageBitmap);
            }
          } catch (error) {
            console.error(`Failed to load icon for ${missingIconId}:`, error);
          }
        }
      }
      // Check if it's a flow direction icon
      else if (missingIconId === 'flow-arrow') {
        const iconUrl = `https://api.geoapify.com/v2/icon/?type=material&color=blue&size=24&icon=arrow-right&apiKey=${API_KEY}`;
        try {
          const response = await fetch(iconUrl);
          const blob = await response.blob();
          const imageBitmap = await createImageBitmap(blob);
          if (!map.hasImage('flow-arrow')) {
            map.addImage('flow-arrow', imageBitmap);
          }
        } catch (error) {
          console.error(`Failed to load flow direction icon:`, error);
        }
      }
    });

    // Preload and add icons
    for (const manhole of manholes) {
      // Load status icon
      const statusIconId = `geoapify-status-${manhole.id}`;
      if (!map.hasImage(statusIconId)) {
        const status = manhole.status || 'default';
        const iconDef = statusToIcon[status] || statusToIcon['default'];
        const iconUrl = `https://api.geoapify.com/v2/icon/?type=material&color=${iconDef.color}&size=42&icon=${iconDef.icon}&apiKey=${API_KEY}`;

        try {
          const response = await fetch(iconUrl);
          const blob = await response.blob();
          const imageBitmap = await createImageBitmap(blob);
          map.addImage(statusIconId, imageBitmap);
        } catch (error) {
          console.error(`Failed to load icon for ${statusIconId}:`, error);
        }
      }

      // Load cover status icon
      const coverIconId = `geoapify-cover-${manhole.id}`;
      if (!map.hasImage(coverIconId)) {
        const status = manhole.cover_status || 'closed';
        const iconDef = coverStatusToIcon[status] || coverStatusToIcon['closed'];
        const iconUrl = `https://api.geoapify.com/v2/icon/?type=material&color=${iconDef.color}&size=24&icon=${iconDef.icon}&apiKey=${API_KEY}`;

        try {
          const response = await fetch(iconUrl);
          const blob = await response.blob();
          const imageBitmap = await createImageBitmap(blob);
          map.addImage(coverIconId, imageBitmap);
        } catch (error) {
          console.error(`Failed to load icon for ${coverIconId}:`, error);
        }
      }
    }

    // Preload flow direction icon if not already loaded
    if (!map.hasImage('flow-arrow')) {
      const iconUrl = `https://api.geoapify.com/v2/icon/?type=material&color=blue&size=24&icon=arrow-right&apiKey=${API_KEY}`;
      try {
        const response = await fetch(iconUrl);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        map.addImage('flow-arrow', imageBitmap);
      } catch (error) {
        console.error(`Failed to load flow direction icon:`, error);
      }
    }

    // === Add layers ===

    // 1. Status icon using Geoapify icons
    map.addLayer({
      id: 'manholes-status-icon',
      type: 'symbol',
      source: 'manholes',
      layout: {
        'icon-image': ['concat', 'geoapify-status-', ['get', 'id']],
        'icon-size': 1,
        'icon-allow-overlap': true
      }
    });

    // 2. Cover status icon
    map.addLayer({
      id: 'manholes-cover-status',
      type: 'symbol',
      source: 'manholes',
      layout: {
        'icon-image': ['concat', 'geoapify-cover-', ['get', 'id']],
        'icon-size': 0.6,
        'icon-offset': [0, -0.8],
        'icon-allow-overlap': true
      }
    });

    // 3. Manhole code label
    map.addLayer({
      id: 'manholes-code-label',
      type: 'symbol',
      source: 'manholes',
      layout: {
        'text-field': ['get', 'code'],
        'text-size': 10,
        'text-offset': [0, 1.5],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-allow-overlap': false
      },
      paint: {
        'text-color': '#1F2937',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 1
      }
    });

    // 4. Pipe line
    map.addLayer({
      id: 'pipes-line',
      type: 'line',
      source: 'pipes',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'blockage'], true], '#EF4444',
          ['==', ['get', 'flowDirection'], 'bidirectional'], '#10B981',
          '#3B82F6'
        ],
        'line-width': 3,
        'line-opacity': 0.8
      }
    });

    // 5. Flow direction indicators
    map.addLayer({
      id: 'pipes-flow-direction',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 150,
        'icon-image': 'flow-arrow',
        'icon-size': 0.7,
        'icon-rotate': ['get', 'angle'],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport'
      },
      filter: ['!=', ['get', 'flowDirection'], 'bidirectional']
    });

    // For bidirectional pipes, add arrows in both directions
    map.addLayer({
      id: 'pipes-bidirectional-arrows',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 150,
        'icon-image': 'flow-arrow',
        'icon-size': 0.7,
        'icon-rotate': ['get', 'angle'],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport'
      },
      filter: ['==', ['get', 'flowDirection'], 'bidirectional']
    });

    map.addLayer({
      id: 'pipes-bidirectional-arrows-reverse',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 150,
        'icon-image': 'flow-arrow',
        'icon-size': 0.7,
        'icon-rotate': ['+', ['get', 'angle'], 180],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport'
      },
      filter: ['==', ['get', 'flowDirection'], 'bidirectional']
    });

    // 6. Highlight blocked pipes
    map.addLayer({
      id: 'pipes-blocked-highlight',
      type: 'line',
      source: 'pipes',
      filter: ['==', ['get', 'blockage'], true],
      paint: {
        'line-color': '#EF4444',
        'line-width': 5,
        'line-dasharray': [2, 2],
        'line-opacity': 0.6
      }
    });

    // 7. Highlight hovered manhole
    map.addLayer({
      id: 'manholes-popup-highlight',
      type: 'circle',
      source: 'manholes',
      paint: {
        'circle-radius': 15,
        'circle-color': '#FACC15',
        'circle-opacity': 0.2
      },
      filter: ['==', 'id', '']
    });

    // === Events ===
    map.on('click', 'manholes-status-icon', (e) => {
      const manhole = manholes.find(m => m.id === e.features[0].properties.id);
      if (manhole) handleManholeClick(manhole);
    });

    map.on('click', 'pipes-line', (e) => {
      const pipe = pipes.find(p => p.id === e.features[0].properties.id);
      if (pipe) {
        setSelectedPipe(pipe);
        setSelectedManhole(null);
      }
    });

    map.on('mouseenter', 'manholes-status-icon', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'manholes-status-icon', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'pipes-line', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'pipes-line', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mousemove', 'manholes-status-icon', (e) => {
      map.setFilter('manholes-popup-highlight', ['==', 'id', e.features[0].properties.id]);
    });
    map.on('mouseleave', 'manholes-status-icon', () => {
      map.setFilter('manholes-popup-highlight', ['==', 'id', '']);
    });
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
                    p.id === selectedPipe.id ? { ...p, blockage: !p.blockage } : p
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