/**
 * AddressInput Component
 *
 * This component provides an input field for entering addresses with the following features:
 * - Autocomplete suggestions for addresses using the `getPlaces` API.
 * - Integration with Redux for managing waypoints.
 * - Icons for start and end points.
 * - Ability to clear the input or delete the waypoint.
 *
 * Dependencies:
 * - React hooks for state and lifecycle management.
 * - Redux for state management.
 * - `getPlaces` API for fetching address suggestions.
 * - Icons from `lucide-react` and local assets.
 */

import React, { useState, useEffect } from "react"; // React hooks
import { X } from "lucide-react"; // Icon for clearing input
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { setOpen, setWaypoints } from "../../../Redux/MapSlice"; // Redux actions
import start from "../../../assets/POI/start.svg"; // Icon for start point
import end from "../../../assets/POI/end.svg"; // Icon for end point
import { getOptimizedRouteWithStops, getPlaces } from "./api";

/**
 * AddressInput Component
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setAddress - Function to update the address in the parent component.
 * @param {string} props.placeholder - Placeholder text for the input field.
 * @param {number} props.index - Index of the waypoint in the list.
 * @param {string} props.location - Current location value for the input field.
 * @returns {JSX.Element} - The rendered component.
 */
export default function AddressInput({
  setAddress,
  placeholder,
  index,
  location,

}) {
  const [suggestions, setSuggestions] = useState([]); // State for address suggestions
  const [inputValue, setInputValue] = useState(location || ""); // State for input value
  const { waypoints } = useSelector((state) => state.map); // Waypoints from Redux store
  const dispatch = useDispatch(); // Redux dispatch function

  // Sync inputValue with the location prop
  useEffect(() => {
    setInputValue(location || "");
  }, [location]);

  /**
   * Fetch address suggestions based on user input.
   * @param {string} query - The search query entered by the user.
   */
  const queryPlaces = async (query) => {
    if (query) {
      const res = await getPlaces(query);
      if (res) {
        setSuggestions(res);
      }
    }
  };

  /**
   * Handle deletion of the current waypoint.
   */
  const handleDeleteInput = async() => {
    const updatedWaypoints = waypoints.filter((waypoint, i) => i !== index);
    dispatch(setWaypoints(updatedWaypoints));


          
    
  };

  /**
   * Handle changes in the input field.
   * @param {Object} event - The input change event.
   */
  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    queryPlaces(value); // Fetch suggestions
  };

  /**
   * Handle selection of an address suggestion.
   * @param {Object} suggestion - The selected suggestion object.
   * @param {string} suggestion.place_name - The name of the place.
   * @param {number[]} suggestion.center - The coordinates of the place.
   */
  const handleSelectSuggestion = (suggestion) => {
  const {lat,lon,name,display_name} = suggestion;



  const address = {
    placeName: display_name,
    longitude: lon,
    latitude: lat,
  };
  setAddress(address); // Update parent state
  

    setSuggestions([]);
    setInputValue(display_name);
  };

const handleClearInput = () => {
  setInputValue("");
  setSuggestions([]);
  const updatedWaypoints = [...waypoints];
  updatedWaypoints[index] = {
    placeName: "",
    longitude: null,
    latitude: null,
  };
  dispatch(setWaypoints(updatedWaypoints))
  addUpdatedValhalla(map, valhallaRoute,waypoints,dispatch,profile);    



}
  return (
    <div className="relative p-2 w-full flex items-center gap-1 ml-[30px] group">
      {/* Start or End Icon */}
      {index === 0 ? (
        <img src={start} alt="start icon" className="w-4 pb-2 pr-1" />
      ) : (
        <img src={end} alt="end icon" className="w-4 pb-2 pr-1" />
      )}

      {/* Circular marker and dotted line */}
      {index < waypoints.length - 1 && (
        <div className="absolute w-[50%] top-2/3 left-[3%] h-8 border-l-4 border-dotted border-[#A91CD8] py-2"></div>
      )}

      {/* Input Field and Suggestions */}
      <div className="relative w-[300px] ml-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-[280px] py-2 pl-5 pr-8 border rounded-[9px] font-sora text-gray-700 text-[15px] dark:text-black border-[#A91CD8]"
        />

        {/* Clear Input Button */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClearInput}
            className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute left-0 w-[99.999%] z-50 bg-white shadow-lg rounded-t-xl">
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

      {/* Delete Waypoint Button */}
      {waypoints.length > 2 && (
        <button
          type="button"
          onClick={handleDeleteInput}
          className="rounded-full p-1 ml-1 flex items-center justify-center border-2 font-bold border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
  
}
