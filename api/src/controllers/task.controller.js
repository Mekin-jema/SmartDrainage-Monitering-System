import mongoose from "mongoose";
import taskModel from "../models/task.model.js";

export const getTaskOverviewWithList = async (req, res) => {
  try {
    // Task list data
    const taskList = await taskModel
      .find()
      .select(
        "code description status priority location assignedDate dueDate progress assignedTo"
      )
      .sort({ dueDate: 1 }); // Optional: sort by due date

    res.status(200).json({
      success: true,
      data: {
        tasks: taskList,
      },
    });
  } catch (error) {
    console.error("Error fetching task overview and list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve task data",
    });
  }
};

// Helper function to generate unique task code
const generateTaskCode = async () => {
  const prefix = "TASK-";
  const count = await Task.countDocuments();
  return `${prefix}${(count + 1).toString().padStart(4, "0")}`;
};

export const createTask = async (req, res) => {
  try {
    // Destructure required fields from request body
    const {
      description,
      status = "pending",
      priority = "medium",
      location,
      assignedDate,
      dueDate,
      progress = 0,
      assignedTo,
    } = req.body;

    // Validate required fields
    if (!description || !location || !assignedDate || !dueDate || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        requiredFields: [
          "description",
          "location",
          "assignedDate",
          "dueDate",
          "assignedTo",
        ],
      });
    }

    // Validate dates
    const assignedDateObj = new Date(assignedDate);
    const dueDateObj = new Date(dueDate);

    if (assignedDateObj > dueDateObj) {
      return res.status(400).json({
        success: false,
        message: "Due date must be after assigned date",
      });
    }

    // Validate progress range
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    // Validate assignedTo is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Generate unique task code
    const code = await generateTaskCode();

    // Create new task
    const newTask = new taskModel({
      code,
      description,
      status,
      priority,
      location,
      assignedDate: assignedDateObj,
      dueDate: dueDateObj,
      progress,
      assignedTo,
    });

    // Save the task
    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        id: savedTask._id,
        code: savedTask.code,
        description: savedTask.description,
        status: savedTask.status,
        priority: savedTask.priority,
        location: savedTask.location,
        assignedDate: savedTask.assignedDate,
        dueDate: savedTask.dueDate,
        progress: savedTask.progress,
        assignedTo: savedTask.assignedTo,
        createdAt: savedTask.createdAt,
        updatedAt: savedTask.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating task:", error);

    // Handle duplicate key error (code)
    if (error.code === 11000 && error.keyPattern?.code) {
      return res.status(409).json({
        success: false,
        message: "Task with this code already exists",
        field: "code",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
