export const addTrafficLayer = (map, trafficData) => {
  const trafficFeatures = trafficData.results.flatMap((item) =>
    item.location.shape.links.map((link) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: link.points.map((point) => [point.lng, point.lat]),
      },
      properties: {
        speed: item.currentFlow.speed,
        jamFactor: item.currentFlow.jamFactor,
      },
    }))
  );

  const trafficGeoJSON = {
    type: "FeatureCollection",
    features: trafficFeatures,
  };

  // Add traffic data as a source and layer
  if (map.getSource("traffic")) {
    map.getSource("traffic").setData(trafficGeoJSON);
  } else {
    map.addSource("traffic", {
      type: "geojson",
      data: trafficGeoJSON,
    });

    map.addLayer({
      id: "traffic-layer",
      type: "line",
      source: "traffic",
      paint: {
        "line-color": [
          "case",
          ["<=", ["get", "jamFactor"], 3],
          "#2ECC40", // Green for low congestion
          ["<=", ["get", "jamFactor"], 7],
          "#FF851B", // Orange for moderate congestion
          "#FF4136", // Red for high congestion
        ],
        "line-width": 5,
      },
    });
  }
};
