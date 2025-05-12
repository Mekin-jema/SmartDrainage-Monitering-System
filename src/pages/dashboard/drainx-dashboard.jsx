import { AppSidebar } from "@/pages/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/search-context";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function DashboardMainPage() {
  return (
    <SidebarProvider className=" p-3 dark:pt-1 font-sora ">
      <SearchProvider className="">
        <AppSidebar />
        <SidebarInset className="ml-3  ">
          <div className=" rounded-xl mt-2 dark:border-gray-700 border-2 sticky ">
            <Header />
            <Outlet />
          </div>
        </SidebarInset>
      </SearchProvider>
    </SidebarProvider>
  );
}
