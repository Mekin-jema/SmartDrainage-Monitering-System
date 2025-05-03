import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CommunitySection = () => {
  return (
    <section id="community" className="py-12">
      <hr className="border-secondary" />
      <div className="container py-20 sm:py-20">
        <div className="lg:w-[60%] mx-auto">
          <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl font-bold flex flex-col items-center">
                <DiscordIcon />
                <div>
                  Be Part of the
                  <span className="text-transparent pl-2 bg-gradient-to-r from-[#2DD4BF] to-primary bg-clip-text">
                    SmartDrainX Movement
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="lg:w-[80%] text-xl text-muted-foreground">
              Connect with developers, urban planners, and IoT innovators tackling real-world drainage issues across Ethiopia. Collaborate, learn, and build smarter cities — together.
            </CardContent>

            <CardFooter>
              <Button asChild>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
                  Join the Community
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};
