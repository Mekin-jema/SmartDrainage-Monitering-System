import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const featureList = [
  {
    icon: "SatelliteDish",
    title: "Real-Time Monitoring",
    description:
      "Continuously observes sewage levels and toxic gas concentrations through IoT sensors embedded in manholes, reducing overflow risks and promoting public health.",
  },
  {
    icon: "MapPin",
    title: "Location-Based Alerts",
    description:
      "Dynamically dispatches the nearest available sewage personnel by analyzing GPS coordinates and prioritizing alerts based on severity and proximity.",
  },

  {
    icon: "BellRing",
    title: "Automated Notifications",
    description:
      "Sends real-time alerts to responsible workers when critical conditions, such as gas leaks or overflow risks, are detected.",
  },

  {
    icon: "LayoutDashboard",
    title: "Centralized Admin Dashboard",
    description:
      "Provides a unified interface for administrators to monitor sensor data, manage field workers, review reports, and oversee the entire sewage infrastructure.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 md:max-w-[90%] mx-auto">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Key Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Smart Sewage Monitoring System
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Our final-year project integrates IoT, machine learning, and cloud-based dashboards to modernize urban drainage systems and improve environmental safety through intelligent monitoring and proactive response.
      </h3>

      <div className="grid sm:grid-cols-2 md:max-w-[1000px] mx-auto">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-left text-wrap " >
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
