export const getOptimizedRouteWithStops = async (waypoints) => {
  if (!waypoints || waypoints.length < 2) {
    throw new Error(
      "At least two waypoints are required to calculate a route."
    );
  }

  try {
    // Filter out invalid waypoints and construct OSRM URL
    const validWaypoints = waypoints.filter(
      (wp) => wp.longitude && wp.latitude
    );
    if (validWaypoints.length < 2) {
      throw new Error("At least two valid waypoints are required.");
    }

    const locations = validWaypoints
    .map((wp) => `${wp.longitude},${wp.latitude}`)
      .join(";");

    const osrmUrl = `https://router.project-osrm.org/trip/v1/driving/${locations}?source=first&overview=full&geometries=geojson&steps=true`;


    // Fetch route data
    const response = await fetch(osrmUrl);
    if (!response.ok) {
      throw new Error(
        `OSRM API Error (Status: ${response.status}): ${response.statusText}`
      );
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching the optimized route:", error);
    throw error; // Ensure error is handled properly
  }
};
