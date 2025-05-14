import express from "express";
import mqtt from "mqtt";
import db from "./src/configure/db.confige.js";
import router from "./src/routes/index.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const sensorData = []; // Array to store received sensor data
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const senserReadings = [
  {
    header: "Manhole ID",
    accessorKey: "manholeId",
  },
  {
    header: "Sewage Level (cm)",
    accessorKey: "sensors.sewageLevel",
    cell: ({ row }) => row.original.sensors.sewageLevel,
  },
]; // Array to store sensor readings

// Enhanced CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Socket.IO server with proper CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  allowEIO3: true,
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  // Send current data to newly connected client
  socket.emit("sensorData ", senserReadings);
  socket.emit("message", "Welcome to the WebSocket server!");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
io.emit("sensorData ", senserReadings);

const MQTT_BROKER_URL =
  process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com";
const MQTT_TOPIC = process.env.MQTT_TOPIC || "drainage/sensor-data";

const mqttOptions = {
  clientId: `nodejs-server_${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

const mqttClient = mqtt.connect(MQTT_BROKER_URL, mqttOptions);

mqttClient.on("connect", () => {
  console.log(`MQTT Connected to: ${MQTT_BROKER_URL}`);
  mqttClient.subscribe(MQTT_TOPIC, { qos: 1 }, (err) => {
    if (err) console.error("MQTT Subscribe Error:", err);
    else console.log(`Subscribed to Topic: "${MQTT_TOPIC}"`);
  });
});

mqttClient.on("error", (err) => console.error("MQTT Connection Error:", err));
mqttClient.on("close", () => console.log("MQTT Connection Closed"));
mqttClient.on("reconnect", () => console.log("MQTT Reconnecting..."));

mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Add timestamp to the received data
    const timestampedData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // Store the data in array
    sensorData.push(timestampedData);
    if (sensorData.length > 1000) sensorData.shift(); // Limit array size

    // Broadcast to all connected clients
    io.emit("sensorData", timestampedData);

    console.log("Received sensor data:", timestampedData);
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

// Graceful shutdown
process.on("SIGINT", () => {
  mqttClient.end();
  console.log("MQTT client disconnected");
  process.exit(0);
});

// Database connection and server startup
(async () => {
  try {
    await db();
    httpServer.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
