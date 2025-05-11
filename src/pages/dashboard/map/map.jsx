import React, { useEffect, useRef, useState } from "react"; // React hooks
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
// MapLibre GL library and styles
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// PMTiles for map tile protocol
import { getDefaultRoute } from "@/pages/dashboard/map/api/getValhallaRoute"; // Fetch default route (Valhalla)
import fetchPOIs from "@/pages/dashboard/map/api/getPointOfInterest"; // Fetch POIs
import fetchTrafficData from "@/pages/dashboard/map/api/getTrafficData"; // Fetch traffic data
// Utility functions
import { addPOILayerToMap } from "@/pages/dashboard/map/utils/addPOILayer"; // Add POI layers to the map
import { addTrafficLayer } from "@/pages/dashboard/map/utils/addTrafficLayer"; // Add traffic layers to the map
import categories from "@/pages/dashboard/map/utils/category"; // POI categories
// Redux actions
import Categories from "@/pages/dashboard/map/Popup/Categories";
import Filter from "@/pages/dashboard/map/Popup/Filter";

import AddressBox from "./inputHandler";
import GeocodingInput from "@/pages/dashboard/map/single-input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Main } from "@/pages/dashboard/main";
import { styles } from "@/pages/dashboard/map/map-styles/MapStyles";
import CategoryScroll from "@/pages/dashboard/map/poi-buttons";
import { variablelStyles } from "@/pages/dashboard/map/map-styles/variable-style";
import MapStyles from "@/pages/dashboard/map/map-style-popup";
import { addUpdatedValhalla } from "./utils/add-updated-valhalla";
import "../../dashboard/map/Popup/style.css";
import { getRouteInfo } from "./api";
import { removePOILayerFromMap } from "./utils/remove-poi-layer";

