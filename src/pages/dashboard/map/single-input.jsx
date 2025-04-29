import React, { useState } from "react";
import { MdSearch, MdClose, MdDirections } from "react-icons/md"; // Google Maps-like icons
import getPlaces from "./api/getPlaces"
import maplibregl from "maplibre-gl";

export default function GeocodingInput({ map, setToggleGeocoding }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const queryPlaces = async (query) => {
    if (query) {
      const res = await getPlaces(query);
      if (res ) {
        setSuggestions(res);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    queryPlaces(value);
  };

  const handleSelectSuggestion = (suggestion) => {
  const {lat,lon,name,display_name} = suggestion;
    if (!map) return;
    if (map.currentMarker) {
      map.currentMarker.remove();
    }

    const marker = new maplibregl.Marker({ color: "#4285F4", draggable: true })
      .setLngLat([lon, lat])
      .setPopup(new maplibregl.Popup().setHTML(name))
      .addTo(map);

    map.currentMarker = marker;

    map.flyTo({ center: [lon, lat], essential: true });

    setSuggestions([]);
    setInputValue(display_name);
  };

  return (
    <div className="relative p-2 w-[392px] flex items-center gap-1 ">
      <div className="relative sm:w-full w-[350px]">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search Ambalay Maps"
          className="w-full py-3 shadow-xl mt-3  font-sora border-[1px] border-green-800 pl-5 pr-12   rounded-full  text-black focus:outline-none transition-all"
        />

        
        <MdDirections
          className="absolute right-3 top-9 transform -translate-y-1/2 text-[#0B57D0] cursor-pointer"
          size={24}
          onClick={() => setToggleGeocoding(true)}
        />

        {suggestions.length > 0 && (
          <ul className="absolute left-0 w-[99.999%] bg-white shadow-lg z-0 rounded-t-xl">
            {suggestions.map((suggestion, idx) => (
            
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
