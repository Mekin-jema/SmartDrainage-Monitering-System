import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

export function NavMain({ items }) {
  return (
    <SidebarGroup className=" ">
   
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title} className="group/collapsible">
            <NavLink
              to={item.url}
              end
              className={({ isActive }) =>
                `block  transition-colors duration-200 rounded-[8px]  hover:bg-[#dab3e2] hover:text-gray-300 ${
                  isActive
                    ? "bg-[#D19EDB]  "
                    : ""
                }`
              }
            >
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </NavLink>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
