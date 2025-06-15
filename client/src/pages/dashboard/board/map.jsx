import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
} from 'lucide-react';
import { useManholeStore } from '@/store/useManholeStore';

// Custom SVG Icons for manholes
const ManholeIcon = ({ status }) => {
  console.log('Rendering ManholeIcon with status:', status);
  const getIconProps = () => {
    switch (status) {
      case 'functional':
        return { fill: '#10B981', stroke: '#059669' }; // Green
      case 'critical':
        return { fill: '#EF4444', stroke: '#DC2626' };
      case 'warning':
        return { fill: '#EF4455', stroke: '#DC2626' };
      // Red
      case 'overflowing':
        return { fill: '#8B5CF6', stroke: '#7C3AED' }; // Purple
      case 'under_maintenance':
        return { fill: '#F59E0B', stroke: '#D97706' }; // Orange
      default:
        return { fill: '#6B7280', stroke: '#4B5563' }; // Gray
    }
  };

  const { fill, stroke } = getIconProps();

  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx="12" cy="12" r="6" fill={fill} stroke={stroke} strokeWidth="2" />
      <line x1="12" y1="2" x2="12" y2="6" stroke={stroke} strokeWidth="2" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={stroke} strokeWidth="2" />
      <line x1="2" y1="12" x2="6" y2="12" stroke={stroke} strokeWidth="2" />
      <line x1="18" y1="12" x2="22" y2="12" stroke={stroke} strokeWidth="2" />
    </svg>
  );
};

