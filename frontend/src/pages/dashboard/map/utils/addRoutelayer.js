import maplibregl from "maplibre-gl";
import getPlaceNameFromCoordinates from "../api/getPlaceFromCoordinates"

let markers = []; // Store marker instances

// Helper function to fetch place name
const getLocation = async (lngLat) => {
  try {
    return await getPlaceNameFromCoordinates(lngLat);
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lngLat.lng}, ${lngLat.lat}`;
  }
};

/**
 * Adds a route layer with draggable markers styled like Google Maps
 * @param {Object} map - Maplibre GL map instance
 * @param {string} color - Route line color
 * @param {Array} geometry - Array of [lng, lat] coordinates
 * @param {string} name - Unique route layer name
 * @param {number} thickness - Route line thickness
 * @param {Function} setWaypoints - State updater for waypoints
 * @param {Array} waypoints - Array of waypoint objects
 * @param {Function} dispatch - Redux dispatch or state function
 */
export const addRouteLayer = (
  map,
  color,
  geometry,
  name,
  thickness,
  setWaypoints,
  waypoints,
  dispatch
) => {
  // Clean up previous layers and sources
  if (map.getLayer(name)) map.removeLayer(name);
  if (map.getSource(name)) map.removeSource(name);

  // Add new GeoJSON source for the route
  map.addSource(name, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: geometry,
      },
    },
  });

  // Add styled route line (Google Maps like)
  map.addLayer({
    id: name,
    type: "line",
    source: name,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color || "#4285F4",   // Google Maps blue
      "line-width": thickness || 6,
      "line-opacity": 0.8,
    },
  });

  // Remove any existing markers
  markers.forEach((marker) => marker.remove());
  markers = [];

  // Loop through waypoints and create draggable markers
  waypoints.forEach((waypoint, index) => {
    const isStart = index === 0;
    const isEnd = index === waypoints.length - 1;

    // Google-like marker colors
    const markerColor = isStart
      ? "#34A853"   // Green for start
      : isEnd
      ? "#EA4335"   // Red for end
      : "#F9AB00";  // Yellow for middle points

    // Create draggable marker
    const marker = new maplibregl.Marker({
      color: markerColor,
      draggable: true,
    })
      .setLngLat([waypoint.longitude, waypoint.latitude])
      .addTo(map);

    // Add shadow and circle effect for Google Maps vibe
    const el = marker.getElement();
    el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
    el.style.borderRadius = "50%";
    el.style.width = "32px";
    el.style.height = "32px";

    // Store marker instance
    markers.push(marker);

    // Handle dragging
    marker.on("dragend", async () => {
      const lngLat = marker.getLngLat();

      // Reverse geocode to get updated place name
      const placeName = await getLocation(lngLat);

      // Update the waypoints array
      const updatedWaypoints = [...waypoints];
      updatedWaypoints[index] = {
        placeName,
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      };

      // Update the waypoints state
      dispatch(setWaypoints(updatedWaypoints));

      // Update the route line with new coordinates
      const source = map.getSource(name);
      if (source) {
        source.setData({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: updatedWaypoints.map((wp) => [wp.longitude, wp.latitude]),
          },
        });
      }
    });
  });
};
