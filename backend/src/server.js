import express from 'express';
import mqtt from 'mqtt';
import db from './configure/db.confige.js';
import SensorReading from './models/sensor.model.js'; // Renamed from Sensor to SensorReading
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// MQTT Configuration
const mqttBroker = 'mqtt://localhost:1883'; // Change to your broker URL
// const mqttBroker = 'mqtt://broker.hivemq.com';
const topic = 'drainage/sensor-data';

const client = mqtt.connect(mqttBroker);

client.on('connect', () => {
  console.log('Connected to HiveMQ Broker');
  client.subscribe(topic);
});

client.on('message', async (topic, message) => {
  try {
    const rawData = JSON.parse(message.toString());
    
    // Transform incoming data to match SensorReading schema
    const sensorData = {
      manholeId: new mongoose.Types.ObjectId(), // Generate new ID or get from ESP32
      sensors: {
        sewageLevel: rawData.water || 0,          // Map 'water' to 'sewageLevel'
        methaneLevel: rawData.methane || 0,       // Keep methane
        flowRate: rawData.flowRate || 0,          // Add defaults if missing
        temperature: rawData.temperature || 25,
        humidity: rawData.humidity || 50,
        batteryLevel: rawData.battery || 100      // Assuming 'battery' field
      },
      thresholds: {
        maxDistance: 100,                         // Default values
        maxGas: 500,
        minFlow: 10
      },
      status: calculateStatus(rawData),           // Custom function
      alertTypes: getAlertTypes(rawData)          // Custom function
    };

    await SensorReading.create(sensorData);
    console.log('Data saved:', sensorData);

  } catch (error) {
    console.error('Error processing MQTT data:', error);
  }
});

// Helper: Determine status based on sensor values
function calculateStatus(data) {
  if (data.methane > 500 || data.water > 90) return 'critical';
  if (data.methane > 300 || data.water > 70) return 'warning';
  return 'normal';
}

// Helper: Identify alert types
function getAlertTypes(data) {
  const alerts = [];
  if (data.methane > 500) alerts.push('methane_overflow');
  if (data.water > 90) alerts.push('sewage_flooding');
  if (data.battery < 20) alerts.push('low_battery');
  return alerts;
}

app.use(express.json());
app.use(cors({ origin: '*' }));

(async () => {
  await db();
  app.listen(port, () => {
    console.log(`Server running on port ${port} `);
  });
})();