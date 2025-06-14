import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

export function NavMain({ items }) {
  const { state } = useSidebar();
  
  return (
    <SidebarGroup className="space-y-1 z-10">
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title} className="group/collapsible">
            <NavLink
              to={item.url}
              end
              className={({ isActive }) => 
                `block transition-colors duration-200 rounded-lg text-white hover:bg-primary/10 dark:hover:bg-primary/20 ${
                  isActive
                    ? "bg-primary/10 dark:bg-primary/20 text-primary font-medium border-l-4 border-primary"
                    : "text-gray-600 dark:text-gray-400"
                }`
              }
            >
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  <div className={`flex items-center ${state.collapsed ? "justify-center  py-3" : "gap-2  py-2"}`}>
                    {item.icon && (
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    )}
                    {!state.collapsed && (
                      <span className="text-sm">{item.title}</span>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </NavLink>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}