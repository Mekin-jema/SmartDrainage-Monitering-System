import express from 'express';
import mqtt from 'mqtt';
import db from './configure/db.confige.js';
import Sensor from './models/sensor.model.js'; // Fixed from SensorReading to Sensor
import router from './routes/index.js';
import cors from 'cors';
const app = express();
const port = 3000;

// MQTT Configuration - Using local Mosquitto broker
const mqttBroker = 'mqtt://localhost'; // Changed to local Mosquitto
const topic = 'drainage/sensor-data';

// Connect to MQTT Broker
const client = mqtt.connect(mqttBroker);

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe(topic);
});

// Handle incoming MQTT messages
client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    
    await Sensor.create({
      deviceId: "ESP32_1", // You can make this dynamic if needed
      waterLevel: data.water,
      methaneLevel: data.methane,
      timestamp: new Date()
    });
    
    console.log('Data saved:', data);
  } catch (error) {
    console.error('Error processing MQTT data:', error);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', router);

// Start server
(async () => {
  await db();
  app.listen(port, () => { // Fixed syntax error (removed 'a')
    console.log(`Server and MQTT listener running on port ${port}`);
  });
})();