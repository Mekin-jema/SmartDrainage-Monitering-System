import express from "express";
import mqtt from "mqtt";
import db from "../configure/db.confige.js";
import router from "../routes/index.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import Manholes from "../models/manhole.model.js";
import sensorModel from "../models/sensor.model.js";
import { format } from "date-fns"; // Import format from date-fns

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

// Store live sensor data
const sensorData = [];

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("message", "Welcome to the WebSocket server!");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// MQTT Configuration
const MQTT_BROKER_URL =
  process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com";
const MQTT_TOPIC = process.env.MQTT_TOPIC || "drainage/sensor-data";

const mqttOptions = {
  clientId: `nodejs-server_${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};
const mockData = [];

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

// Handle incoming MQTT messages
mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Format timestamp using date-fns
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss"); // Customize this as needed

    const timestampedData = {
      ...data,
      timestamp, // Using the custom formatted timestamp
    };
    mockData.push(timestampedData);
    io.emit("sensorData", mockData);

    // console.log("Received sensor data:", mockData);
  } catch (error) {
    console.error("Error processing MQTT message:", error.message);
  }
});

// Optional: Emit mock data every 5 seconds (useful for testing frontend without MQTT)
// Basic route
app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/v1", router);

// Handle exit
process.on("SIGINT", () => {
  mqttClient.end();
  process.exit(0);
});

// Start server
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
