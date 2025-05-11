"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

// interface ReviewProps {
//   image: string;
//   name: string;
//   userName: string;
//   comment: string;
//   rating: number;
// }

const reviewList = [
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe",
    userName: "Product Manager",
    comment:
      "The smart sewage monitoring system has improved our operations significantly. The real-time data collection and AI-driven predictions help us manage sewage overflow and maintenance effectively.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Sophia Collins",
    userName: "Cybersecurity Analyst",
    comment:
      "The IoT integration in the sewage system has been a game-changer. It's impressive how the system detects gas leaks and overflow, ensuring safety and efficiency.",
    rating: 4.8,
  },

  {
    image: "https://github.com/shadcn.png",
    name: "Adam Johnson",
    userName: "Chief Technology Officer",
    comment:
      "We've integrated the sewage monitoring system into our infrastructure with ease. The data analysis and reporting capabilities are exactly what we needed for proactive maintenance.",
    rating: 4.9,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Ethan Parker",
    userName: "Data Scientist",
    comment:
      "The machine learning features in the smart sewage monitoring system have been incredible. They allow us to predict gas levels and overflow events, helping us to prevent issues before they arise.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Ava Mitchell",
    userName: "IT Project Manager",
    comment:
      "As a project manager, I love how this system simplifies maintenance planning. The real-time feedback and worker assignment features have streamlined our workflow.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Isabella Reed",
    userName: "DevOps Engineer",
    comment:
      "The cloud integration and data management are seamless. It's been a great experience working with this system for our sewage monitoring needs.",
    rating: 4.9,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Hear What Our Clients Are Saying
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl h-full   mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3 "
            >
              <Card className="bg-muted/50 dark:bg-card md: min-h-[260px]">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.image}
                        alt={review.name}
                      />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
