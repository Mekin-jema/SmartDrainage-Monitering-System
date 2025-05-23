import manholeModel from "../models/manhole.model.js";

const getAllManholes = async () => {
  try {
    const manholes = await manholeModel.find().lean();

    if (!manholes.length) {
      throw new Error('No manholes found');
    }

    const transformedManholes = manholes.map((manhole) => ({
      ...manhole,
      location: manhole.location?.coordinates || [],
      cover_status: manhole.cover_status || 'closed',
      overflow_level: manhole.overflow_level || 'good',
      connections: manhole.connections || [],
    }));

    return {
      success: true,
      count: transformedManholes.length,
      data: transformedManholes,
    };
  } catch (error) {
    console.error('Get manholes error:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export default getAllManholes;