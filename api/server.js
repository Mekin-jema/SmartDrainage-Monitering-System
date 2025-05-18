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
import manholeModel from "./src/models/manhole.model.js";
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


const  data = [
  {
    "id": "1",
    "code": "MH-001",
    "elevation": 2400,
    "location": {
      "type": "Point",
      "coordinates": [38.761430, 9.043133],
      "zone": "A"
    },
    "status": "functional",
    "lastInspection": "2023-05-15",
    "cover_status": "closed",
    "overflow_level": "good",
    "connections": ["2"]
  },
  {
    "id": "2",
    "code": "MH-002",
    "elevation": 2395,
    "location": {
      "type": "Point",
      "coordinates": [38.761770, 9.041530],
      "zone": "A"
    },
    "status": "damaged",
    "lastInspection": "2023-04-20",
    "cover_status": "open",
    "overflow_level": "risk",
    "connections": [ "3"]
  },
  {
    "id": "3",
    "code": "MH-003",
    "elevation": 2390,
    "location": {
      "type": "Point",
      "coordinates": [38.762154, 9.040072],
      "zone": "A"
    },
    "status": "overflowing",
    "lastInspection": "2023-06-01",
    "cover_status": "closed",
    "overflow_level": "overflow",
    "connections": [ "4"]
  },
  {
    "id": "4",
    "code": "MH-004",
    "elevation": 2385,
    "location": {
      "type": "Point",
      "coordinates": [38.762508, 9.038484],
      "zone": "A"
    },
    "status": "functional",
    "lastInspection": "2023-05-25",
    "cover_status": "closed",
    "overflow_level": "good",
    "connections": ["5", "6", "8"]
  },
  {
    "id": "5",
    "code": "MH-005",
    "elevation": 2380,
    "location": {
      "type": "Point",
      "coordinates": [38.761106, 9.037434],
      "zone": "B"
    },
    "status": "under_maintenance",
    "lastInspection": "2023-06-05",
    "cover_status": "open",
    "overflow_level": "moderate",
    "connections": [  "7"]
  },
  {
    "id": "9",
    "code": "MH-009",
    "elevation": 2375,
    "location": {
      "type": "Point",
      "coordinates": [38.762951, 9.036137],
      "zone": "A"
    },
    "status": "functional",
    "lastInspection": "2023-06-07",
    "cover_status": "closed",
    "overflow_level": "good",
    "connections": ["11"]
  },
  {
    "id": "7",
    "code": "MH-007",
    "elevation": 2370,
    "location": {
      "type": "Point",
      "coordinates": [38.759375, 9.036599],
      "zone": "B"
    },
    "status": "damaged",
    "lastInspection": "2023-05-10",
    "cover_status": "open",
    "overflow_level": "risk",
    "connections": [ ""]
  },
  {
    "id": "8",
    "code": "MH-008",
    "elevation": 2365,
    "location": {
      "type": "Point",
      "coordinates": [38.764006, 9.037890],
      "zone": "C"
    },
    "status": "functional",
    "lastInspection": "2023-06-03",
    "cover_status": "closed",
    "overflow_level": "good",
    "connections": [""]
  },
  {
    "id": "6",
    "code": "MH-006",
    "elevation": 2360,
    "location": {
      "type": "Point",
      "coordinates": [38.762809, 9.037224],
      "zone": "D"
    },
    "status": "overflowing",
    "lastInspection": "2023-06-01",
    "cover_status": "open",
    "overflow_level": "overflow",
    "connections": [ "10","9"]
  },

  {
    "id": "11",
    "code": "MH-011",
    "elevation": 2395,
    "location": {
      "type": "Point",
      "coordinates": [38.763048, 9.035362],
      "zone": "A"
    },
    "status": "functional",
    "lastInspection": "2023-06-10",
    "cover_status": "closed",
    "overflow_level": "good",
    "connections": ["12"]
  },
  {
    "id": "12",
    "code": "MH-012",
    "elevation": 2390,
    "location": {
      "type": "Point",
      "coordinates": [38.763153, 9.034616],
      "zone": "B"
    },
    "status": "damaged",
    "lastInspection": "2023-05-15",
    "cover_status": "open",
    "overflow_level": "risk",
    "connections": [ "13"]
  },
  {
    "id": "13",
    "code": "MH-013",
    "elevation": 2380,
    "location": {
      "type": "Point",
      "coordinates": [38.762563, 9.033234],
      "zone": "C"
    },
    "status": "under_maintenance",
    "lastInspection": "2023-06-02",
    "cover_status": "open",
    "overflow_level": "moderate",
    "connections": ["14","15"]
  },
  {
    "id": "14",
    "code": "MH-014",
    "elevation": 2375,
    "location": {
      "type": "Point",
      "coordinates": [38.764492, 9.032370],
      "zone": "C"
    },
    "status": "functional",
    "lastInspection": "2023-06-03",
    "cover_status": "closed",
    "overflow_level": "good",
    "connections": [ "15"]
  },
  {
    "id": "15",
    "code": "MH-015",
    "elevation": 2370,
    "location": {
      "type": "Point",
      "coordinates": [38.763387, 9.032050],
      "zone": "D"
    },
    "status": "damaged",
    "lastInspection": "2023-05-10",
    "cover_status": "open",
    "overflow_level": "risk",
    "connections": [""]
  },

];

// manholeModel.insertMany(data)
//   .then(() => {
//     console.log("Data inserted successfully");
//   })
//   .catch((error) => {
//     console.error("Error inserting data:", error);
//   });