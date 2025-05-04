import React from "react";
import {  Github, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/pages/dashboard/navbar/toggle-theme";

const routeList = [
  { href: "#features", label: "Features" },
  { href: "#team", label: "About" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
];

const featureList = [
  {
    title: "Showcase Your Value",
    description: "Highlight how your product solves user problems.",
  },
  {
    title: "Build Trust",
    description:
      "Leverages social proof elements to establish trust and credibility.",
  },
  {
    title: "Capture Leads",
    description:
      "Make your lead capture form visually appealing and strategically.",
  },
];

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

// Add this inside the same file (or import it if it's moved elsewhere)
const ListItem = ({ title, href, children }) => {
  return (
    <li>
      <a
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </a>
    </li>
  );
};


const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[80%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link to="/" className="font-bold text-lg flex items-center">
        {/* <img
          src="/logo.svg"
          alt="Logo"
          className="border-secondary rounded-lg w-9 h-9 mr-2 border"
        /> */}
          SmartDrainX
      </Link>

      {/* Mobile Menu */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link to="/" className="flex items-center">
                    <img
                      src="/logo.svg"
                      alt="Logo"
                      className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white"
                    />
                    Ambalay Maps
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <a href={href} className="w-full text-left">
                      {label}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <DarkModeToggle />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>


      {/* Desktop Navigation */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card text-base">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[1000px]">
                <ul className="flex flex-col gap-2">
                  {featureList.map(({ title, description }) => (
                    <li
                      key={title}
                      className="rounded-md p-3 text-sm hover:bg-muted"
                    >
                      <p className="mb-1 font-semibold leading-none text-foreground">
                        {title}
                      </p>
                      <p className="line-clamp-2 text-muted-foreground">
                        {description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[1000px] ">
              {components.map((component) => (
                <ListItem
                
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

          {routeList.map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink asChild>
                <a href={href} className="text-base px-2">
                  {label}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Actions */}
      <div className="hidden lg:flex">
        <DarkModeToggle />
        <Button asChild size="sm" variant="ghost" aria-label="View on GitHub" className="mx-2" >
          <a
            href="https://github.com/nobruf/shadcn-landing-page.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-5" />
          </a>
        </Button>
      </div>
      <Button className="hidden md:block mx-10">
      <Link to="/login">
       Login
      </Link>
      </Button> 
    </header>
  );
};

export default Navbar;




