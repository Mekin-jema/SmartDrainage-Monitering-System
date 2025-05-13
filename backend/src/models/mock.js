manholes: [
  {
    manholeId: 'mh001',
    name: 'Manhole #12',
    location: { lat: 9.0123, lng: 38.7894 },
    timestamp: '2025-04-30T08:15:00Z',
    sensors: {
      sewageLevel: 85, // cm
      methaneLevel: 300, // ppm
      flowRate: 15.5, // L/s
      temperature: 24.5, // °C
      humidity: 65, // %
      batteryLevel: 78, // %
    },
    thresholds: {
      maxDistance: 90, // cm (overflow threshold)
      maxGas: 1000, // ppm
      minFlow: 5, // L/s (blockage threshold)
    },
    lastCalibration: '2025-04-15T00:00:00Z',
    batteryLevel: 78,
    status: 'critical',
    alertTypes: ['sewage_high', 'low_battery', 'bloackage'],
  },
  {
    manholeId: 'mh002',
    name: 'Manhole #07',
    location: { lat: 9.0156, lng: 38.7912 },
    timestamp: '2025-04-30T07:30:00Z',
    sensors: {
      sewageLevel: 45,
      methaneLevel: 1200, // Above threshold
      flowRate: 12.1,
      batteryLevel: 65,
      temperature: 22.0,
    },
    thresholds: {
      maxDistance: 95,
      maxGas: 1000,
      minFlow: 5,
    },
    lastCalibration: '2025-04-10T00:00:00Z',
    batteryLevel: 65,
    status: 'critical',
    alertTypes: ['gas_leak'],
  },
  {
    manholeId: 'mh003',
    name: 'Manhole #23',
    location: { lat: 9.0142, lng: 38.7931 },
    timestamp: '2025-04-29T16:45:00Z',
    sensors: {
      sewageLevel: 35,
      methaneLevel: 250,
      flowRate: 3.8, // Below threshold
      temperature: 26.2,
      humidity: 70,
      batteryLevel: 92,
    },
    thresholds: {
      maxDistance: 85,
      maxGas: 1000,
      minFlow: 5,
    },
    lastCalibration: '2025-04-18T00:00:00Z',
    batteryLevel: 92,
    status: 'critical',
    alertTypes: ['blockage'],
  },
];
