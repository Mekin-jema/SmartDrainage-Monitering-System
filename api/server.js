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
import maintenanceModel from "./src/models/maintenance.model.js";
import taskModel from "./src/models/task.model.js";
import manholeModel from "./src/models/manhole.model.js";
import getAllManholes from "./src/helpers/getManholesData.js";
// import manholeModel from "./src/models/manhole.model.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
// Enhanced CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Socket.IO Setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// MQTT Client Setup
const mqttClient = mqtt.connect(
  process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com",
  {
    clientId: `server_${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
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

mqttClient.on("message", async (topic, message) => {
  try {
    if (topic === (process.env.MQTT_TOPIC || "drainage/sensor-data")) {
      const data = {
        ...JSON.parse(message.toString()),
      };

      // Update cache
      sensorDataCache.push(data);
      if (sensorDataCache.length > MAX_CACHE_SIZE) {
        sensorDataCache.shift();
      }

      // Broadcast to all clients
      await createReading(data); // Save to DB
      // const result = await getAllSensorReadings();
      const result = await getLatestReading();
      io.emit("sensorData", result);

      //
      const latestManholeData = await getAllManholes();
      if (latestManholeData.success) {
        io.emit("manholeData", latestManholeData);
      }
    }
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
    clients: io.engine.clientsCount,
  });
});

// Start Server
httpServer.listen(port, () => {
  db();
  console.log(`Server running on port ${port}`);
  console.log(`WebSocket available on ws://localhost:${port}`);
});

const data = [
  {
    id: "1",
    code: "MH-001",
    elevation: 2400,
    location: {
      type: "Point",
      coordinates: [38.76143, 9.043133],
    },
    zone: "A",
    status: "functional",
    lastInspection: "2023-05-15",
    cover_status: "closed",
    overflow_level: "good",
    connections: ["2"],
  },
  {
    id: "2",
    code: "MH-002",
    elevation: 2395,
    location: {
      type: "Point",
      coordinates: [38.76177, 9.04153],
    },
    zone: "A",
    status: "critical",
    lastInspection: "2023-04-20",
    cover_status: "open",
    overflow_level: "risk",
    connections: ["3"],
  },
  {
    id: "3",
    code: "MH-003",
    elevation: 2390,
    location: {
      type: "Point",
      coordinates: [38.762154, 9.040072],
    },
    zone: "A",
    status: "overflowing",
    lastInspection: "2023-06-01",
    cover_status: "closed",
    overflow_level: "overflow",
    connections: ["4"],
  },
  {
    id: "4",
    code: "MH-004",
    elevation: 2385,
    location: {
      type: "Point",
      coordinates: [38.762508, 9.038484],
    },
    zone: "A",
    status: "functional",
    lastInspection: "2023-05-25",
    cover_status: "closed",
    overflow_level: "good",
    connections: ["5", "6", "8"],
  },
  {
    id: "5",
    code: "MH-005",
    elevation: 2380,
    location: {
      type: "Point",
      coordinates: [38.761106, 9.037434],
    },
    zone: "B",
    status: "warning",
    lastInspection: "2023-06-05",
    cover_status: "open",
    overflow_level: "moderate",
    connections: ["7"],
  },
  {
    id: "9",
    code: "MH-009",
    elevation: 2375,
    location: {
      type: "Point",
      coordinates: [38.762951, 9.036137],
    },
    zone: "A",
    status: "functional",
    lastInspection: "2023-06-07",
    cover_status: "closed",
    overflow_level: "good",
    connections: ["10"],
  },
  {
    id: "7",
    code: "MH-007",
    elevation: 2370,
    location: {
      type: "Point",
      coordinates: [38.759375, 9.036599],
    },
    zone: "B",
    status: "critical",
    lastInspection: "2023-05-10",
    cover_status: "open",
    overflow_level: "risk",
    connections: [""],
  },
  {
    id: "8",
    code: "MH-008",
    elevation: 2365,
    location: {
      type: "Point",
      coordinates: [38.764006, 9.03789],
    },
    zone: "C",
    status: "functional",
    lastInspection: "2023-06-03",
    cover_status: "closed",
    overflow_level: "good",
    connections: [""],
  },
  {
    id: "6",
    code: "MH-006",
    elevation: 2360,
    location: {
      type: "Point",
      coordinates: [38.762809, 9.037224],
    },
    zone: "D",
    status: "overflowing",
    lastInspection: "2023-06-01",
    cover_status: "open",
    overflow_level: "overflow",
    connections: ["9"],
  },
  {
    id: "11",
    code: "MH-011",
    elevation: 2395,
    location: {
      type: "Point",
      coordinates: [38.763048, 9.035362],
    },
    zone: "A",
    status: "functional",
    lastInspection: "2023-06-10",
    cover_status: "closed",
    overflow_level: "good",
    connections: ["12"],
  },
  {
    id: "12",
    code: "MH-012",
    elevation: 2390,
    location: {
      type: "Point",
      coordinates: [38.763153, 9.034616],
    },
    zone: "B",
    status: "critical",
    lastInspection: "2023-05-15",
    cover_status: "open",
    overflow_level: "risk",
    connections: ["13"],
  },
  {
    id: "13",
    code: "MH-013",
    elevation: 2380,
    location: {
      type: "Point",
      coordinates: [38.762563, 9.033234],
    },
    zone: "C",
    status: "warning",
    lastInspection: "2023-06-02",
    cover_status: "open",
    overflow_level: "moderate",
    connections: ["14"],
  },
  {
    id: "14",
    code: "MH-014",
    elevation: 2375,
    location: {
      type: "Point",
      coordinates: [38.764492, 9.03237],
    },
    zone: "C",
    status: "functional",
    lastInspection: "2023-06-03",
    cover_status: "closed",
    overflow_level: "good",
    connections: [""],
  },
  {
    id: "10",
    code: "MH-010",
    elevation: 2370,
    location: {
      type: "Point",
      coordinates: [38.762987, 9.035571],
    },
    zone: "D",
    status: "critical",
    lastInspection: "2023-05-10",
    cover_status: "open",
    overflow_level: "risk",
    connections: ["11"],
  },
];

