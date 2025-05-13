export default async function getPlaces(query) {

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ET`
    );


    return response.json();
  } catch (error) {
    console.error("Error fetching Ethiopian places:", error);
  }
}
