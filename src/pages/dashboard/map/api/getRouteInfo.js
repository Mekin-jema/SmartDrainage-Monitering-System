export const getRouteInfo = async (waypoints) => {
  try {
    // Construct the OSRM API URL with all waypoints
    const locations = waypoints
      .map((wp) => `${wp.longitude},${wp.latitude}`)
      .join(";"); // Join waypoints into a single string
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${locations}?overview=false&alternatives=true&steps=true&geometries=geojson`;

    // Fetch the route data
    const response = await fetch(osrmUrl);
    if (!response.ok) {
      throw new Error(`OSRM API Error: ${response.statusText}`);
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching the route:", error);
    throw error; // Re-throw the error for further handling
  }
};
