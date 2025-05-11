import React, { useState } from "react";

const POIFilter = ({ setShowFilterPopup, setShowCategoryDetailPopup }) => {
  const [filters, setFilters] = useState({
    openNow: false,
    open24x7: false,
    bicycle: true,
    bus: false,
    caravan: { designated: false, yes: true },
    disabled: false,
    general: false,
  });

  const [expanded, setExpanded] = useState({
    bicycle: true,
    bus: false,
    caravan: false,
    disabled: false,
    general: false,
  });

  const toggleSwitch = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCheckbox = (category, key) => {
    setFilters((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: !prev[category][key] },
    }));
  };

  const toggleExpand = (category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };
  //   className =
  // "fixed top-3 left-[120px] z-20 bg-white p-3 flex flex-col items-center font-sans w-[400px] h-full border-2 border-b-slate-400";

  return (
    <div className="fixed top-3 left-[135px] z-20 bg-white flex flex-col items-center w-full md:w-[400px] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between w-full border-b p-3 bg-[#00432F] text-white">
        <button onClick={() => setShowCategoryDetailPopup(true)}>
          <svg
            width="30"
            height="20"
            viewBox="0 0 50 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="50"
              y1="10"
              x2="5"
              y2="10"
              stroke="white"
              strokeWidth="2"
            />

            <polyline
              points="10,5 5,10 10,15"
              fill="white"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>
        <p className="text-lg font-semibold">Filters</p>
        <svg width="24" height="24" fill="white">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </div>

      {/* Search Box */}
      <div className="flex items-center p-3 border-b w-full">
        <input
          type="text"
          placeholder="Filter by name"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Toggle Switches */}
      <div className="p-3 space-y-3 border-b w-full">
        <div className="flex justify-between">
          <span>⏰ Open now</span>
          <input
            type="checkbox"
            className="toggle-checkbox"
            checked={filters.openNow}
            onChange={() => toggleSwitch("openNow")}
          />
        </div>
        <div className="flex justify-between w-full">
          <span>⏳ Open 24/7</span>
          <input
            type="checkbox"
            className="toggle-checkbox"
            checked={filters.open24x7}
            onChange={() => toggleSwitch("open24x7")}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="p-3 w-full">
        {[
          { name: "Bicycle access", key: "bicycle", icon: "🚲" },
          { name: "Bus access", key: "bus", icon: "🚌" },
          { name: "Caravan access", key: "caravan", icon: "🚐" },
          { name: "Disabled access", key: "disabled", icon: "♿" },
          { name: "General access", key: "general", icon: "📁" },
        ].map((category) => (
          <div key={category.key} className="border-b">
            {/* Category Header */}
            <div
              className="flex justify-between p-3 cursor-pointer"
              onClick={() => toggleExpand(category.key)}
            >
              <span>
                {category.icon} {category.name}
              </span>
              <span>{expanded[category.key] ? "▲" : "▼"}</span>
            </div>

            {/* Expandable Section */}
            {expanded[category.key] && (
              <div className="p-3 space-y-2">
                {category.key === "caravan" ? (
                  <>
                    <div className="flex justify-between">
                      <span>Designated</span>
                      <input
                        type="checkbox"
                        checked={filters.caravan.designated}
                        onChange={() => toggleCheckbox("caravan", "designated")}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Yes</span>
                      <input
                        type="checkbox"
                        checked={filters.caravan.yes}
                        onChange={() => toggleCheckbox("caravan", "yes")}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>{category.name}</span>
                    <input
                      type="checkbox"
                      checked={filters[category.key]}
                      onChange={() => toggleSwitch(category.key)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Filters Button */}
      <div className="p-3 w-full">
        <button
          className="w-full bg-[#00432F] text-white py-2 rounded"
          onClick={() => setShowFilterPopup(false)}
        >
          APPLY FILTERS
        </button>
      </div>
    </div>
  );
};

export default POIFilter;
