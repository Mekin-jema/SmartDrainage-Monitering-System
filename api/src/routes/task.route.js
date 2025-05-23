import express from "express";
import {
  createTask,
  getTaskOverviewWithList,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/get-task-overview", getTaskOverviewWithList);

router.post("/create-task", createTask);

export default router;
