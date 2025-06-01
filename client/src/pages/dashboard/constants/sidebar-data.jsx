import {
  LayoutGrid,
  MapPinned,
  AlertCircle,
  Users,
  ClipboardCheck,
  Wrench,
  BookOpen,
  Settings,
  ActivitySquare,
  MapPin,
} from "lucide-react";

// 🔁 Function that returns data based on user role
export const getSidebarData = (user) => {
  const isWorker = user?.role === "worker";

  const baseUser = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.avatar || "/avatars/default.jpg",
  };

  // Worker: Only Assignment page
  if (isWorker) {
    return {
      user: baseUser,
      navMain: [
        {
          title: "Smart Sewage System",
          items: [
            {
              title: "Assignments",
              url: "/dashboard/worker-dashboard",
              icon: Users,
            },
            {
              title: "Profile",
              url: "/dashboard/profile",
              icon: Users,
            },
          ],
        },
      ],
    };
  }

  // Admin or others: Full menu
  return {
    user: baseUser,
    navMain: [
      {
        title: "Smart Sewage System",
        items: [
          {
            title: "Analytics Dashboard",
            url: "/dashboard",
            icon: LayoutGrid,
          },
          {
            title: "Live Sensor Data",
            url: "/dashboard/sensor-readings",
            icon: ActivitySquare,
          },
          {
            title: "Manholes",
            url: "/dashboard/manholes",
            icon: MapPinned,
          },
          {
            title: "Alerts & Incidents",
            url: "/dashboard/alerts",
            icon: AlertCircle,
          },
          {
            title: "Workers & Users",
            url: "/dashboard/users",
            icon: Users,
          },
          // {
          //   title: "Map",
          //   url: "/dashboard/map",
          //   icon: MapPin,
          // },
          {
            title: "Maintenance Logs",
            url: "/dashboard/maintenance",
            icon: ClipboardCheck,
          },

          {
            title: "Admin Controls",
            url: "/dashboard/admin-dashboard",
            icon: Users,
          },
          {
            title: "System Settings",
            url: "/dashboard/settings",
            icon: Settings,
          },
          {
            title: "Support & Docs",
            url: "/dashboard/docs",
            icon: BookOpen,
          },
          {
            title: "Profile",
            url: "/dashboard/profile",
            icon: Users,
          },
        ],
      },
    ],
  };
};