const mockMaintenanceLogs = [
  {
    manholeId: "6829b797fd147734102d3c18", // MH-001
    code: "MH-001",
    userId: "6829007cc84f9ff55d7e3beb", // mek1234@gmail.com (worker)
    type: "emergency",
    description: "Emergency repair due to structural damage",
    status: "completed",
    scheduledDate: new Date("2025-05-01"),
    actualStart: new Date("2025-05-01T08:30:00"),
    actualEnd: new Date("2025-05-01T10:45:00"),
    partsReplaced: [
      { name: "Concrete Seal", quantity: 2 },
      { name: "Reinforcement Bars", quantity: 4 },
    ],
    notes:
      "Found significant cracks in the chamber walls. Required immediate repair.",
  },
  {
    manholeId: "6829b798fd147734102d3c1e", // MH-007
    code: "MH-007",
    userId: "6826e38d3b3a9f810d65918d", // john11@email.com (worker)
    type: "routine",
    description: "Monthly inspection and cleaning",
    status: "in_progress",
    scheduledDate: new Date("2025-05-02"),
    actualStart: new Date("2025-05-02T09:00:00"),
    partsReplaced: [],
    notes: "Standard cleaning in progress. Found minor debris buildup.",
  },
  {
    manholeId: "6829b798fd147734102d3c22", // MH-012
    code: "MH-012",
    userId: "6826ddaf00caa12139ffb3a1", // jem@gmail.com (worker)
    type: "preventive",
    description: "Gas detection system maintenance",
    status: "completed",
    scheduledDate: new Date("2025-04-25"),
    actualStart: new Date("2025-04-25T07:00:00"),
    actualEnd: new Date("2025-04-25T09:30:00"),
    partsReplaced: [
      { name: "Methane Sensor", quantity: 1 },
      { name: "Battery Pack", quantity: 2 },
    ],
    notes: "Calibrated all sensors and replaced aging components.",
  },
  {
    manholeId: "6829b798fd147734102d3c1d", // MH-009
    code: "MH-009",
    userId: "6829007cc84f9ff55d7e3beb", // mek1234@gmail.com (worker)
    type: "emergency",
    description: "Flooding emergency response",
    status: "scheduled",
    scheduledDate: new Date("2025-05-05"),
    partsReplaced: [],
    notes: "Reported by neighborhood residents. Requires pump truck.",
  },
  {
    manholeId: "6829b797fd147734102d3c1a", // MH-003
    code: "MH-003",
    userId: "6826f013602c88dc0c672fc5", // ali@gmail.com (worker)
    type: "routine",
    description: "Structural integrity check",
    status: "pending",
    scheduledDate: new Date("2025-05-10"),
    partsReplaced: [],
    notes: "Part of quarterly inspection cycle",
  },
  {
    manholeId: "6829b798fd147734102d3c25", // MH-015
    code: "MH-015",
    userId: "6826e38d3b3a9f810d65918d", // john11@email.com (worker)
    type: "preventive",
    description: "Valve system overhaul",
    status: "in_progress",
    scheduledDate: new Date("2025-05-03"),
    actualStart: new Date("2025-05-03T08:15:00"),
    partsReplaced: [
      { name: "Control Valve", quantity: 1 },
      { name: "Pressure Gauge", quantity: 1 },
    ],
    notes: "Upgrading to new valve model for better flow control",
  },
  {
    manholeId: "6829b797fd147734102d3c18", // MH-001
    code: "MH-001",
    userId: "68265ed390ae650ffdb5234f", // john1234@email.com (worker)
    type: "emergency",
    description: "Cracked lid replacement",
    status: "completed",
    scheduledDate: new Date("2025-04-28"),
    actualStart: new Date("2025-04-28T06:00:00"),
    actualEnd: new Date("2025-04-28T08:30:00"),
    partsReplaced: [
      { name: "Manhole Cover", quantity: 1 },
      { name: "Sealing Compound", quantity: 1 },
    ],
    notes: "Replaced damaged 24-inch cover with new composite model",
  },
  {
    manholeId: "6829b798fd147734102d3c1c", // MH-005
    code: "MH-005",
    userId: "6826ddaf00caa12139ffb3a1", // jem@gmail.com (worker)
    type: "routine",
    description: "Debris removal and pipe inspection",
    status: "completed",
    scheduledDate: new Date("2025-04-30"),
    actualStart: new Date("2025-04-30T10:00:00"),
    actualEnd: new Date("2025-04-30T12:30:00"),
    partsReplaced: [],
    notes: "Removed 15kg of sediment. Pipes in good condition.",
  },
  {
    manholeId: "6829b798fd147734102d3c24", // MH-014 (Note: Original was MH-018 which doesn't exist, using closest available)
    code: "MH-018",
    userId: "6826f013602c88dc0c672fc5", // ali@gmail.com (worker)
    type: "preventive",
    description: "Pump motor maintenance",
    status: "scheduled",
    scheduledDate: new Date("2025-05-15"),
    partsReplaced: [],
    notes: "Annual pump service scheduled",
  },
  {
    manholeId: "6829b798fd147734102d3c21", // MH-011 (Note: Original was MH-022 which doesn't exist, using closest available)
    code: "MH-022",
    userId: "68265ed390ae650ffdb5234f", // john1234@email.com (worker)
    type: "emergency",
    description: "Sewage backup clearance",
    status: "completed",
    scheduledDate: new Date("2025-04-27"),
    actualStart: new Date("2025-04-27T14:00:00"),
    actualEnd: new Date("2025-04-27T17:45:00"),
    partsReplaced: [{ name: "Pipe Seal", quantity: 3 }],
    notes: "Major blockage cleared. Found roots infiltrating pipe.",
  },
];

