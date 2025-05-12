import Manhole from '../models/manhole.model.js';
import mongoose from 'mongoose';

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
      notes 
    } = req.body;

    // Validate required fields
    if (!code || !location?.coordinates || !elevation) {
      return res.status(400).json({ 
        success: false,
        message: 'Code, location coordinates, and elevation are required' 
      });
    }

    const alreadyExists = await Manhole.findOne({ code });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: 'Manhole with this code already exists'
      });
    }

    const newManhole = new Manhole({
      _id: new mongoose.Types.ObjectId(),
      code,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      elevation,
      zone,
      installedDate: new Date(),
      lastInspection: null,
      status: status || 'functional',
      cover_status: cover_status || 'closed',
      overflow_level: overflow_level || 'good',
      connections: connections || [],
      notes: notes || ''
    });
    
    await newManhole.save();

    return res.status(201).json({
      success: true,
      message: 'Manhole created successfully',
      data: {
        ...newManhole.toObject(),
        // Ensure response matches mock data structure
        location: newManhole.location.coordinates
      }
    });

  } catch (error) {
    console.error('Create manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all manholes (modified to match mock data structure)
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
      // Ensure all mock data fields are included
      cover_status: manhole.cover_status || 'closed',
      overflow_level: manhole.overflow_level || 'good',
      connections: manhole.connections || []
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

// Update manhole to handle all fields from mock data
const updateManholeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      cover_status, 
      overflow_level, 
      notes,
      elevation,
      zone,
      connections
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid manhole ID'
      });
    }

    const updateFields = {
      lastInspection: new Date()
    };

    if (status) updateFields.status = status;
    if (cover_status) updateFields.cover_status = cover_status;
    if (overflow_level) updateFields.overflow_level = overflow_level;
    if (notes) updateFields.notes = notes;
    if (elevation) updateFields.elevation = elevation;
    if (zone) updateFields.zone = zone;
    if (connections) updateFields.connections = connections;

    const updatedManhole = await Manhole.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).lean();
    
    if (!updatedManhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found'
      });
    }

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
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Other functions (getManholesNearLocation, getManholesByZone, etc.) should also
// be modified to return data in the mock data structure

export { 
  createManhole, 
  getAllManholes, 
  getManholesNearLocation, 
  getManholesByZone, 
  updateManholeStatus,
  deleteAllManholes,
  deleteManholeById
};