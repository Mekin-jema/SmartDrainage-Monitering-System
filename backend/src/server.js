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

// accessible to anywhere
app.set('io', io);

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

// const mockData = [
//   {
//     manholeId: '7',
//     timestamp: '2025-05-01T08:30:00.000+00:00',
//     sensors: {
//       sewageLevel: 65,
//       methaneLevel: 920,
//       flowRate: 9.1,
//       temperature: 23.4,
//       humidity: 60,
//       batteryLevel: 80,
//     },
//     thresholds: {
//       maxDistance: 90,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-16T00:00:00.000+00:00',
//     alertTypes: [],
//   },
//   {
//     manholeId: '8',
//     timestamp: '2025-05-01T09:15:00.000+00:00',
//     sensors: {
//       sewageLevel: 92,
//       methaneLevel: 1200,
//       flowRate: 3.4,
//       temperature: 25.1,
//       humidity: 75,
//       batteryLevel: 52,
//     },
//     thresholds: {
//       maxDistance: 85,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-12T00:00:00.000+00:00',
//     alertTypes: ['sewage_high', 'gas_leak', 'low_battery'],
//   },
//   {
//     manholeId: '9',
//     timestamp: '2025-05-01T10:00:00.000+00:00',
//     sensors: {
//       sewageLevel: 108,
//       methaneLevel: 710,
//       flowRate: 3.0,
//       temperature: 21.8,
//       humidity: 55,
//       batteryLevel: 74,
//     },
//     thresholds: {
//       maxDistance: 90,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-14T00:00:00.000+00:00',
//     alertTypes: ['blockage'],
//   },
//   {
//     manholeId: '10',
//     timestamp: '2025-05-01T10:45:00.000+00:00',
//     sensors: {
//       sewageLevel: 705,
//       methaneLevel: 850,
//       flowRate: 6.7,
//       temperature: 290.9,
//       humidity: 67,
//       batteryLevel: 91,
//     },
//     thresholds: {
//       maxDistance: 85,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-18T00:00:00.000+00:00',
//     alertTypes: [],
//   },
//   {
//     manholeId: '11',
//     timestamp: '2025-05-01T11:30:00.000+00:00',
//     sensors: {
//       sewageLevel: 58,
//       methaneLevel: 970,
//       flowRate: 8.3,
//       temperature: 23.7,
//       humidity: 62,
//       batteryLevel: 66,
//     },
//     thresholds: {
//       maxDistance: 90,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-20T00:00:00.000+00:00',
//     alertTypes: ['gas_leak'],
//   },
//   {
//     manholeId: '12',
//     timestamp: '2025-05-01T12:15:00.000+00:00',
//     sensors: {
//       sewageLevel: 400,
//       methaneLevel: 280,
//       flowRate: 9.5,
//       temperature: 24.6,
//       humidity: 58,
//       batteryLevel: 88,
//     },
//     thresholds: {
//       maxDistance: 95,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-22T00:00:00.000+00:00',
//     alertTypes: [],
//   },
// ];
// await sensorModel
//   .insertMany(mockData, { ordered: false })
//   .then((result) => {
//     console.log('Mock data inserted successfully:', result);
//   })
//   .catch((error) => {
//     console.error('Error inserting mock data:', error);
//   });
