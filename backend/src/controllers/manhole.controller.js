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
    const alreadyExists = await Manhole.findOne({ code });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: 'Manhole with this code already exists'
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
      if(manholes.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No manholes found'
        });
      }
      // Sort by installedDate in descending order
      manholes.sort((a, b) => new Date(b.installedDate) - new Date(a.installedDate));

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
    });

    res.status(200).json({
      success: true,
      count: manholes.length,
      data: manholes
    });

  } catch (error) {
    console.error('Geospatial query error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// deltete all amnhole
const deleteAllManholes = async () => {
  try {
    // await mongoose.connect('your_mongodb_uri');
    const result = await Manhole.deleteMany({});
    console.log(`Deleted ${result.deletedCount} manholes`);
  } catch (error) {
    console.error('Deletion error:', error);
  } finally {
    mongoose.disconnect();
  }
};
// DELETE /api/manholes/:id
const deleteManholeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid manhole ID' 
      });
    }

    const deletedManhole = await Manhole.findByIdAndDelete(id);

    if (!deletedManhole) {
      return res.status(404).json({ 
        success: false, 
        message: 'Manhole not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Manhole deleted successfully',
      data: deletedManhole
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};
// get manholes by zone
const getManholesByZone = async (req, res) => {
try {
    const { zone } = req.params;
    const manholes = await Manhole.find({ 'location.zone': zone });
    if(manholes.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No manholes found in this zone'
        });
    }
    // Sort by installedDate in descending order
    manholes.sort((a, b) => new Date(b.installedDate) - new Date(a.installedDate));
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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid manhole ID'
        });
      }
      // Check if the manhole exists
      const manhole = await Manhole.findById(id);
      console.log('Manhole:', manhole);
      if (Object.keys(manhole).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Manhole not found'
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
    updateManholeStatus,
    deleteAllManholes,
    deleteManholeById
};