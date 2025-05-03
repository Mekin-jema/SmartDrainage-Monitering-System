import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProService = {
  YES: 1,
  NO: 0,
};

const serviceList = [
  {
    title: "Real-Time Sewage Monitoring",
    description:
      "Monitor the health of your sewage system in real-time with up-to-date data, ensuring early detection of potential issues.",
    pro: 0,
  },
  {
    title: "Data Analytics & Reporting",
    description:
      "Gain valuable insights with our powerful analytics tool that tracks sewage system performance and provides actionable reports.",
    pro: 0,
  },
  {
    title: "Custom Alerts & Notifications",
    description:
      "Set up customized alerts for overflow or toxic gas levels to ensure quick responses to critical issues.",
    pro: 1,
  },
  {
    title: "Advanced Sensor Integration",
    description:
      "Integrate a variety of sensors (e.g., pH, gas, and level) to collect comprehensive data across your sewage infrastructure.",
    pro: 1,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32 md:max-w-full mx-auto">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Services
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Manage Your Sewage System with Ease
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        From real-time monitoring to advanced analytics, our services ensure a streamlined and efficient sewage management experience.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
