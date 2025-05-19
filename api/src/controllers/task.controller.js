import taskModel from "../models/task.model.js";


export const getTaskOverviewWithList = async (req, res) => {
  try {


    // Task list data
    const taskList = await taskModel.find().select(
      'code description status priority location assignedDate dueDate progress assignedTo'
    ).sort({ dueDate: 1 }); // Optional: sort by due date

    res.status(200).json({
      success: true,
      data: {
 
        tasks: taskList
      }
    });
  } catch (error) {
    console.error('Error fetching task overview and list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task data'
    });
  }
};
