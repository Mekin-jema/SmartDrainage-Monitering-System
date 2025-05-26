import React from "react";
import { Github, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
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
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },

  // { href: "#pricing", label: "Pricing" },
  // { href: "#testimonials", label: "Testimonials" },
  { href: "#team", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

const featureList = [
  { title: "Showcase Your Value", description: "Highlight how your product solves user problems." },
  { title: "Build Trust", description: "Leverages social proof elements to establish trust and credibility." },
  { title: "Capture Leads", description: "Make your lead capture form visually appealing and strategically." },
];

const components = [
  { title: "Alert Dialog", href: "/docs/primitives/alert-dialog", description: "A modal dialog that interrupts the user." },
  { title: "Hover Card", href: "/docs/primitives/hover-card", description: "Preview content behind a link." },
  { title: "Progress", href: "/docs/primitives/progress", description: "Completion progress indicator." },
  { title: "Scroll-area", href: "/docs/primitives/scroll-area", description: "Visually or semantically separates content." },
  { title: "Tabs", href: "/docs/primitives/tabs", description: "A set of layered sections of content." },
  { title: "Tooltip", href: "/docs/primitives/tooltip", description: "Popup displays info on hover or focus." },
];


// ListItem Component (already defined)
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


  const [activeTab, setActiveTab] = React.useState("#features");
  const [hoveredTab, setHoveredTab] = React.useState(null);


  return (
    <header className="shadow-inner pl-8 bg-opacity-15 w-[90%] md:w-[70%] lg:w-[90%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-md hover:rounded-none hover:border-none flex justify-between items-center p-2 bg-card">
      <Link to="/" className="font-bold text-lg flex items-center text-transparent px-2 bg-gradient-to-r from-[#4A90E2] to-primary bg-clip-text">
        SmartDrainX
      </Link>

      {/* Mobile Menu */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu onClick={() => setIsOpen(!isOpen)} className="cursor-pointer lg:hidden" />
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
                    SmartDrainX
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
                    <a href={href} className="w-full text-left">{label}</a>
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
      <NavigationMenu className="relative hidden lg:block mx-auto justify-center ">
        <NavigationMenuList>
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card hover:bg-card text-base">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <motion.ul
                className="fixed left-[66.5px] grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[1215px] bg-card top-[71.5px] rounded-b-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {featureList.map(({ title, description }) => (
                  <motion.li
                    key={title}
                    className="rounded-md p-3 text-sm hover:bg-muted"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mb-1 font-semibold leading-none text-foreground">{title}</p>
                    <p className="line-clamp-2 text-muted-foreground">{description}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          {/* <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card text-base">Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <motion.ul
                className="fixed left-[66.5px] grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[1215px] bg-card top-[74.5px] rounded-b-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </motion.ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          {routeList.map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink asChild>
                <a
                  href={href}
                  onMouseEnter={() => setHoveredTab(href)}
                  onMouseLeave={() => setHoveredTab(null)}
                  onClick={() => setActiveTab(href)}
                  className="relative px-3 py-2 text-base text-foreground transition-all"
                >
                  {label}
                  {(hoveredTab === href || activeTab === href) && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-3 bottom-0 h-[3px] w-[70%] bg-primary"
                      transition={{ type: "spring", stiffness: 100, damping: 30 }}
                    />
                  )}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}



        </NavigationMenuList>
      </NavigationMenu>
      <Button className="hidden md:block mx-10">
        <Link to="/login">Login</Link>
      </Button>
      {/* Right Actions */}
      <div className="hidden lg:flex">
        <DarkModeToggle />
        <Button asChild size="sm" variant="ghost" aria-label="View on GitHub" className="mx-2">
          <a
            href="https://github.com/Mekin-jema/final-project-v1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-5" />
          </a>
        </Button>
      </div>

    </header>
  );
};

export default Navbar;
