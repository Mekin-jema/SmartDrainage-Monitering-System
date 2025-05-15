const fetchPOIs = async (categoryTag, center) => {
  //   setLoading(true);
  const [lng, lat] = center;
  const radius = 5000; // Search radius in meters (5km)

  const query = `
      [out:json];
      (
        node[${categoryTag}](around:${radius},${lat},${lng});
        way[${categoryTag}](around:${radius},${lat},${lng});
        relation[${categoryTag}](around:${radius},${lat},${lng});
      );
      out center;
    `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching POIs:", error);
  }
  // finally {
  //     setLoading(false);
  //   }
};

export default fetchPOIs;
