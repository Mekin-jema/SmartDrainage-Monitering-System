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
          title: "Map",
          url: "/dashboard/map",
          icon: MapPin,
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
          title: "Assignments",
          url: "dashboard/worker-dashboard",
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
      ],
    },
  ],
};
