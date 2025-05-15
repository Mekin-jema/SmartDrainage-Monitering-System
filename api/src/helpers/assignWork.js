import Alert  from '../models/alert.model.js';
// 2. Assign Worker to Alert (Automatic or Manual)
const assignWorkerToAlert = async (alertId, workerId = null) => {
  try {
    const alert = await Alert.findById(alertId);
    if (!alert) throw new Error('Alert not found');

    // If no worker specified, find available worker
    let workerToAssign;
    if (!workerId) {
      workerToAssign = await User.findOne({
        role: 'worker',
        'status.availability': 'available'
      }).sort({ 'status.lastActive': -1 });
    } else {
      workerToAssign = await User.findById(workerId);
    }

    if (!workerToAssign) {
      throw new Error('No available workers found');
    }

    // Update alert
    alert.assignedWorkerId = workerToAssign._id;
    alert.status = 'assigned';
    alert.actions.push({
      workerId: workerToAssign._id,
      action: 'assigned',
      timestamp: new Date(),
      notes: `Alert assigned to ${workerToAssign.name}`
    });

    // Update worker status
    workerToAssign.status.availability = 'busy';
    workerToAssign.assignments.push({
      manholeId: alert.manholeId,
      task: `Address ${alert.alertType} alert`,
      date: new Date()
    });

    await Promise.all([alert.save(), workerToAssign.save()]);

    return {
      success: true,
      message: 'Worker assigned successfully',
      alert,
      worker: workerToAssign
    };

  } catch (error) {
    console.error('Assign worker error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

export default assignWorkerToAlert