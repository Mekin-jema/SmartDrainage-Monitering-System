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
  const { user } = useUserStore();
  const sidebarData = getSidebarData(user);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={`mx-3 mt-3 ${isMobile
          ? "bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))]"
          : "bg-[hsl(var(--card))] dark:bg-[hsl(var(--popover))]"
        } text-foreground rounded-xl border-border border ${state.collapsed ? "w-20" : "w-64"
        } transition-all duration-300 shadow-light dark:shadow-dark bg-foreground/90  `}
    >
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className={`flex ${state.collapsed ? "justify-center" : "justify-start"}`}
            >
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                {!state.collapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold text-white">SmartDrainX</span>
                    <span className="truncate text-xs text-white">Enterprise</span>
                  </div>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={sidebarData.navMain[0].items}
          className={state.collapsed ? "items-center" : ""}
        />
      </SidebarContent>

      <SidebarFooter className="mb-3 px-2">
        <NavUser
          user={sidebarData.user}
          collapsed={state.collapsed}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}