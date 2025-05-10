import { Separator } from "../../components/ui/separator";

import { NavUser } from "./navbar/header-user";
import { DarkModeToggle } from "./navbar/toggle-theme";
import { SidebarTrigger } from "../../components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import SearchInput from "./navbar/search-input";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link to="/dashboard">
                <BreadcrumbLink>Dashboard</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="flex justify-end ">
              {/* <BreadcrumbPage></BreadcrumbPage> */}
              {/* <DarkModeToggle /> */}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <div className="border-none">
          <DarkModeToggle />
        </div>
        <NavUser />
      </div>
    </header>
  );
}
