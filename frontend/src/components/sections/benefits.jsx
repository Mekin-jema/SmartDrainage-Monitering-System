// app/components/BenefitsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const benefitList = [
  {
    icon: "Activity",
    title: "Real-Time Monitoring",
    description:
      "Continuously track manhole status across the city using level and gas sensors for instant insights.",
  },
  {
    icon: "AlertTriangle",
    title: "Toxic Gas & Overflow Alerts",
    description:
      "Automatically detect hazardous gas concentrations or overflow levels and trigger immediate warnings.",
  },
  {
    icon: "Users",
    title: "Smart Worker Assignment",
    description:
      "Assign the nearest available worker based on GPS and task priority to resolve issues efficiently.",
  },
  {
    icon: "BarChart3",
    title: "Analytics & Reporting",
    description:
      "Visualize trends, generate reports, and support data-driven planning for improved sanitation systems.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32 md:max-w-[90%] mx-auto">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Key Features</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empowering Smarter Urban Drainage
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            SmartDrainX transforms drainage management with IoT-powered sensors, automated alerts, and intelligent worker coordination — enabling municipalities to build cleaner, safer, and more responsive urban environments.
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
                    name={icon}
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
