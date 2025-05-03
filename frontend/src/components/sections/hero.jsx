import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, []);

  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> SmartDrainX is live! </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Revolutionize city sanitation with
              <span className="text-transparent px-2 bg-gradient-to-r from-[#4A90E2] to-primary bg-clip-text">
                SmartDrainX
              </span>
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Monitor manholes in real time, detect toxic gas or overflow, and
            assign workers efficiently — all from a smart dashboard powered by
            IoT and AI. Build cleaner, safer cities with data-driven drainage
            management.
          </p>

          <div className="flex justify-center items-center gap-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
              Try It Now
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <a
                href="https://github.com/your-username/smartdrainx"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <img
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative border border-t-2 border-secondary border-t-primary/30"
            src={theme === "light" ? "/light.png" : "/dark.png"}
            alt="SmartDrainX Dashboard"
          />
          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
