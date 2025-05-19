import express from 'express';  
import { getTaskOverviewWithList } from '../controllers/task.controller.js';



const router = express.Router();


router.get('/get-task-overview',getTaskOverviewWithList)

export default router;