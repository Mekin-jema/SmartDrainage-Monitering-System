import { NavMain } from "@/pages/dashboard/main-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./navbar/nav-user";
import { useSidebar } from "@/components/ui/sidebar";
import { Command } from "lucide-react";
import { getSidebarData } from "./constants/sidebar-data";
import { useUserStore } from "@/store/useUserStore";

export function AppSidebar({ ...props }) {
  const { state, isMobile } = useSidebar();
  const { user } = useUserStore(); // ✅ get the current user
  const sidebarData = getSidebarData(user); // ✅ dynamically generate sidebar items

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={`mx-3 mt-3 ${
        isMobile ? "bg-green-800" : "bg-inherit"
      } text-white rounded-xl border-gray-400 border-2 ${
        state.collapsed ? "w-28" : "w-64"
      }`}
    >
      <SidebarHeader className="flex items-center justify-between px-7 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SmartDrainX</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

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
