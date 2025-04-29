import Manhole from '../models/manhole.model.js';
import mongoose from 'mongoose';
const createManhole = async (req, res) => {
  try {
    const { code, location, installedDate, status, notes } = req.body;

    // Validate required fields
    if (!code || !location?.coordinates) {
      return res.status(400).json({ 
        success: false,
        message: 'Code and location coordinates are required' 
      });
    }
// user interface or page is needed in frontend
    const newManhole = new Manhole({
      _id: new mongoose.Types.ObjectId(),
      code,
      location,
      installedDate: installedDate || Date.now(),
      lastInspection: null,
      status: status || 'active',
      notes: notes || ''
    });

    await newManhole.save();

    return res.status(201).json({
      success: true,
      message: 'Manhole created successfully',
      data: newManhole
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
      const manholes = await Manhole.find().sort({ installedDate: -1 });
      
      return res.status(200).json({
        success: true,
        count: manholes.length,
        data: manholes
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
      const { longitude, latitude, maxDistance = 1000 } = req.query; // maxDistance in meters
  
      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          message: 'Longitude and latitude are required'
        });
      }
  
      const manholes = await Manhole.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(maxDistance)
          }
        }
      });
  
      return res.status(200).json({
        success: true,
        count: manholes.length,
        data: manholes
      });
  
    } catch (error) {
      console.error('Geospatial query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
// get manholes by zone
const getManholesByZone = async (req, res) => {
try {
    const { zone } = req.params;

    const manholes = await Manhole.find({ 'location.zone': zone });

    return res.status(200).json({
    success: true,
    count: manholes.length,
    data: manholes
    });

} catch (error) {
    console.error('Zone query error:', error);
    return res.status(500).json({
    success: false,
    message: 'Internal server error'
    });
}
};
// update manhole status
const updateManholeStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
  
      if (!status || !id) {
        return res.status(400).json({
          success: false,
          message: 'Status and id are required'
        });
      }
  
      const updatedManhole = await Manhole.findByIdAndUpdate(
        id,
        { 
          status,
          lastInspection: Date.now(),
          notes: notes || undefined 
        },
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Manhole status updated',
        data: updatedManhole
      });
  
    } catch (error) {
      console.error('Update status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  export { 
    createManhole, 
    getAllManholes, 
    getManholesNearLocation, 
    getManholesByZone, 
    updateManholeStatus 
};