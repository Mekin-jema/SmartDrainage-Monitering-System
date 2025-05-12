import Manhole from '../models/manhole.model.js';
import mongoose from 'mongoose';

// Helper function to generate auto-incrementing numeric ID
const getNextManholeId = async () => {
  const lastManhole = await Manhole.findOne().sort({ id: -1 });
  return lastManhole ? lastManhole.id + 1 : 1;
};

// Create a new manhole with auto-generated numeric ID
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
      lastInspection,
      notes 
    } = req.body;

    // Validate required fields
    if (!code || !location || !elevation) {
      return res.status(400).json({ 
        success: false,
        message: 'Code, location coordinates, and elevation are required' 
      });
    }

    // Check if code exists
    const existingManhole = await Manhole.findOne({ code });
    if (existingManhole) {
      return res.status(400).json({
        success: false,
        message: 'Manhole with this code already exists'
      });
    }

    const id = await getNextManholeId();

    const newManhole = new Manhole({
      id,
      code,
      location: {
        type: "Point",
        coordinates: Array.isArray(location) ? location : location.coordinates,
      },
      elevation,
      zone: zone || 'A',
      status: status || 'functional',
      cover_status: cover_status || 'closed',
      overflow_level: overflow_level || 'good',
      connections: connections || [],
      lastInspection: lastInspection || null,
      notes: notes || ''
    });

    await newManhole.save();

    return res.status(201).json({
      success: true,
      message: 'Manhole created successfully',
      data: {
        ...newManhole.toObject(),
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

// Get all manholes sorted by numeric ID
const getAllManholes = async (req, res) => {
  try {
    const manholes = await Manhole.find().sort({ id: 1 }).lean();
    
    if (manholes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No manholes found'
      });
    }

    const transformedManholes = manholes.map(m => ({
      ...m,
      location: m.location.coordinates
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

// Get manhole by numeric ID
const getManholeById = async (req, res) => {
  try {
    const { id } = req.params;

    const manhole = await Manhole.findOne({ id }).lean();
    if (!manhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...manhole,
        location: manhole.location.coordinates
      }
    });

  } catch (error) {
    console.error('Get manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update manhole by numeric ID
const updateManhole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.location && Array.isArray(updateData.location)) {
      updateData.location = {
        type: "Point",
        coordinates: updateData.location
      };
    }

    const updatedManhole = await Manhole.findOneAndUpdate(
      { id: Number(id) },
      updateData,
      { new: true }
    ).lean();

    if (!updatedManhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Manhole updated successfully',
      data: {
        ...updatedManhole,
        location: updatedManhole.location.coordinates
      }
    });

  } catch (error) {
    console.error('Update manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete manhole by numeric ID
const deleteManhole = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedManhole = await Manhole.findOneAndDelete({ id: Number(id) }).lean();
    if (!deletedManhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Manhole deleted successfully',
      data: {
        ...deletedManhole,
        location: deletedManhole.location.coordinates
      }
    });

  } catch (error) {
    console.error('Delete manhole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get manholes near location
const getNearbyManholes = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 1000 } = req.query;

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
    }).sort({ id: 1 }).lean();

    const transformedManholes = manholes.map(m => ({
      ...m,
      location: m.location.coordinates
    }));

    return res.status(200).json({
      success: true,
      count: transformedManholes.length,
      data: transformedManholes
    });

  } catch (error) {
    console.error('Nearby manholes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get manholes by zone
const getManholesByZone = async (req, res) => {
  try {
    const { zone } = req.params;

    const manholes = await Manhole.find({ zone }).sort({ id: 1 }).lean();
    if (manholes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No manholes found in zone ${zone}`
      });
    }

    const transformedManholes = manholes.map(m => ({
      ...m,
      location: m.location.coordinates
    }));

    return res.status(200).json({
      success: true,
      count: transformedManholes.length,
      data: transformedManholes
    });

  } catch (error) {
    console.error('Zone manholes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  createManhole,
  getAllManholes,
  getManholeById,
  updateManhole,
  deleteManhole,
  getNearbyManholes,
  getManholesByZone
};