import { setWaypoints } from "@/Redux/MapSlice";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getPlaceNameFromCoordinates } from "../api";


let routeData;
let routeStepsData;
let instructionsData;
let stepPointsData;
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




const popup = new maplibregl.Popup();

export const addUpdatedValhalla = (map, data,waypoints,dispatch,profile) => {
  routeData = data;
  const steps = [];
  const instructions = [];
  const stepPoints = [];

  if (
    !routeData.features ||
    !routeData.features[0] ||
    !routeData.features[0].properties.legs
  ) {
    console.error("Invalid route data structure");
    return;
  }

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
        const source = map.getSource("route");
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



  const legGeometry = routeData.features[0]?.geometry?.coordinates;
  if (routeData.features[0]?.properties?.legs) {
    routeData.features[0]?.properties.legs.forEach((leg) => {
      if (!legGeometry) {
        console.warn(`Leg geometry not found for leg index ${legIndex}`);
        return;
      }

      leg.steps.forEach((step, index) => {
        if (step.instruction) {
          instructions.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: legGeometry[step.from_index],
            },
            properties: {
              text: step.instruction.text,
            },
          });
        }
        if (index !== 0) {
    
          stepPoints.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: legGeometry[step.from_index],
            },
            properties: step,
          });
        }

        if (step.from_index === step.to_index) {
          return;
        }
        
        const stepGeometry = legGeometry.slice(step.from_index, step.to_index + 1);
        if (
          Array.isArray(legGeometry) &&
          step.from_index >= 0 &&
          step.to_index >= 0 &&
          step.from_index < legGeometry.length &&
          step.to_index < legGeometry.length
        ) {
        } else {
          console.warn(`Invalid indices for step geometry: from_index=${step.from_index}, to_index=${step.to_index}`);
          return;
        }
        if (!stepGeometry || stepGeometry.length === 0) {
          console.warn(`Step geometry not found for step index ${index}`);
          return;
        }

        steps.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: stepGeometry,
          },
          properties: step,
        });
      });
    });
  } else {
    console.error("No legs found in route data");
  }

  routeStepsData = {
    type: "FeatureCollection",
    features: steps,
  };

  instructionsData = {
    type: "FeatureCollection",
    features: instructions,
  };

  stepPointsData = {
    type: "FeatureCollection",
    features: stepPoints,
  };

  // Remove previous sources/layers if they exist
  if (map.getLayer("route-layer")) map.removeLayer("route-layer");
  if (map.getSource("route")) map.removeSource("route");

  if (map.getLayer("points-layer")) map.removeLayer("points-layer");
  if (map.getSource("points")) map.removeSource("points");

  // Add new sources
  map.addSource("route", {
    type: "geojson",
    data: routeData,
  });

  map.addSource("points", {
    type: "geojson",
    data: instructionsData,
  });

  addLayerEvents(map);
  drawRoute(map,profile);
};

function drawRoute(map,profile) {


  // / Choose style based on profile
  let style = {
    type: "line",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#A91CD8",
      "line-width": 10,
    },
    filter: ["==", "$type", "LineString"],
  };

  switch (profile) {
    case "bicycle":
      style.paint = {
        "line-color": "#A91CD8",
        "line-width": 10,
        "line-opacity": 0.6,
        "line-dasharray": [0.08, 1], // creates dotted pattern
      };
      break;
    case "pedestrian":
      style.paint = {
        "line-color": "#A91CD8",
        "line-width": 10,
        "line-opacity": 0.8,
        "line-dasharray": [0.1, 1], // creates dotted pattern
      };
      break;
    case "motor_scooter":
      style.paint = {
        "line-color": "#A91CD8",
        "line-width": 10,
        "line-opacity": 0.7,
      };
      break;
    case "transit":
      style.paint = {
        "line-color": "#A91CD8",
        "line-width": 12,
        "line-opacity": 0.5,
      };
      break;
    case "multimodal":
      style.paint = {
        "line-color": "#A91CD8",
        "line-width": 10,
        "line-opacity": 0.4,
      };
      break;
    case "auto":
    default:
      style.paint = {
        "line-color": "#A91CD8",
        "line-width": 10,
        "line-opacity": 1.0,
      };
      break;
  }
  
  if (!routeData) return;


    map.getSource("route").setData(routeData);
    map.addLayer({
      id: "route-layer",
      type: "line",
      source: "route",
      ...style,
    });

    map.getSource("points").setData(instructionsData);
    map.addLayer({
      id: "points-layer",
      type: "circle",
      source: "points",
      paint: {
        "circle-radius": 4,
        "circle-color": "#fff",
        "circle-stroke-color": "#aaa",
        "circle-stroke-width": 1,
      },
    });
  }