// maintenanceModel.insertMany(mockMaintenanceLogs)
//   .then(() => {
//     console.log("Mock data inserted successfully");
//   })
//   .catch((error) => {
//     console.error("Error inserting mock data:", error);
//   });

// manholeModel
//   .insertMany(data)
//   .then(() => {
//     console.log("Data inserted successfully");
//   })
//   .catch((error) => {
//     console.error("Error inserting data:", error);
//   });

const mockTasks = [
  {
    code: "MH-101",
    description: "Inspect and clean the drainage system",
    status: "pending",
    priority: "high",
    location: "Addis Ketema, Sector 3",
    assignedDate: "2025-05-10",
    dueDate: "2025-05-15",
    progress: 0,
    assignedTo: "68230e5633d1f39f8414aba5", // user-1
  },
  {
    code: "MH-202",
    description: "Report overflow and check gas levels",
    status: "in-progress",
    priority: "medium",
    location: "Kirkos Sub-city, Zone B",
    assignedDate: "2025-05-11",
    dueDate: "2025-05-16",
    progress: 45,
    assignedTo: "68230e5633d1f39f8414aba5", // user-1
  },
  {
    code: "MH-303",
    description: "Routine maintenance check and seal cracks",
    status: "completed",
    priority: "low",
    location: "Bole Michael, Block D",
    assignedDate: "2025-05-12",
    dueDate: "2025-05-14",
    progress: 100,
    assignedTo: "682656c9674b0bc0820a6759", // user-2
  },
  {
    code: "MH-404",
    description: "Install new sensors and test functionality",
    status: "in-progress",
    priority: "high",
    location: "Yeka Sub-city, Zone 4",
    assignedDate: "2025-05-13",
    dueDate: "2025-05-18",
    progress: 30,
    assignedTo: "6826572d674b0bc0820a675d", // user-3
  },
  {
    code: "MH-505",
    description: "Clear debris from main drainage line",
    status: "pending",
    priority: "medium",
    location: "Lideta Sub-city, Block A",
    assignedDate: "2025-05-14",
    dueDate: "2025-05-20",
    progress: 0,
    assignedTo: "68230e5633d1f39f8414aba5", // user-1 again
  },
];

// taskModel.insertMany(mockTasks)
//   .then(() => {
//     console.log("Mock tasks inserted successfully");
//   })
//   .catch((error) => {
//     console.error("Error inserting mock tasks:", error);

//   });
