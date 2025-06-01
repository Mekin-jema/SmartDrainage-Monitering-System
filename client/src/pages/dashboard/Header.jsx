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
import NotificationBell from "./assignments/notification-bell";

export default function Header() {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
        {/* <NavUser /> */}

        {/* // Usage in your header: */}
        <div className=" flex items-center space-x-4 top-0 right-0 p-4">
          <NotificationBell />
          {/* User Avatar or other header elements can go here */}
        </div>
      </div>
    </header>
  );
}
