import { NavMain } from "@/pages/dashboard/main-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./navbar/nav-user";
import { sidebarData } from "./constants/sidebar-data";
import logo from "../../assets/Logo123.png";
import { useSidebar } from "@/components/ui/sidebar"; // Ensure this path is correct

export function AppSidebar({ ...props }) {
  const { state } = useSidebar(); // Get sidebar state (expanded or collapsed)
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className=" text-white mx-3 mt-3   rounded-xl border-gray-400 border-2"
    >
      {/* Conditionally render logo only when sidebar is expanded */}
      {state !== "collapsed" ? (
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="logo image"
            className="mt-2 w-[98.3px] h-[50.05px]"
          />
        </div>
      ) : (
        <span className="h-[86px]"></span>
      )}

      <SidebarContent>
        <NavMain items={sidebarData.navMain[0].items} />
      </SidebarContent>
      <SidebarFooter className="mb-3">
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
