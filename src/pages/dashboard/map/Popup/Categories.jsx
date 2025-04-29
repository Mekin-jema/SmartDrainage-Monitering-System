import React, { useEffect, useState } from "react";
import { getShortestRoute } from "../api/getShortestRoute";
import { setWaypoints } from "../../../../Redux/MapSlice";
import { useDispatch } from "react-redux";
import { addRouteLayer } from "../utils/addRoutelayer";
import maplibregl from "maplibre-gl";
import { addPOILayerToMap } from "../utils/addPOILayer";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react"; // For the close icon

const Categories = ({
  setShowCategoryDetailPopup,
  setShowFilterPopup,
  data,
  setData,
  map,
}) => {
  const [userLocation, setUserLocation] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const dispatch = useDispatch();

  // Fetch user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching user location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Format search results
  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Sort data by distance
  useEffect(() => {
    if (userLocation && data.length > 0) {
      const sorted = [...data].sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.lat,
          a.lng
        );
        const distanceB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.lat,
          b.lng
        );
        return distanceA - distanceB;
      });
      setSortedData(sorted);
    }
  }, [userLocation, data]);

  // Handle selection of a POI
  const handleSelect = async (d) => {
    if (!userLocation || !d.lat || !d.lng) {
      console.error("Invalid location data");
      return;
    }

    try {
      const waypoints = [
        { longitude: userLocation.lng, latitude: userLocation.lat },
        { longitude: d.lng, latitude: d.lat },
      ];

      const routeData = await getShortestRoute(waypoints);

      if (!routeData || !routeData.routes || !routeData.routes[0]) {
        console.error("Invalid route data");
        return;
      }

      addRouteLayer(
        map,
        "#A91CD8",
        routeData.routes[0].geometry.coordinates,
        "route4",
        10,
        setWaypoints,
        waypoints,
        dispatch
      );

      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        speed: 1.2,
        curve: 1.5,
        essential: true,
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <Card className="absolute z-30 top-0 w-full md:w-[400px] h-full bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#00432F] text-white">
        <CardTitle className="text-lg font-semibold capitalize">
          {data[0]?.icon}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowCategoryDetailPopup(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      {/* Show All Button and Filter Icon */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="outline"
          className="bg-[#00432F] text-white hover:bg-green-700"
        >
          Show All {data[0]?.icon}s
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowCategoryDetailPopup(false);
            setShowFilterPopup(true);
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="3 4 21 4 14 12 14 19 10 21 10 12 3 4" />
          </svg>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <ReactSearchAutocomplete
          items={data}
          onSelect={handleSelect}
          onFocus={() => {}}
          autoFocus
          formatResult={formatResult}
          className="w-full"
        />
      </div>

      {/* Category List with Scrolling */}
      <ScrollArea className="h-[calc(100%-200px)] p-4">
        {sortedData.map((d) => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                d.lat,
                d.lng
              ).toFixed(2)
            : "Loading...";

          return (
            <div
              key={d.id}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(d)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={d.iconComp} alt={d.name} />
                <AvatarFallback>{d.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 ml-4">
                <span className="font-bold">{d.name}</span>
                {d.tourism && (
                  <span className="text-sm text-gray-500">{d.tourism}</span>
                )}
                {d.opening_hours && (
                  <span className="text-sm text-red-500">{d.opening_hours}</span>
                )}
              </div>
              <span className="text-blue-500">{distance} km</span>
            </div>
          );
        })}
      </ScrollArea>
    </Card>
  );
};

export default Categories;