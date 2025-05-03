import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link to="/" className="flex font-bold items-center">
              <ChevronsDownIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />
              <h3 className="text-2xl">SmartDrainageX</h3>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Smarter drainage management for cleaner cities.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Project Links</h3>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                GitHub Repo
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Live Demo
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Documentation
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Platforms</h3>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Mobile App
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Web Dashboard
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Sensor Network
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Resources</h3>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                FAQ
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                User Guide
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Contact Support
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Connect</h3>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                LinkedIn
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Twitter
              </Link>
            </div>
            <div>
              <Link to="#" className="opacity-60 hover:opacity-100">
                Telegram
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="text-center">
          <h3 className="text-sm text-muted-foreground">
            &copy; 2025 SmartDrainageX — Developed by
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/leoMirandaa"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Mekin & Abdu
            </a>
          </h3>
        </section>
      </div>
    </footer>
  );
};
