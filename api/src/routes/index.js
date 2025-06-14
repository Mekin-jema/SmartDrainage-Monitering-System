import { Router } from "express";
import sensorRoutes from "./sensor.route.js";
import manholeRouter from "./manhole.route.js";
import maintenanceRouter from "./maintenance.route.js";
import userRouter from "./user.route.js";
import alertRouter from "./alert.route.js";
import taskRouter from "./task.route.js"; // Example additional route
// import maintenanceRoutes from './maintenance.route.js'; // Example additional route
// import alertRoutes from './alert.route.js';           // Example additional route

const router = Router();

router.use("/auth", userRouter);
router.use("/sensors", sensorRoutes);
router.use("/manholes", manholeRouter);
router.use("/maintenances", maintenanceRouter);
router.use("/alerts", alertRouter);
router.use("/tasks", taskRouter); // Example additional route
export default router;
