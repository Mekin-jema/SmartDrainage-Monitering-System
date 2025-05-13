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
<<<<<<< HEAD
=======

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

//     alertTypes: ['blockage'],
//   },
//   {
//     manholeId: '4',
//     name: 'Manhole #04',
//     location: { lat: 9.0168, lng: 38.795 },
//     timestamp: '2025-05-01T09:20:00Z',
//     sensors: {
//       sewageLevel: 60,
//       methaneLevel: 800,
//       flowRate: 6.5,
//       temperature: 25.2,
//       humidity: 55,
//       batteryLevel: 88,
//     },
//     thresholds: {
//       maxDistance: 85,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-20T00:00:00Z',
//     batteryLevel: 88,
//     alertTypes: [],
//   },
//   {
//     manholeId: '5',
//     name: 'Manhole #09',
//     location: { lat: 9.0182, lng: 38.7971 },
//     timestamp: '2025-05-01T10:10:00Z',
//     sensors: {
//       sewageLevel: 95,
//       methaneLevel: 1500,
//       flowRate: 2.4,
//       temperature: 23.4,
//       humidity: 60,
//       batteryLevel: 60,
//     },
//     thresholds: {
//       maxDistance: 90,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-22T00:00:00Z',
//     batteryLevel: 60,

//     alertTypes: ['sewage_high', 'gas_leak', 'blockage', 'low_battery'],
//   },
//   {
//     manholeId: '6',
//     name: 'Manhole #15',
//     location: { lat: 9.0195, lng: 38.7922 },
//     timestamp: '2025-04-30T11:05:00Z',
//     sensors: {
//       sewageLevel: 40,
//       methaneLevel: 400,
//       flowRate: 10.8,
//       temperature: 21.9,
//       humidity: 50,
//       batteryLevel: 95,
//     },
//     thresholds: {
//       maxDistance: 95,
//       maxGas: 1000,
//       minFlow: 5,
//     },
//     lastCalibration: '2025-04-19T00:00:00Z',
//     batteryLevel: 95,
//     alertTypes: [],
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
>>>>>>> 4d524a53fa9bc7a6b9f9279341d793f851a089a4
