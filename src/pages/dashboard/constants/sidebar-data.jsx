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
} from "lucide-react";

export const sidebarData = {
  user: {
    name: "Mekin Jemal",
    email: "mekinjemal999@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Smart Sewage System",
      items: [
        {
          title: "Dashboard",
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
        {
          title: "Maintenance Logs",
          url: "/dashboard/maintenance",
          icon: ClipboardCheck,
        },
        {
          title: "Repairs & Inspection",
          url: "/dashboard/repairs",
          icon: Wrench,
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
      ],
    },
  ],
};
