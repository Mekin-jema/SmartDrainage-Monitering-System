import { Icon } from "@/components/ui/icon";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { useTheme } from "next-themes";

// Extended list of sponsors
const sponsors = [
  { icon: "MapPin", name: "Ethiomap Technologies" },
  { icon: "Globe", name: "Ethio GIS Hub" },
  { icon: "Navigation", name: "Addis Routes" },
  { icon: "LocateFixed", name: "Zemen GeoServices" },
  { icon: "SatelliteDish", name: "GeoTrack Ethiopia" },
  { icon: "Mountain", name: "Sheger Maps" },
  { icon: "Pin", name: "Ambalay Partner" },
  { icon: "Layers", name: "Topo Vision" },
  { icon: "Compass", name: "GeoCompass Inc." },
  { icon: "Radar", name: "RadarTech Labs" },
  { icon: "Map", name: "BlueMap Ethiopia" },
  { icon: "Activity", name: "GeoMotion Analytics" },
];

export const SponsorsSection = () => {
  const { theme } = useTheme();

  return (
    <section id="sponsors" className="max-w-[85%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-2xl font-semibold text-center mb-8 tracking-wide">
        Our Trusted Partners
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-12"
          fade
          innerClassName="gap-12"
          pauseOnHover
          speed={40}
        >
          {sponsors.map(({ icon, name }) => (
            <div
              key={name}
              className="flex items-center text-base md:text-xl font-medium transition-transform duration-300 hover:scale-105"
              aria-label={`Sponsor: ${name}`}
            >
              <Icon
                name={icon}
                size={32}
                className="mr-2"
                color={theme === "light" ? "#4A90E2" : "#fff"}
              />
              <span>{name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
