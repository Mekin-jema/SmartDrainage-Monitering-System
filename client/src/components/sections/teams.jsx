import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export const TeamSection = () => {
  const teamList = [
    {
      imageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
      , // Mekin Jemal
      firstName: "Mekin",
      lastName: "Jemal",
      positions: ["Frontend Developer", "Project Manager"],
      socialNetworks: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/mekin-jemal/" },
        { name: "Github", url: "https://github.com/mekinjemal" },
      ],
    },
    {
      imageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",


      firstName: "Abdu",
      lastName: "Seid",
      positions: ["Backend Developer", "Hardware Specialist"],
      socialNetworks: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/abdu-seid/" },
        { name: "Github", url: "https://github.com/abdu-seid" },
      ],
    },
    {
      imageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
      firstName: "Getachew",
      lastName: "Tesheome",
      positions: ["Our Advisor", " Senior Embedded System Engineer"],
      socialNetworks: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/getachew-tesheome/" },
      ],
    },
  ];

  const getSocialIcon = (name) => {
    switch (name) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
      default:
        return null;
    }
  };

  return (
    <section id="team" className="container mx-auto py-24 sm:py-32 lg:w-[75%] md:max-w-full">
      <div className="text-center mb-10">
        <h2 className="text-lg text-primary tracking-wider mb-2">Team</h2>
        <h2 className="text-3xl md:text-4xl font-bold">Members of the Project</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 h-96">
        {teamList.map(({ imageUrl, firstName, lastName, positions, socialNetworks }, index) => (
          <Card
            key={index}
            className="flex flex-col bg-muted/60 dark:bg-card overflow-hidden group"
          >
            <CardHeader className="p-0">
              <div className="overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`${firstName} ${lastName}`}
                  loading="lazy"
                  className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-in-out group-hover:saturate-100 h-[200px] group-hover:scale-[1.02]"
                />
              </div>
              <CardTitle className="px-6 pt-6 text-lg font-semibold">
                {firstName}
                <span className="text-primary ml-2">{lastName}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-4 space-y-1 text-muted-foreground">
              {positions.map((position, idx) => (
                <div key={idx}>{position}</div>
              ))}
            </CardContent>

            <CardFooter className="px-6 pb-6 mt-auto space-x-4">
              {socialNetworks.map(({ name, url }, i) => (
                <Link
                  key={i}
                  to={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  {getSocialIcon(name)}
                </Link>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
