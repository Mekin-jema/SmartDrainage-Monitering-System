import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const PopularPlan = {
  NO: 0,
  YES: 1,
};

const plans = [
  {
    title: "Basic",
    popular: 0,
    price: 0,
    description:
      "Get started with basic monitoring and notifications for your sewage system.",
    buttonText: "Start for Free",
    benefitList: [
      "1 monitoring station",
      "Basic alert system",
      "Mobile notifications",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    title: "Advanced",
    popular: 1,
    price: 49,
    description:
      "Access advanced features including real-time data tracking and more detailed insights.",
    buttonText: "Get Started",
    benefitList: [
      "5 monitoring stations",
      "Advanced alert system",
      "Web and mobile dashboard",
      "Priority support",
      "Detailed analytics & reports",
      "Integration with third-party sensors",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 150,
    description:
      "For large-scale operations with multiple monitoring stations and full integration support.",
    buttonText: "Contact Us",
    benefitList: [
      "Unlimited monitoring stations",
      "Customizable alerts and reports",
      "24/7 dedicated support",
      "Custom integration & API access",
      "Full analytics dashboard",
      "Data export capabilities",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="container py-24 sm:py-32 md:max-w-[90%] mx-auto">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Choose the plan that fits your needs
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Monitor and manage your sewage system efficiently with SmartDrainageX.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={popular === PopularPlan.YES ? "default" : "secondary"}
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