const Map = () => {
  // Refs for map container and instance
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  // State variables
  const [route, setRoute] = useState(null); // Current route
  const [map, setMap] = useState(null); // Map instance
  const [pois, setPois] = useState([]); // Points of Interest
  const [trafficData, setTrafficData] = useState([]); // Traffic data
  const [activeCategory, setActiveCategory] = useState(null); // Active POI category
  const [loading, setLoading] = useState(false); // Loading state
  const [showCategoryDetailPopup, setShowCategoryDetailPopup] = useState(false); // Category detail state
  const [showFilterPopup, setShowFilterPopup] = useState(false); // Filter popup state
  const [toggleGeocoding, setToggleGeocoding] = useState(false); // Geocoding toggle state
  const [mapStyle, setMapStyle] = useState(variablelStyles[0].url);
  const [profile, setProfile] = useState("auto"); // Routing type (button selected)

  const { state } = useSidebar(); // Get sidebar state (expanded or collapsed)

  const dispatch = useDispatch();
  const { waypoints } = useSelector((state) => state.map); // Waypoints from Redux
  const myAPIKey = import.meta.env.VITE_API_KEY; // API key from environment variables
  const [selectedStyle, setSelectedStyle] = useState(variablelStyles[0].name);

  // Initialize MapLibre
  useEffect(() => {
    // Create and configure the map instance
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapStyle}?apiKey=${myAPIKey}`,
      center: [38.7613, 9.0108],
      zoom: 30,
    });

    mapInstance.current.on("load", () => {
      mapInstance.current.flyTo({
        center: [38.7613, 9.0108], // Target center
        zoom: 14, // Target zoom level
        speed: 1.2, // Animation speed
        curve: 1.5, // Controls the flight path curvature
        essential: true, // Ensures animation even for users who prefer reduced motion
      });
    });
    mapInstance.current.on("click", "poi-layer", (e) => {
      const features = e.features[0];

      if (!features) return;

      const poiId = features.id; // Unique POI identifier

      // Update the feature's size by changing its properties
      mapInstance.current.setPaintProperty("poi-layer", "icon-size", [
        "case",
        ["==", ["get", "id"], poiId], // If this is the clicked POI
        2.0, // Enlarge size when selected
        1.0, // Default size
      ]);
    });

    // Add navigation controls
    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "bottom-right"
    );
    mapInstance.current.addControl(
      new maplibregl.FullscreenControl(),
      "bottom-right"
    );

    // Add satellite view switcher button
    const layerSwitcher = document.createElement("div");
    layerSwitcher.className = "maplibregl-ctrl maplibregl-ctrl-group";
    const satelliteButton = document.createElement("button");
    satelliteButton.innerHTML = "🛰️"; // Satellite emoji
    satelliteButton.onclick = () => {
      const satelliteStyle = styles.satelite;

      mapInstance.current.setStyle(satelliteStyle);
    };
    layerSwitcher.appendChild(satelliteButton);
    mapInstance.current.addControl(
      { onAdd: () => layerSwitcher, onRemove: () => {} },
      "bottom-right"
    );

    // Add marker at Addis Ababa
    const marker = new maplibregl.Marker({
      color: "#4285F4",
      draggable: true,
    })
      .setLngLat([38.7626, 9.0404])
      .addTo(mapInstance.current);

    mapInstance.current.on("styleimagemissing", (e) => {
      const missingImageId = e.id;

      const category = categories.find((cat) => cat.icon === missingImageId);

      if (category && !mapInstance.current.hasImage(missingImageId)) {
        const img = new Image();
        img.crossOrigin = "anonymous";

        // ✅ Dynamically build the Geoapify icon URL
        const iconName = category.icon; // e.g., 'restaurant', 'hotel'
        const color = category.textColor; // You can customize this
        const strokeColor = "ffffff00"; // Decreased stroke (fully transparent)
        const iconType = "material"; // 'awesome' maps to FontAwesome, or use 'material' etc.
        img.src = `https://api.geoapify.com/v1/icon/?type=material&color=${encodeURIComponent(
          color
        )}&icon=${iconName}&iconType=${iconType}&strokeColor=${encodeURIComponent(
          strokeColor
        )}&apiKey=${myAPIKey}`;

        img.onload = () => {
          mapInstance.current.addImage(missingImageId, img);
        };

        img.onerror = () => {
          console.error(`Failed to load icon for ${iconName}`);
        };
      }
    });

    // Add geolocation control
    mapInstance.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "bottom-right"
    );

    setMap(mapInstance.current);

    return () => mapInstance.current.remove(); // Clean up on component unmount
  }, []);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(`${mapStyle}?apiKey=${myAPIKey}`);
    }
  }, [mapStyle]);

  // * Fetch and render routes based on waypoints

  useEffect(() => {
    // Check if the map exists and all waypoints have valid lat/lng
    const isValidWaypoints = waypoints.every(
      (wp) => wp.latitude !== null && wp.longitude !== null
    );
    if (!map || waypoints.length < 2 || !isValidWaypoints) return;

    const fetchRoutes = async () => {
      try {
        const valhallaRoute = await getDefaultRoute(waypoints, profile);
        const routesInfo = await getRouteInfo(waypoints);
        setRoute(routesInfo);
        addUpdatedValhalla(map, valhallaRoute, waypoints, dispatch, profile);
      } catch (error) {
        console.error("Error fetching routes:", error.message);
      }
    };

    fetchRoutes();
  }, [map, waypoints, dispatch, profile, setProfile, mapStyle]);

  /**
   * Add POIs to the map
   */
  useEffect(() => {
    if (!map || pois.length === 0) return;
    addPOILayerToMap(map, pois);
  }, [pois, map]);

  /**
   * Fetch and render traffic data
   */
  useEffect(() => {
    if (!map || trafficData.length < 1) return;
    const getTrafficData = async () => {
      const data = await fetchTrafficData();
      setTrafficData(data);
    };
    getTrafficData();
    addTrafficLayer(map, trafficData);
  }, [trafficData, map]);

  const handleStyleChange = (style) => {
    setMapStyle(style.url);
    setSelectedStyle(style.name);
  };
  /**
   * Handle POI category click
   *
   */
  const handleCategoryClick = async (category) => {
    if (!map || loading) return;

    // If the same category is clicked again, toggle it off
    if (activeCategory === category.name) {
      setActiveCategory(null);
      setPois([]);
      removePOILayerFromMap(map); // 👈 clear previous POIs from the map
      return;
    }

    // Show new category
    setShowCategoryDetailPopup(true);
    setActiveCategory(category.name);

    const center = map.getCenter().toArray();
    const data = await fetchPOIs(category.tag, center, category.icon);

    const pois = data.elements.map((element) => ({
      id: element.id,
      name: element.tags["name:am"] || element.tags.name || "Unknown",
      lat: element.lat || element.center?.lat,
      lng: element.lon || element.center?.lon,
      icon: category.icon,
      color: category.textColor,
      cuisine: element.tags.cousine || "",
      internet_access: element.tags.internet_access || "",
      opening_hours: element.tags.opening_hours || "",
      tourism: element.tags.tourism || "",
      website: element.tags.website || "",
      iconComp: category.IconComponent,
    }));

    setPois(pois);
    removePOILayerFromMap(map); // 👈 remove previous POIs before adding new
    addPOILayerToMap(map, pois); // 👈 add new POIs
  };

  return (
    <Main className="fixed w-full h-screen ml-1 mr-1 ">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-green-400 font-semibold">
              Loading Traffic Data...
            </p>
          </div>
        </div>
      )}
      {/*  */}
      <MapStyles
        variablelStyles={variablelStyles}
        selectedStyle={selectedStyle}
        handleStyleChange={handleStyleChange}
      />

      <div
        className={`fixed top-24 ${
          state === "collapsed" ? "md:left-[60px]" : "md:left-[300px]"
        } left-0  flex  z-10 items-center `}
      >
        {/* <SidebarTrigger className="ml-2" /> */}
        {toggleGeocoding ? (
          <AddressBox
            route={route}
            map={map}
            setToggleGeocoding={setToggleGeocoding}
            profile={profile}
            setProfile={setProfile}
          />
        ) : (
          <GeocodingInput map={map} setToggleGeocoding={setToggleGeocoding} />
        )}
      </div>

      <ToastContainer position="top-center" autoClose={10000} />
      <div
        ref={mapContainer}
        className="absolute top-9 inset-0 bg-white w-full h-full rounded-[10px]"
      />
      <CategoryScroll
        categories={categories}
        activeCategory={activeCategory}
        handleCategoryClick={handleCategoryClick}
      />
      <div className="relative z-40">
        {showCategoryDetailPopup && pois.length > 0 ? (
          <Categories
            setShowCategoryDetailPopup={setShowCategoryDetailPopup}
            setShowFilterPopup={setShowFilterPopup}
            data={pois}
            map={map}
          />
        ) : (
          showFilterPopup && (
            <Filter
              setShowFilterPopup={setShowFilterPopup}
              setShowCategoryDetailPopup={setShowCategoryDetailPopup}
            />
          )
        )}
      </div>
    </Main>
  );
};

export default Map;
