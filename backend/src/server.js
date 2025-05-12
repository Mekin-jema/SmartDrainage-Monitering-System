import express from 'express';
import mqtt from 'mqtt';
import db from './configure/db.confige.js';
import router from './routes/index.js';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';
import Manholes from './models/manhole.model.js';
import sensorModel from './models/sensor.model.js';
dotenv.config();

const app = express();
const sensorData = []; // Array to store received sensor data
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send current data to newly connected client
  socket.emit('initialData', sensorData);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'drainage/sensor-data';

const mqttOptions = {
  clientId: `nodejs-server_${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

const mqttClient = mqtt.connect(MQTT_BROKER_URL, mqttOptions);

mqttClient.on('connect', () => {
  console.log(`MQTT Connected to: ${MQTT_BROKER_URL}`);
  mqttClient.subscribe(MQTT_TOPIC, { qos: 1 }, (err) => {
    if (err) console.error('MQTT Subscribe Error:', err);
    else console.log(`Subscribed to Topic: "${MQTT_TOPIC}"`);
  });
});

mqttClient.on('error', (err) => console.error('MQTT Connection Error:', err));
mqttClient.on('close', () => console.log('MQTT Connection Closed'));
mqttClient.on('reconnect', () => console.log('MQTT Reconnecting...'));

mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Add timestamp to the received data
    const timestampedData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // Store the data in array (you might want to limit the array size)
    sensorData.push(timestampedData);

    // Broadcast to all connected clients
    io.emit('sensorData', timestampedData);

    console.log('Received sensor data:', timestampedData);
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],

//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: 'http://localhost:5173', // Set this to your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials like cookies or HTTP authentication
  })
);

app.use('/api/v1', router);

process.on('SIGINT', () => {
  mqttClient.end();
  process.exit(0);
});

(async () => {
  try {
    await db();
    httpServer.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

//  insert many data to manhole.model
// const mockManholes = [
//   // === Main Road (6 Kilo to 5 Kilo) ===
//   {
//     id: '1',
//     code: 'MH-001',
//     location: {
//       type: 'Point',
//       coordinates: [38.758712, 9.031256],
//     },
//     elevation: 2400,
//     status: 'functional',
//     zone: 'A',
//     lastInspection: '2023-05-15',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['2'],
//   }, // Near 6 Kilo (Addis Ababa University)
//   {
//     id: '2',
//     code: 'MH-002',
//     location: {
//       type: 'Point',
//       coordinates: [38.759012, 9.030845],
//     },
//     elevation: 2395,
//     status: 'damaged',
//     zone: 'A',
//     lastInspection: '2023-04-20',
//     cover_status: 'open',
//     overflow_level: 'risk',
//     connections: ['1', '3'],
//   },
//   {
//     id: '3',
//     code: 'MH-003',
//     location: {
//       type: 'Point',
//       coordinates: [38.759423, 9.030512],
//     },
//     elevation: 2390,
//     status: 'overflowing',
//     zone: 'B',
//     lastInspection: '2023-06-01',
//     cover_status: 'closed',
//     overflow_level: 'overflow',
//     connections: ['2', '4'],
//   },
//   {
//     id: '4',
//     code: 'MH-004',
//     location: {
//       type: 'Point',
//       coordinates: [38.759815, 9.030201],
//     },
//     elevation: 2385,
//     status: 'functional',
//     zone: 'B',
//     lastInspection: '2023-05-25',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['3', '5'],
//   },
//   {
//     id: '5',
//     code: 'MH-005',
//     location: {
//       type: 'Point',
//       coordinates: [38.760302, 9.029843],
//     },
//     elevation: 2380,
//     status: 'under_maintenance',
//     zone: 'C',
//     lastInspection: '2023-06-05',
//     cover_status: 'open',
//     overflow_level: 'moderate',
//     connections: ['4', '6'],
//   },
//   {
//     id: '6',
//     code: 'MH-006',
//     location: {
//       type: 'Point',
//       coordinates: [38.760745, 9.029512],
//     },
//     elevation: 2375,
//     status: 'functional',
//     zone: 'C',
//     lastInspection: '2023-06-07',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['5', '7'],
//   },
//   {
//     id: '7',
//     code: 'MH-007',
//     location: {
//       type: 'Point',
//       coordinates: [38.761128, 9.029201],
//     },
//     elevation: 2370,
//     status: 'damaged',
//     zone: 'C',
//     lastInspection: '2023-05-10',
//     cover_status: 'open',
//     overflow_level: 'risk',
//     connections: ['6', '8'],
//   },
//   {
//     id: '8',
//     code: 'MH-008',
//     location: {
//       type: 'Point',
//       coordinates: [38.761602, 9.028843],
//     },
//     elevation: 2365,
//     status: 'functional',
//     zone: 'D',
//     lastInspection: '2023-06-03',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['7', '9'],
//   },
//   {
//     id: '9',
//     code: 'MH-009',
//     location: {
//       type: 'Point',
//       coordinates: [38.762015, 9.028512],
//     },
//     elevation: 2360,
//     status: 'overflowing',
//     zone: 'D',
//     lastInspection: '2023-06-01',
//     cover_status: 'open',
//     overflow_level: 'overflow',
//     connections: ['8', '10'],
//   },
//   {
//     id: '10',
//     code: 'MH-010',
//     location: {
//       type: 'Point',
//       coordinates: [38.762502, 9.028156],
//     },
//     elevation: 2355,
//     status: 'functional',
//     zone: 'D',
//     lastInspection: '2023-06-08',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['9'],
//   }, // Near 5 Kilo (Ethio-China Rd)

//   // === Branch Road 1 (Towards Arat Kilo) ===
//   {
//     id: '11',
//     code: 'MH-011',
//     location: {
//       type: 'Point',
//       coordinates: [38.759215, 9.031012],
//     },
//     elevation: 2395,
//     status: 'functional',
//     zone: 'A',
//     lastInspection: '2023-06-10',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['2', '12'],
//   },
//   {
//     id: '12',
//     code: 'MH-012',
//     location: {
//       type: 'Point',
//       coordinates: [38.759512, 9.031645],
//     },
//     elevation: 2390,
//     status: 'damaged',
//     zone: 'B',
//     lastInspection: '2023-05-15',
//     cover_status: 'open',
//     overflow_level: 'risk',
//     connections: ['11'],
//   },

//   // === Branch Road 2 (Towards Sidist Kilo) ===
//   {
//     id: '13',
//     code: 'MH-013',
//     location: {
//       type: 'Point',
//       coordinates: [38.760512, 9.030301],
//     },
//     elevation: 2380,
//     status: 'under_maintenance',
//     zone: 'C',
//     lastInspection: '2023-06-02',
//     cover_status: 'open',
//     overflow_level: 'moderate',
//     connections: ['4', '14'],
//   },
//   {
//     id: '14',
//     code: 'MH-014',
//     location: {
//       type: 'Point',
//       coordinates: [38.760845, 9.030912],
//     },
//     elevation: 2375,
//     status: 'functional',
//     zone: 'C',
//     lastInspection: '2023-06-03',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['13'],
//   },

//   // === Branch Road 3 (Small side road near 5 Kilo) ===
//   {
//     id: '15',
//     code: 'MH-015',
//     location: {
//       type: 'Point',
//       coordinates: [38.761098, 9.029751],
//     },
//     elevation: 2370,
//     status: 'damaged',
//     zone: 'D',
//     lastInspection: '2023-05-10',
//     cover_status: 'open',
//     overflow_level: 'risk',
//     connections: ['16'],
//   },
//   {
//     id: '16',
//     code: 'MH-016',
//     location: {
//       type: 'Point',
//       coordinates: [38.761412, 9.029432],
//     },
//     elevation: 2365,
//     status: 'functional',
//     zone: 'D',
//     lastInspection: '2023-06-07',
//     cover_status: 'closed',
//     overflow_level: 'good',
//     connections: ['15'],
//   },
//   // Additional data can be added as necessary
// ];

// await Manholes.insertMany(mockManholes)
//   .then(() => {
//     console.log('Mock data inserted successfully');
//   })
//   .catch((error) => {
//     console.error('Error inserting mock data:', error);
//   });

//insert many data to sendors.model

// const manholes = [
//   {
//     manholeId: '1',
//     name: 'Manhole #12',
//     location: { lat: 9.0123, lng: 38.7894 },
//     timestamp: '2025-04-30T08:15:00Z',
//     sensors: {
//       sewageLevel: 85, // cm
//       methaneLevel: 300, // ppm
//       flowRate: 15.5, // L/s
//       temperature: 24.5, // °C
//       humidity: 65, // %
//       batteryLevel: 78, // %
//     },
//     thresholds: {
//       maxDistance: 90, // cm (overflow threshold)
//       maxGas: 1000, // ppm
//       minFlow: 5, // L/s (blockage threshold)
//     },
//     lastCalibration: '2025-04-15T00:00:00Z',
//     batteryLevel: 78,
//     status: 'critical',
//     alertTypes: ['sewage_high', 'low_battery', 'bloackage'],
//   },
//   {
//     manholeId: '2',
//     name: 'Manhole #07',
//     location: { lat: 9.0156, lng: 38.7912 },
//     timestamp: '2025-04-30T07:30:00Z',
//     sensors: {
//       sewageLevel: 45,
//       methaneLevel: 1200, // Above threshold
//       flowRate: 12.1,
//       batteryLevel: 65,
//       temperature: 22.0,
//     },
//     thresholds: {
//       maxDistance: 95,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-10T00:00:00Z',
//     batteryLevel: 65,
//     status: 'critical',
//     alertTypes: ['gas_leak'],
//   },
//   {
//     manholeId: '3',
//     name: 'Manhole #23',
//     location: { lat: 9.0142, lng: 38.7931 },
//     timestamp: '2025-04-29T16:45:00Z',
//     sensors: {
//       sewageLevel: 35,
//       methaneLevel: 250,
//       flowRate: 3.8, // Below threshold
//       temperature: 26.2,
//       humidity: 70,
//       batteryLevel: 92,
//     },
//     thresholds: {
//       maxDistance: 85,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-18T00:00:00Z',
//     batteryLevel: 92,
//     status: 'critical',
//     alertTypes: ['blockage'],
//   },
// ];

// await sensorModel
//   .insertMany(manholes)
//   .then(() => {
//     console.log('Mock sensor data inserted successfully');
//   })
//   .catch((error) => {
//     console.error('Error inserting mock sensor data:', error);
//   });
