"use client";

import { Icon } from "@/components/ui/icon";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { icons } from "lucide-react";
import { useTheme } from "next-themes";

// Defining the list of sponsors with their icons and names
const sponsors = [
  {
    icon: "MapPin",
    name: "Ethiomap Technologies",
  },
  {
    icon: "Globe",
    name: "Ethio GIS Hub",
  },
  {
    icon: "Navigation",
    name: "Addis Routes",
  },
  {
    icon: "LocateFixed",
    name: "Zemen GeoServices",
  },
  {
    icon: "SatelliteDish",
    name: "GeoTrack Ethiopia",
  },
  {
    icon: "Mountain",
    name: "Sheger Maps",
  },
  {
    icon: "Pin",
    name: "Ambalay Partner",
  },
];

export const SponsorsSection = () => {
  const { theme } = useTheme();
  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6">
        የአምባላይ ማፕ አገልግሎት ዋና መስራች እና አጋሮች (Ambalay Map Service Partners)
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >
          {sponsors.map(({ icon, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              <Icon
                name={icon} // Type casting to match the Lucide icon names
                size={32}
                className="mr-2"
                color={`${theme === "light" ? "#4A90E2" : "#fff"}`}
              />
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
