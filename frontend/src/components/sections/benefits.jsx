import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";



const benefitList = [
  {
    icon: "Map",
    title: "Map Visualization",
    description:
      "Interactively zoom, pan, and search with customizable layers for traffic, weather, and user-defined data.",
  },
  {
    icon: "MapPin",
    title: "Geocoding & Reverse Geocoding",
    description:
      "Search and convert addresses to coordinates or vice versa with auto-suggestions and accurate mapping.",
  },
  {
    icon: "Route",
    title: "Routing & Directions",
    description:
      "Plan routes with turn-by-turn navigation and real-time traffic updates to ensure optimal travel time.",
  },
  {
    icon: "Activity",
    title: "Route Optimization",
    description:
      "Solve complex delivery routing problems visually and efficiently, considering capacity and time constraints.",
  },
];


export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
        <h2 className="text-lg text-primary mb-2 tracking-wider">Services</h2>

<h2 className="text-3xl md:text-4xl font-bold mb-4">
  Empowering Smarter Navigation
</h2>

<p className="text-xl text-muted-foreground mb-8">
  From interactive maps to advanced route optimization, Ambalay Maps provides essential geospatial tools to streamline logistics, urban planning, and real-time decision-making across Ethiopia.
</p>

        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon }
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
