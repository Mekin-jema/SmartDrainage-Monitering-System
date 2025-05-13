import Manhole from '../models/manhole.model.js';

// Helper function to generate next id
const getNextManholeId = async () => {
  const manholes = await Manhole.find().sort({ id: -1 }).limit(1);
  const lastId = manholes[0]?.id || '0';
  return String(Number(lastId) + 1);
};

// Create a new manhole
const createManhole = async (req, res) => {
  try {
    const {
      code,
      location,
      elevation,
      zone,
      status,
      cover_status,
      overflow_level,
      connections,
      notes,
    } = req.body;

    if (!code || !location?.coordinates || !elevation) {
      return res.status(400).json({
        success: false,
        message: 'Code, location coordinates, and elevation are required',
      });
    }

    // Check if code already exists
    const existingCode = await Manhole.findOne({ code });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Manhole with this code already exists',
      });
    }

    const nextId = await getNextManholeId();

    const newManhole = new Manhole({
      id: nextId,
      code,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
      },
      elevation,
      zone,
      lastInspection: null,
      status: status || 'functional',
      cover_status: cover_status || 'closed',
      overflow_level: overflow_level || 'good',
      connections: connections || [],
      notes: notes || '',
    });

    await newManhole.save();

    // Transform to match mock data structure
    const responseData = {
      ...newManhole.toObject(),
      location: newManhole.location.coordinates,
    };

    return res.status(201).json({
      success: true,
      message: 'Manhole created successfully',
      data: {
        ...newManhole.toObject(),
        location: newManhole.location.coordinates,
      },
    });
  } catch (error) {
    console.error('Create manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all manholes
const getAllManholes = async (req, res) => {
  try {
    const manholes = await Manhole.find().lean();
    // console.log('Manholes:', manholes);

    if (manholes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No manholes found',
      });
    }

    const transformedManholes = manholes.map((manhole) => ({
      ...manhole,
      location: manhole.location.coordinates,
      cover_status: manhole.cover_status || 'closed',
      overflow_level: manhole.overflow_level || 'good',
      connections: manhole.connections || [],
    }));

    return res.status(200).json({
      success: true,
      count: transformedManholes.length,
      data: transformedManholes,
    });
  } catch (error) {
    console.error('Get manholes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get manhole by ID
const getManholeById = async (req, res) => {
  try {
    const { id } = req.params;
    const manhole = await Manhole.findOne({ id }).lean();

    if (!manhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...manhole,
        location: manhole.location.coordinates,
      },
    });
  } catch (error) {
    console.error('Get manhole by ID error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get manholes by zone
const getManholesByZone = async (req, res) => {
  try {
    const { zone } = req.params;
    const manholes = await Manhole.find({ zone }).lean();

    if (manholes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No manholes found in this zone',
      });
    }

    const result = manholes.map((m) => ({
      ...m,
      location: m.location.coordinates,
    }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Get manholes by zone error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get manholes near a specific location
const getManholesNearLocation = async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;

    if (!lng || !lat || !radius) {
      return res.status(400).json({
        success: false,
        message: 'Longitude, latitude, and radius are required',
      });
    }

    const manholes = await Manhole.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], parseFloat(radius) / 6378.1],
        },
      },
    }).lean();

    return res.status(200).json({
      success: true,
      count: manholes.length,
      data: manholes.map((m) => ({
        ...m,
        location: m.location.coordinates,
      })),
    });
  } catch (error) {
    console.error('Get nearby manholes error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update manhole by ID
const updateManholeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cover_status, overflow_level, notes, elevation, zone, connections } = req.body;

    const updateFields = {
      lastInspection: new Date().toISOString(),
    };

    if (code) updateFields.code = code;
    if (location) {
      updateFields.location = {
        type: 'Point',
        coordinates: Array.isArray(location) ? location : location.coordinates,
      };
    }
    if (elevation) updateFields.elevation = elevation;
    if (zone) updateFields.zone = zone;
    if (status) updateFields.status = status;
    if (cover_status) updateFields.cover_status = cover_status;
    if (overflow_level) updateFields.overflow_level = overflow_level;
    if (connections) updateFields.connections = connections;
    if (notes !== undefined) updateFields.notes = notes;

    const updatedManhole = await Manhole.findOneAndUpdate({ id }, updateFields, {
      new: true,
    }).lean();

    if (!updatedManhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Manhole updated successfully',
      data: {
        ...updatedManhole,
        location: updatedManhole.location.coordinates,
      },
    });
  } catch (error) {
    console.error('Update manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete manhole by ID
const deleteManholeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Manhole.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Manhole deleted successfully',
    });
  } catch (error) {
    console.error('Delete manhole error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete all manholes
const deleteAllManholes = async (req, res) => {
  try {
    const result = await Manhole.deleteMany({});
    return res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} manholes`,
    });
  } catch (error) {
    console.error('Delete all manholes error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get system status with aggregated statistics
const getSystemStatus = async (req, res) => {
  try {
    // Get all manholes from database
    const allManholes = await Manhole.find().lean();

    // Calculate metrics
    const totalManholes = allManholes.length;
    const monitoredManholes = allManholes.filter((m) => m.status === 'functional').length;
    const criticalIssues = allManholes.filter(
      (m) =>
        ['damaged', 'overflowing'].includes(m.status) ||
        m.overflow_level === 'risk' ||
        m.cover_status === 'open'
    ).length;

    const maintenanceOngoing = allManholes.filter((m) => m.status === 'under_maintenance').length;

    // Calculate system health percentage
    const healthyManholes = allManholes.filter(
      (m) => m.status === 'functional' && m.overflow_level === 'good' && m.cover_status === 'closed'
    ).length;

    const systemHealth = Math.round((healthyManholes / totalManholes) * 100);

    // Prepare response
    const systemStatus = {
      totalManholes,
      monitoredManholes,
      criticalIssues,
      maintenanceOngoing,
      systemHealth,
    };

    return res.status(200).json({
      success: true,
      data: systemStatus,
    });
  } catch (error) {
    console.error('System status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export {
  createManhole,
  getAllManholes,
  getManholeById,
  getManholesByZone,
  getManholesNearLocation,
  updateManholeStatus,
  deleteManholeById,
  deleteAllManholes,
  getSystemStatus,
};
