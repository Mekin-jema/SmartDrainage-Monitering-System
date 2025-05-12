import Manhole from '../models/manhole.model.js';
import mongoose from 'mongoose';

// Create a new manhole (allows custom _id)
const createManhole = async (req, res) => {
  try {
    const { 
      _id,
      code, 
      location, 
      elevation,
      zone,
      status,
      cover_status,
      overflow_level,
      connections,
      lastInspection,
      notes 
    } = req.body;

    // Validate required fields
    if (!code || !location || !elevation) {
      return res.status(400).json({ 
        success: false,
        message: 'Code, location, and elevation are required' 
      });
    }

    // Check if code already exists
    const existingCode = await Manhole.findOne({ code });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Manhole with this code already exists'
      });
    }

    // Check if custom ID is provided and valid
    if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: 'Provided ID is not valid'
      });
    }

    // Check if custom ID already exists
    if (_id) {
      const existingId = await Manhole.findById(_id);
      if (existingId) {
        return res.status(400).json({
          success: false,
          message: 'Manhole with this ID already exists'
        });
      }
    }

    const newManhole = new Manhole({
      _id: _id || new mongoose.Types.ObjectId(),
      code,
      location: {
        type: "Point",
        coordinates: Array.isArray(location) ? location : location.coordinates,
      },
      elevation,
      zone: zone || 'A',
      installedDate: new Date(),
      lastInspection: lastInspection ? new Date(lastInspection) : null,
      status: status || 'functional',
      cover_status: cover_status || 'closed',
      overflow_level: overflow_level || 'good',
      connections: connections || [],
      notes: notes || ''
    });
    
    await newManhole.save();

    // Transform to match mock data structure
    const responseData = {
      ...newManhole.toObject(),
      location: newManhole.location.coordinates
    };

    return res.status(201).json({
      success: true,
      message: 'Manhole created successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Create manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all manholes
const getAllManholes = async (req, res) => {
  try {
    const manholes = await Manhole.find().lean();
    
    if(manholes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No manholes found'
      });
    }

    // Transform to match mock data structure
    const transformedManholes = manholes.map(manhole => ({
      ...manhole,
      location: manhole.location.coordinates,
      // Ensure all fields have defaults matching mock data
      cover_status: manhole.cover_status || 'closed',
      overflow_level: manhole.overflow_level || 'good',
      connections: manhole.connections || [],
      zone: manhole.zone || 'A',
      status: manhole.status || 'functional'
    }));

    return res.status(200).json({
      success: true,
      count: transformedManholes.length,
      data: transformedManholes
    });

  } catch (error) {
    console.error('Get manholes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get manholes near a location
const getManholesNearLocation = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 1000 } = req.query;

    // Validate inputs
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const manholes = await Manhole.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).lean();

    // Transform to match mock data structure
    const transformedManholes = manholes.map(manhole => ({
      ...manhole,
      location: manhole.location.coordinates
    }));

    res.status(200).json({
      success: true,
      count: transformedManholes.length,
      data: transformedManholes
    });

  } catch (error) {
    console.error('Geospatial query error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get manholes by zone
const getManholesByZone = async (req, res) => {
  try {
    const { zone } = req.params;
    
    const manholes = await Manhole.find({ zone }).lean();
    
    if(manholes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No manholes found in zone ${zone}`
      });
    }

    // Transform to match mock data structure
    const transformedManholes = manholes.map(manhole => ({
      ...manhole,
      location: manhole.location.coordinates
    }));

    return res.status(200).json({
      success: true,
      count: transformedManholes.length,
      data: transformedManholes
    });

  } catch (error) {
    console.error('Zone query error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update manhole (full update)
const updateManholeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      code,
      location,
      elevation,
      zone,
      status,
      cover_status,
      overflow_level,
      connections,
      lastInspection,
      notes
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid manhole ID'
      });
    }

    // Check if manhole exists
    const existingManhole = await Manhole.findById(id);
    if (!existingManhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found'
      });
    }

    // Check if new code conflicts with another manhole
    if (code && code !== existingManhole.code) {
      const codeExists = await Manhole.findOne({ code, _id: { $ne: id } });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: 'Another manhole already uses this code'
        });
      }
    }

    const updateFields = {
      lastInspection: lastInspection ? new Date(lastInspection) : new Date()
    };

    if (code) updateFields.code = code;
    if (location) {
      updateFields.location = {
        type: "Point",
        coordinates: Array.isArray(location) ? location : location.coordinates
      };
    }
    if (elevation) updateFields.elevation = elevation;
    if (zone) updateFields.zone = zone;
    if (status) updateFields.status = status;
    if (cover_status) updateFields.cover_status = cover_status;
    if (overflow_level) updateFields.overflow_level = overflow_level;
    if (connections) updateFields.connections = connections;
    if (notes !== undefined) updateFields.notes = notes;

    const updatedManhole = await Manhole.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).lean();
    
    // Transform to match mock data structure
    const transformedManhole = {
      ...updatedManhole,
      location: updatedManhole.location.coordinates
    };

    return res.status(200).json({
      success: true,
      message: 'Manhole updated successfully',
      data: transformedManhole
    });

  } catch (error) {
    console.error('Update manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete all manholes
const deleteAllManholes = async (req, res) => {
  try {
    const result = await Manhole.deleteMany({});
    
    return res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} manholes`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Delete all manholes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete manhole by ID
const deleteManholeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid manhole ID' 
      });
    }

    const deletedManhole = await Manhole.findByIdAndDelete(id).lean();

    if (!deletedManhole) {
      return res.status(404).json({ 
        success: false, 
        message: 'Manhole not found' 
      });
    }

    // Transform to match mock data structure
    const transformedManhole = {
      ...deletedManhole,
      location: deletedManhole.location.coordinates
    };

    res.status(200).json({
      success: true,
      message: 'Manhole deleted successfully',
      data: transformedManhole
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

export { 
  createManhole, 
  getAllManholes, 
  getManholesNearLocation, 
  getManholesByZone, 
  updateManholeStatus,
  deleteAllManholes,
  deleteManholeById
};