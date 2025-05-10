import { AppSidebar } from "@/pages/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/search-context";
import { Outlet, useLocation } from "react-router-dom";
import { DarkModeToggle } from "./navbar/toggle-theme";
import Header from "./Header";

// const topNav = [
//   {
//     title: "Overview",
//     href: "/",
//     disabled: false,
//   },
//   {
//     title: "Customers",
//     href: "/customers",
//     disabled: true,
//   },
//   {
//     title: "Products",
//     href: "/products",
//     disabled: true,
//   },
//   {
//     title: "Settings",
//     href: "/settings",
//     disabled: true,
//   },
// ];

export default function DashboardMainPage() {
  return (
    <SidebarProvider className=" p-3 dark:pt-1 font-sora ">
      <SearchProvider className>
        <AppSidebar />
        <SidebarInset className="ml-3  ">
          {/* <Header /> */}

          {/* <newHeader /> */}
          <div className=" rounded-xl mt-2 dark:border-gray-700 ">
            <Header />
            <Outlet />
          </div>
        </SidebarInset>
      </SearchProvider>
    </SidebarProvider>
  );
}