const SewageSystemMap = () => {
  const style =
    'https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0d3e5c9668f242409228bfa012c04031';
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  // State
  const [manholes, setManholes] = useState([]);
  const [pipes, setPipes] = useState([]);
  const [selectedManhole, setSelectedManhole] = useState(null);
  const [selectedPipe, setSelectedPipe] = useState(null);
  const [readings, setReadings] = useState([]);
  const [logs, setLogs] = useState([]);

  const [route, setRoute] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [newManholeLocation, setNewManholeLocation] = useState(null);
  const [connectingManhole, setConnectingManhole] = useState(null);
  const [flowDirectionMode, setFlowDirectionMode] = useState(false);
  const [editingPipe, setEditingPipe] = useState(null);

  const {
    manholesData, // List of manholes
    loading, // Loading state
    error,
    fetchSystemStatus, // Error state
    fetchManholes, // Action to fetch manholes
  } = useManholeStore(); // Accessing the Zustand store
  //import socket.io

  // Socket.IO ref


  useEffect(() => {
    fetchManholes();
    // fetchSystemStatus()
  }, []);
  // Load initial data with elevation data for flow direction
  useEffect(() => {
    // Enrich manhole data with default values
    const enrichedManholes = manholesData.map((mh) => ({
      ...mh,
      connections: mh.connections || [], // Ensure connections exist
      location: mh.location || [0, 0], // Default coordinates
      elevation: mh.elevation ?? Math.floor(Math.random() * 100), // Default or random elevation
      overflow_level: mh.overflow_level || 'good',
      cover_status: mh.cover_status || 'closed',
      lastInspection: mh.lastInspection || new Date().toISOString().split('T')[0],
      zone: mh.zone || 'A',
      status: mh.status || 'functional',
    }));

    // Helper to find a manhole by ID
    const getManhole = (id) => enrichedManholes.find((mh) => mh.id === id);

    // Determine if a pipe should be blocked
    const shouldBlock = (startId, endId) => {
      const start = getManhole(startId);
      const end = getManhole(endId);
      if (!start || !end) return false;

      const startStatus = start.status || 'functional';
      const endStatus = end.status || 'functional';
      const startOverflow = start.overflow_level || 'good';
      const endOverflow = end.overflow_level || 'good';

      if (startStatus === 'overflowing' || endStatus === 'overflowing') return true;
      if (startStatus === 'damaged' && endStatus === 'damaged') return true;
      if (
        (startStatus === 'damaged' && endOverflow === 'risk') ||
        (endStatus === 'damaged' && startOverflow === 'risk')
      )
        return true;

      // 10% chance of random blockage for functional pipes
      return Math.random() < 0.1 && startStatus === 'functional' && endStatus === 'functional';
    };

    // Determine flow direction by elevation
    const getFlowDirection = (startId, endId) => {
      const start = getManhole(startId);
      const end = getManhole(endId);
      if (!start || !end) return 'bidirectional';

      if (start.elevation > end.elevation) return 'start_to_end';
      if (start.elevation < end.elevation) return 'end_to_start';
      return 'bidirectional';
    };

    // Generate pipes from connections
    const generatedPipes = [];
    const seenPairs = new Set(); // To avoid duplicate pipes

    enrichedManholes.forEach((mh) => {
      mh.connections.forEach((connId) => {
        const key = [mh.id, connId].sort().join('-');
        if (!seenPairs.has(key)) {
          seenPairs.add(key);

          generatedPipes.push({
            id: `p-${mh.id}-${connId}`,
            start: mh.id,
            end: connId,
            blockage: shouldBlock(mh.id, connId),
            flowDirection: getFlowDirection(mh.id, connId),
            diameter: Math.floor(Math.random() * 300) + 100, // 100–400mm
          });
        }
      });
    });


    // Set states
    setManholes(enrichedManholes);
    setPipes(generatedPipes);

  }, [manholesData]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: [38.764006, 9.037890],
      zoom: 15,
    });

    map.flyTo({
      center: [38.764006, 9.037890],
      zoom: 15,
      speed: 7,
      curve: 1, 'animate': true,
      easing(t) {
        return t;
      }
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-left');
    map.addControl(new maplibregl.FullscreenControl(), 'top-left');
    mapRef.current = map;

    // Handle map clicks for drawing mode
    map.on('click', (e) => {
      if (flowDirectionMode && editingPipe) {
        // Toggle flow direction
        setPipes(
          pipes.map((p) => {
            if (p.id === editingPipe.id) {
              const newDirection =
                p.flowDirection === 'start_to_end'
                  ? 'end_to_start'
                  : p.flowDirection === 'end_to_start'
                    ? 'bidirectional'
                    : 'start_to_end';
              return { ...p, flowDirection: newDirection };
            }
            return p;
          })
        );
        setEditingPipe(null);
        setFlowDirectionMode(false);
        return;
      }

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
              flowDirection: 'start_to_end', // Default flow direction
              diameter: 200, // Default diameter
            };
            setPipes([...pipes, newPipe]);

            // Update manhole connections
            setManholes(
              manholes.map((m) => {
                if (m.id === connectingManhole && !m.connections.includes(clickedManhole.id)) {
                  return { ...m, connections: [...m.connections, clickedManhole.id] };
                }
                if (m.id === clickedManhole.id && !m.connections.includes(connectingManhole)) {
                  return { ...m, connections: [...m.connections, connectingManhole] };
                }
                return m;
              })
            );

            setConnectingManhole(null);
          }
        }
      }
    });


    return () => map.remove();
  }, [
    drawingMode,
    newManholeLocation,
    connectingManhole,
    flowDirectionMode,
    editingPipe,
    manholes,

  ]);

  // Find manhole at map point
  const findManholeAtPoint = (point) => {
    if (!mapRef.current) return null;

    const features = mapRef.current.queryRenderedFeatures(point, {
      layers: ['manholes-layer'],
    });

    if (features.length > 0) {
      return manholes.find((m) => m.id === features[0].properties.id);
    }
    return null;
  };

  const updateLayers = async (map) => {
    // Remove existing layers and sources
    const layersToRemove = [
      'manholes-circle',
      'manholes-status-icon',
      'manholes-cover-status',
      'manholes-code-label',
      'pipes-line',
      'pipes-arrows',
      'pipes-blocked-highlight',
      'manholes-popup-highlight',
      'pipes-flow-direction',
      'pipes-bidirectional-arrows',
      'pipes-bidirectional-arrows-reverse',
      'pipes-diameter-label',
      'manholes-elevation-label',
    ];

    layersToRemove.forEach((layer) => {
      if (map.getLayer(layer)) map.removeLayer(layer);
    });

    if (map.getSource('manholes')) map.removeSource('manholes');
    if (map.getSource('pipes')) map.removeSource('pipes');

    // Load pipes with flow direction information
    const pipeFeatures = pipes
      .map((pipe) => {
        const start = manholes.find((m) => m.id === pipe.start);
        const end = manholes.find((m) => m.id === pipe.end);
        if (!start || !end) return null;

        const dx = end.location[0] - start.location[0];
        const dy = end.location[1] - start.location[1];
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        // Calculate points for flow direction indicators
        const midPoint = [start.location[0] + dx * 0.5, start.location[1] + dy * 0.5];
        const quarterPoint = [start.location[0] + dx * 0.25, start.location[1] + dy * 0.25];
        const threeQuarterPoint = [start.location[0] + dx * 0.75, start.location[1] + dy * 0.75];

        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [start.location, end.location],
          },
          properties: {
            id: pipe.id,
            blockage: pipe.blockage,
            start: pipe.start,
            end: pipe.end,
            angle,
            flowDirection: pipe.flowDirection,
            midPoint: midPoint,
            quarterPoint: quarterPoint,
            threeQuarterPoint: threeQuarterPoint,
            diameter: pipe.diameter,
            startElevation: start.elevation,
            endElevation: end.elevation,
          },
        };
      })
      .filter(Boolean);

    map.addSource('pipes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: pipeFeatures,
      },
    });

    // Load manholes with elevation data
    const manholeFeatures = manholes.map((m) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: m.location,
      },
      properties: {
        id: m.id,
        code: m.code,
        status: m.status,
        overflow_level: m.overflow_level,
        cover_status: m.cover_status,
        last_inspection: m.last_inspection,
        flow_rate: m.flow_rate,
        elevation: m.elevation,
      },
    }));

    map.addSource('manholes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: manholeFeatures,
      },
    });

    // === Improved layer setup ===

    // Base circle for manholes (larger size)
    map.addLayer({
      id: 'manholes-circle',
      type: 'circle',
      source: 'manholes',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 15, 8, 20, 12],
        'circle-color': [
          'case',
          ['==', ['get', 'status'], 'functional'], ' #22c55e',      // Green
          ['==', ['get', 'status'], 'warning'], '#F59E0B',         // Amber
          ['==', ['get', 'status'], 'critical'], '#ef4444 ',        // Red
          ['==', ['get', 'status'], 'overflowing'], '#a855f7 ',     // Purple
          ['==', ['get', 'status'], 'under_maintenance'], '#eab308 ', // Light Amber
          '#6B7280' // Default Gray
        ],
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 2,
      }

    });

    // Manhole code label (larger font)
    map.addLayer({
      id: 'manholes-code-label',
      type: 'symbol',
      source: 'manholes',
      layout: {
        'text-field': ['get', 'code'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 10, 10, 15, 12, 20, 14],
        'text-offset': [0, 1.5],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#1F2937',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 2,
      },
    });

    // Elevation label
    map.addLayer({
      id: 'manholes-elevation-label',
      type: 'symbol',
      source: 'manholes',
      layout: {
        'text-field': ['concat', ['get', 'elevation'], 'm'],
        'text-size': 10,
        'text-offset': [0, -1.5],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#1F2937',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 1,
      },
    });

    // Pipe line with variable width based on diameter
    map.addLayer({
      id: 'pipes-line',
      type: 'line',
      source: 'pipes',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'blockage'], true],
          ' #ef4444',
          ['==', ['get', 'flowDirection'], 'bidirectional'],
          ' #22c55e ',
          '#3B82F6',
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['get', 'diameter'],
          100,
          2,
          200,
          3,
          300,
          4,
          400,
          5,
        ],
        'line-opacity': 0.8,
      },
    });

    // Pipe diameter label
    map.addLayer({
      id: 'pipes-diameter-label',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line-center',
        'text-field': ['concat', ['get', 'diameter'], 'mm'],
        'text-size': 10,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-rotation-alignment': 'map',
      },
      paint: {
        'text-color': '#1F2937',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 1,
      },
    });

    // Flow direction indicators (more prominent)
    map.addLayer({
      id: 'pipes-flow-direction',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 100,
        'icon-image': 'arrow-right',
        'icon-size': 0.8,
        'icon-rotate': ['get', 'angle'],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport',
      },
      filter: ['==', ['get', 'flowDirection'], 'start_to_end'],
    });

    // Reverse flow direction indicators
    map.addLayer({
      id: 'pipes-flow-direction-reverse',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 100,
        'icon-image': 'arrow-right',
        'icon-size': 0.8,
        'icon-rotate': ['+', ['get', 'angle'], 180],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport',
      },
      filter: ['==', ['get', 'flowDirection'], 'end_to_start'],
    });

    // Bidirectional pipes - two sets of arrows
    map.addLayer({
      id: 'pipes-bidirectional-arrows',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 100,
        'icon-image': 'arrow-right',
        'icon-size': 0.8,
        'icon-rotate': ['get', 'angle'],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport',
      },
      filter: ['==', ['get', 'flowDirection'], 'bidirectional'],
    });

    map.addLayer({
      id: 'pipes-bidirectional-arrows-reverse',
      type: 'symbol',
      source: 'pipes',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 100,
        'icon-image': 'arrow-right',
        'icon-size': 0.8,
        'icon-rotate': ['+', ['get', 'angle'], 180],
        'icon-allow-overlap': true,
        'icon-pitch-alignment': 'viewport',
      },
      filter: ['==', ['get', 'flowDirection'], 'bidirectional'],
    });

    // // Highlight blocked pipes (more visible)
    // map.addLayer({
    //   id: 'pipes-blocked-highlight',
    //   type: 'line',
    //   source: 'pipes',
    //   filter: ['==', ['get', 'blockage'], true],
    //   paint: {
    //     'line-color': '#EF4444',
    //     'line-width': [
    //       'interpolate',
    //       ['linear'],
    //       ['get', 'diameter'],
    //       100,
    //       4,
    //       200,
    //       5,
    //       300,
    //       6,
    //       400,
    //       7,
    //     ],
    //     'line-dasharray': [2, 2],
    //     'line-opacity': 0.8,
    //   },
    // });

    // // Highlight hovered manhole
    // map.addLayer({
    //   id: 'manholes-popup-highlight',
    //   type: 'circle',
    //   source: 'manholes',
    //   paint: {
    //     'circle-radius': 20,
    //     'circle-color': '#FACC15',
    //     'circle-opacity': 0.3,
    //     'circle-stroke-width': 2,
    //     'circle-stroke-color': '#FACC15',
    //   },
    //   filter: ['==', 'id', ''],
    // });

    // // Highlight hovered pipe
    // map.addLayer({
    //   id: 'pipes-popup-highlight',
    //   type: 'line',
    //   source: 'pipes',
    //   paint: {
    //     'line-color': '#FACC15',
    //     'line-width': [
    //       'interpolate',
    //       ['linear'],
    //       ['get', 'diameter'],
    //       100,
    //       6,
    //       200,
    //       7,
    //       300,
    //       8,
    //       400,
    //       9,
    //     ],
    //     'line-opacity': 0.6,
    //   },
    //   filter: ['==', 'id', ''],
    // });

    // === Events ===
    map.on('click', 'manholes-circle', (e) => {
      const manhole = manholes.find((m) => m.id === e.features[0].properties.id);
      if (manhole) handleManholeClick(manhole);
    });

    map.on('click', 'pipes-line', (e) => {
      const pipe = pipes.find((p) => p.id === e.features[0].properties.id);
      if (pipe) {
        setSelectedPipe(pipe);
        setSelectedManhole(null);
      }
    });

    map.on('mouseenter', 'manholes-circle', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'manholes-circle', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'pipes-line', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'pipes-line', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mousemove', 'manholes-circle', (e) => {
      map.setFilter('manholes-popup-highlight', ['==', 'id', e.features[0].properties.id]);
    });
    map.on('mouseleave', 'manholes-circle', () => {
      map.setFilter('manholes-popup-highlight', ['==', 'id', '']);
    });

    map.on('mousemove', 'pipes-line', (e) => {
      map.setFilter('pipes-popup-highlight', ['==', 'id', e.features[0].properties.id]);
    });
    map.on('mouseleave', 'pipes-line', () => {
      map.setFilter('pipes-popup-highlight', ['==', 'id', '']);
    });

    // Preload arrow icon
    if (!map.hasImage('arrow-right')) {
      map.loadImage(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Right_arrow_key.svg/1200px-Right_arrow_key.svg.png',
        (error, image) => {
          if (error) throw error;
          map.addImage('arrow-right', image);
        }
      );
    }
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
  }, [manholes, manholesData, pipes]);

  // Handle manhole click
  const handleManholeClick = (manhole) => {
    setSelectedManhole(manhole);
    setSelectedPipe(null);

    // Fetch readings and logs for this manhole
    const mockReadings = [
      { timestamp: '2023-06-01T10:00', waterLevel: 30, methaneLevel: 5, temperature: 25 },
      { timestamp: '2023-06-01T12:00', waterLevel: 45, methaneLevel: 7, temperature: 26 },
      { timestamp: '2023-06-01T14:00', waterLevel: 60, methaneLevel: 8, temperature: 27 },
    ];
    setReadings(mockReadings);

    const mockLogs = [
      {
        timestamp: '2023-05-15T09:30',
        workerId: 'W1',
        action: 'routine_inspection',
        notes: 'No issues found',
      },
      {
        timestamp: '2023-04-20T11:15',
        workerId: 'W2',
        action: 'repair',
        notes: 'Replaced damaged cover',
      },
    ];
    setLogs(mockLogs);
  };


  // Generate optimal route
  const generateRoute = () => {
    // Simple implementation - in a real app you'd use a proper routing algorithm
    const routeCoordinates = manholes.map((m) => m.location);

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



  // Add new manhole
  const addNewManhole = () => {
    if (!newManholeLocation) return;

    const newManhole = {
      id: `${manholes.length + 1}`,
      code: `MH-${manholes.length + 1}`,
      location: [newManholeLocation.lng, newManholeLocation.lat],
      elevation: 0, // Default elevation
      status: 'functional',
      zone: 'A',
      lastInspection: new Date().toISOString().split('T')[0],
      cover_status: 'closed',
      overflow_level: 'good',
      connections: [],
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

  // Toggle pipe flow direction
  const toggleFlowDirection = (pipe) => {
    setFlowDirectionMode(true);
    setEditingPipe(pipe);
  };

  return (
    <div className="flex h-screen relative">
      {/* Legend */}
      <div className="  w-[220px] border border-white p-4 absolute left-0 top-0  shadow-lg z-50 rounded-md bg-background">
        <h3 className="text-lg font-bold mb-2">Legend</h3>

        <div className="flex items-center my-2">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span>Functional</span>
        </div>
        <div className="flex items-center my-2">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span>Critical</span>
        </div>
        <div className="flex items-center my-2">
          <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
          <span>Overflowing</span>
        </div>
        <div className="flex items-center my-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
          <span>Under Maintenance</span>
        </div>

        <div className="border-t my-2 pt-2">
          <div className="flex items-center my-1">
            <div className="w-4 h-1 bg-blue-500 mr-2"></div>
            <span>Clear Pipe</span>
          </div>
          <div className="flex items-center my-1">
            <div className="w-4 h-1 bg-red-500 mr-2"></div>
            <span>Blocked Pipe</span>
          </div>
          <div className="flex items-center my-1">
            <div className="w-4 h-1 bg-green-500 mr-2"></div>
            <span>Bidirectional Pipe</span>
          </div>
        </div>

        <div className="border-t my-2 pt-2">
          <div className="flex items-center my-1">
            <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
              <path d="M5 12l14 0m0 0l-7-7m7 7l-7 7" stroke="blue" strokeWidth="2" fill="none" />
            </svg>
            <span>Flow Direction</span>
          </div>
        </div>
      </div>
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

        {/* Flow direction mode indicator */}
        {flowDirectionMode && (
          <div className="absolute top-4 left-4 bg-background p-4 rounded-md shadow-md z-10 border">
            <h3 className="font-bold mb-2">Flow Direction Mode</h3>
            <p>Click on a pipe to change its flow direction</p>
            <Button
              variant="destructive"
              onClick={() => setFlowDirectionMode(false)}
              className="mt-2"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>






      {/* Selected manhole details */}
      {
        selectedManhole && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{selectedManhole.code}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedManhole(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center">
                    <ManholeIcon status={selectedManhole.status} className="mr-2" />
                    {selectedManhole.status}
                  </div>
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
                  <Label>Elevation</Label>
                  <div>{selectedManhole.elevation}m</div>
                </div>
                <div>
                  <Label>Cover</Label>
                  <div>
                    {selectedManhole.cover_status === 'open' ? (
                      <span className="text-destructive">Open ✕</span>
                    ) : (
                      <span className="text-success">Closed ✓</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Overflow Level</Label>
                  <div>
                    {selectedManhole.overflow_level === 'good' ? (
                      <span className="text-success">Good</span>
                    ) : selectedManhole.overflow_level === 'risk' ? (
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
                  {selectedManhole.connections.map((connId) => {
                    const connManhole = manholes.find((m) => m.id === connId);
                    const pipe = pipes.find(
                      (p) =>
                        (p.start === selectedManhole.id && p.end === connId) ||
                        (p.start === connId && p.end === selectedManhole.id)
                    );

                    return connManhole ? (
                      <div
                        key={connId}
                        className="flex items-center justify-between text-sm p-2 bg-accent rounded"
                      >
                        <div>
                          <span className="font-medium">{connManhole.code}</span>
                          <span className="mx-2">→</span>
                          <span>
                            {pipe?.blockage ? (
                              <span className="text-destructive">Blocked</span>
                            ) : (
                              <span className="text-success">Clear</span>
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{pipe?.diameter}mm</div>
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
                      <Line type="monotone" dataKey="waterLevel" stroke="#3b82f6" />
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
        )
      }

      {/* Selected pipe details */}
      {
        selectedPipe && (
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
                <span>
                  {manholes.find((m) => m.id === selectedPipe.start)?.code || selectedPipe.start}
                </span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span>
                  {manholes.find((m) => m.id === selectedPipe.end)?.code || selectedPipe.end}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Diameter:</span>
                <span>{selectedPipe.diameter}mm</span>
              </div>
              <div className="flex justify-between">
                <span>Flow Direction:</span>
                <span>
                  {selectedPipe.flowDirection === 'start_to_end'
                    ? 'From start to end'
                    : selectedPipe.flowDirection === 'end_to_start'
                      ? 'From end to start'
                      : 'Bidirectional'}
                </span>
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
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPipes(
                      pipes.map((p) =>
                        p.id === selectedPipe.id ? { ...p, blockage: !p.blockage } : p
                      )
                    );
                  }}
                >
                  {selectedPipe.blockage ? 'Mark as Clear' : 'Mark as Blocked'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleFlowDirection(selectedPipe)}
                >
                  Change Flow
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Route details */}
      {
        route && (
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
        )
      }


    </div >
    // </div >
  );
};

export default SewageSystemMap;
