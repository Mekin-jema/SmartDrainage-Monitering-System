import { decodePolyline } from "../utils";

/**
 * Fetches and decodes a route from Valhalla API based on waypoints and profile.
 *
 * @param {Array} waypoints - Array of waypoint objects with latitude and longitude.
 * @param {string} profile - The routing profile (e.g., "auto", "bicycle", "pedestrian", "transit").
 * @returns {Object} GeoJSON-style feature collection with route details.
 */
export const getDefaultRoute = async (waypoints, profile = "auto") => {
  const valhallaUrl = "https://valhalla1.openstreetmap.de/optimized_route?json=";

  if (!Array.isArray(waypoints) || waypoints.length < 2) {
    throw new Error("At least two waypoints are required.");
  }

  const locations = waypoints.map((waypoint) => ({
    lat: waypoint.latitude,
    lon: waypoint.longitude,
  }));

  const routeRequest = {
    locations,
    costing: profile,
    directions_options: { units: "kilometers" },
  };

  try {
    const response = await fetch(valhallaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routeRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    let shapeIndexOffset = 0;
    const legs = data.trip.legs.map((leg) => {
      const steps = leg.maneuvers.map((step) => ({
        from_index: step.begin_shape_index + shapeIndexOffset,
        to_index: step.end_shape_index + shapeIndexOffset,
        distance: step.length,
        time: step.time,
        instruction: {
          text: step.instruction,
        },
      }));

      const lastStep = leg.maneuvers[leg.maneuvers.length - 1];
      if (lastStep) {
        shapeIndexOffset += lastStep.end_shape_index;
      }

      return {
        distance: leg.summary.length,
        time: leg.summary.time,
        steps: steps,
      };
    });

    const fullCoordinates = data.trip.legs
      .map((leg) => decodePolyline(leg.shape))
      .flat();

    const feature = {
      type: "Feature",
      properties: {
        mode: profile,
        waypoints: locations.map((loc, index) => ({
          location: [loc.lon, loc.lat],
          original_index: index,
        })),
        
        units: data.trip.units === "kilometers" ? "metric" : "imperial",
        distance: data.trip.summary.length,
        distance_units: "meters",
        time: data.trip.summary.time,
        legs: legs,

      },
      geometry: {
        type: "LineString",
        coordinates: fullCoordinates,
      },
    };

    return {
      features: [feature],
      properties: {
        mode: profile,
        waypoints: locations,
        units: data.trip.units === "kilometers" ? "metric" : "imperial",
      },
      type: "FeatureCollection",
    };
  } catch (error) {
    console.error("Error while fetching or transforming the route:", error);
    throw error;
  }
};
