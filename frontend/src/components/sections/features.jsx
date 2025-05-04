import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
// import { icons } from "lucide-react";

// interface FeaturesProps {
//   icon: string;
//   title: string;
//   description: string;
// }

const featureList
// : FeaturesProps[] 
=  [
  {
    icon: "SatelliteDish",
    title: "Real-Time Monitoring",
    description:
      "Continuously tracks sewage levels and gas concentrations in manholes using IoT sensors to prevent overflows and health hazards.",
  },
  {
    icon: "MapPin",
    title: "Location-Based Alerts",
    description:
      "Automatically assigns tasks to nearby sewage workers based on GPS data and the severity of the detected issue.",
  },
  {
    icon: "QrCode",
    title: "QR-Based Feedback System",
    description:
      "Each manhole includes a QR code enabling citizens to easily report issues, helping authorities prioritize maintenance.",
  },
  {
    icon: "BellRing",
    title: "Automated Alerts",
    description:
      "Instant notifications are sent to responsible personnel when dangerous gas levels or overflows are detected.",
  },
  {
    icon: "BrainCircuit",
    title: "AI-Powered Insights",
    description:
      "Machine learning algorithms predict overflow risks and filter out irrelevant or spam feedback automatically.",
  },
  {
    icon: "LayoutDashboard",
    title: "Central Dashboard",
    description:
      "A responsive admin dashboard provides live sensor data, feedback management, worker coordination, and performance reports.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 md:max-w-[90%] mx-auto">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What Makes Us Different
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem
        fugiat, odit similique quasi sint reiciendis quidem iure veritatis optio
        facere tenetur.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon 
                      // as keyof typeof icons
                    }
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