function addLayerEvents(map) {
  map.on("mouseenter", "route-layer", () => {
    map.getCanvas().style.cursor = "pointer";
    // You can also modify the layer style to highlight routes on hover
    // map.setPaintProperty("route-layer", "line-color", "#FF6347"); // Highlight on hover
  });
  
  map.on("mouseleave", "route-layer", () => {
    map.getCanvas().style.cursor = "";
    // Reset the route color
    // map.setPaintProperty("route-layer",    "line-color", "#A91CD8",);
         
  });
  
  map.on("mouseenter", "points-layer", () => {
    map.getCanvas().style.cursor = "pointer";
    // You can change the point color when hovered
    // map.setPaintProperty("points-layer", "circle-color", "#FF6347");
  });
  
  map.on("mouseleave", "points-layer", () => {
    map.getCanvas().style.cursor = "";
    // Reset the point color
    // map.setPaintProperty("points-layer", "circle-color", "#fff");
  });
  

map.on("mousemove", "route-layer", (e) => {
    if (!e.features || e.features.length === 0) return;
    
    const clickedFeature = e.features[0];
    const stepData = clickedFeature.properties;
    const routeGeometry = routeData.features[0].geometry;
    
    // Get the clicked point coordinates
    const clickedPoint = e.lngLat;
    
    // Find the closest point in the route geometry
    let closestDistance = Infinity;
    let pointIndex = 0;
    
    // Convert route geometry coordinates to [lng, lat] format
    const routeCoordinates = routeGeometry.coordinates;
    
    // Find the closest point in the route
    for (let i = 0; i < routeCoordinates.length; i++) {
      const routePoint = routeCoordinates[i];
      const dx = clickedPoint.lng - routePoint[0];
      const dy = clickedPoint.lat - routePoint[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        pointIndex = i;
      }
    }
    
    // Now use this calculated pointIndex with your existing logic
    const steps = routeData.features[0].properties.legs.flatMap(leg => leg.steps);
    
    let cumulativeDistance = 0;
    let cumulativeTime = 0;  // New variable for cumulative time
    let matchedStep = null;
    
    for (const step of steps) {
      if (pointIndex >= step.from_index && pointIndex <= step.to_index) {
        matchedStep = step;
        // Estimate partial progress in current step
        const stepLength = step.to_index - step.from_index;
        const progressRatio = stepLength > 0 ? (pointIndex - step.from_index) / stepLength : 0;
        cumulativeDistance += step.distance * progressRatio;
        cumulativeTime += step.time * progressRatio;  // Add partial time
        break;
      } else {
        cumulativeDistance += step.distance;
        cumulativeTime += step.time;  // Add full step time
      }
    }
    
    const dataToShow = {};
    
    if (matchedStep) {
      dataToShow.instruction = matchedStep.instruction?.text || "No instruction";
      dataToShow.step_distance = `${matchedStep.distance.toFixed(2)} km`;
      dataToShow.step_time = `${matchedStep.time.toFixed(2)} sec`;
      dataToShow.cumulative_distance = `${cumulativeDistance.toFixed(2)} km`;
      dataToShow.cumulative_time = `${cumulativeTime.toFixed(2)} sec`;  // Add cumulative time
      
      // Convert seconds to minutes:seconds format if > 60 seconds
      if (cumulativeTime >= 60) {
        const minutes = Math.floor(cumulativeTime / 60);
        const seconds = Math.floor(cumulativeTime % 60);
        dataToShow.cumulative_time_formatted = `${minutes}m ${seconds}s`;
      }
    } else {
      dataToShow.note = "No step matched.";
    }
    
    // Optional additional properties
    if (stepData.surface) dataToShow.surface = stepData.surface;
    if (stepData.elevation !== undefined) dataToShow.elevation = `${stepData.elevation} m`;
    if (stepData.elevation_gain !== undefined) dataToShow.elevation_gain = `${stepData.elevation_gain} m`;
    
    if (document.getElementById("showDetails")?.checked) {
      showPopup(dataToShow, e.lngLat, map);
    } else {
      showPopup(
        {
          mode: stepData.mode,
          units: stepData.units,
          ...dataToShow
        },
        e.lngLat,
        map
      );
    }
    
    e.preventDefault();
});
  
  

  map.on("mousemove", "points-layer", (e) => {
    const properties = e.features[0].properties;
    const point = e.features[0].geometry.coordinates;

    if (properties.text) {
      popup.setText(properties.text).setLngLat(point).addTo(map);
      e.preventDefault();
    }
  });
}

function showPopup(data, lngLat, map) {
  const popupHtml = Object.keys(data)
    .map((key) => {
      return `<div class="popup-property-container">
                <span class="popup-property-label">${key}:</span>
                <span class="popup-property-value">${data[key]}</span>
              </div>`;
    })
    .join("");

  // This ensures the popup updates even when hovering quickly between features
  popup.remove(); // Important line

  popup.setLngLat(lngLat).setHTML(popupHtml).addTo(map);
}
