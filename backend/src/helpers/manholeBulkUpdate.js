//Update Manhole Status
const bulkUpdateZones = async (req, res) => {
    try {
      const { updates } = req.body; // Array of { manholeId, zone }
  
      if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: 'Updates array is required'
        });
      }
  
      const bulkOps = updates.map(update => ({
        updateOne: {
          filter: { _id: update.manholeId },
          update: { $set: { 'location.zone': update.zone } }
        }
      }));
  
      const result = await Manhole.bulkWrite(bulkOps);
  
      return res.status(200).json({
        success: true,
        message: 'Bulk update completed',
        data: result
      });
  
    } catch (error) {
      console.error('Bulk update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
//Get Manholes Needing Inspection (Not inspected in last 30 days)
  const getManholesDueForInspection = async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      const manholes = await Manhole.find({
        $or: [
          { lastInspection: { $lt: thirtyDaysAgo } },
          { lastInspection: null }
        ]
      });
  
      return res.status(200).json({
        success: true,
        count: manholes.length,
        data: manholes
      });
  
    } catch (error) {
      console.error('Inspection query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };