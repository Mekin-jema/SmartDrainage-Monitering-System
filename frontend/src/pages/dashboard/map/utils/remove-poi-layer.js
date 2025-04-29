export const removePOILayerFromMap = (map) => {
    if (!map.getStyle()) return;
  
    // Remove the POI layer if it exists
    if (map.getLayer('poi-layer')) {
      map.removeLayer('poi-layer');
    }
  
    // Remove the POI source if it exists
    if (map.getSource('pois')) {
      map.removeSource('pois');
    }
  
    // Optionally reset the cursor in case it's still set
    map.getCanvas().style.cursor = '';
  };
  