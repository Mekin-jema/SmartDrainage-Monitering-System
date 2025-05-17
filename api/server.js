import express from "express";
import mqtt from "mqtt";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import router from "./src/routes/index.js";
import db from "./src/configure/db.confige.js";
import { createReading } from "./src/controllers/sensor.controller.js";
// import getAllSensorReadings from "./src/helpers/getAllSensorData.js";
import getLatestReading from "./src/helpers/getLatestReading.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
// Enhanced CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Socket.IO Setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// MQTT Client Setup
const mqttClient = mqtt.connect(
  process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com",
  {
    clientId: `server_${Math.random().toString(16).substr(2, 8)}`,
    clean: true
  }
);

// Data Storage
const sensorDataCache = [];
const MAX_CACHE_SIZE = 1000;

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("New client connected");
  
  // Send latest data on connect
  socket.emit("initialData", sensorDataCache.slice(-100)); // Last 100 readings
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// MQTT Events
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(
    process.env.MQTT_TOPIC || "drainage/sensor-data", 
    { qos: 1 },
    (err) => err && console.error("Subscribe error:", err)
  );
});

mqttClient.on("message", async(topic, message) => {
  try {
    const data = {
      ...JSON.parse(message.toString()),
      timestamp: new Date().toISOString()
    };

    // Update cache
    sensorDataCache.push(data);
    if (sensorDataCache.length > MAX_CACHE_SIZE) {
      sensorDataCache.shift();
    }

    // Broadcast to all clients
    await createReading(data); // Save to DB
    console.log("New sensor data:", data);
      // const result = await getAllSensorReadings();
      const result = await getLatestReading(data);
      io.emit("sensorData", (result));
      console.log("Latest sensor data:", result.data);
  
  } catch (error) {
    console.error("Message processing error:", error);
  }
});

// app.use(cors());

app.use("/api/v1", router);


// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    mqtt: mqttClient.connected ? "connected" : "disconnected",
    clients: io.engine.clientsCount
  });
});

// Start Server
httpServer.listen(port, () => {
  db()
  console.log(`Server running on port ${port}`);
  console.log(`WebSocket available on ws://localhost:${port}`);
});