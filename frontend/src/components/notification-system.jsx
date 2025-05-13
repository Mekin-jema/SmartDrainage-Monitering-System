import React from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationSystem() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      message: "High water level detected in Manhole #12",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "maintenance",
      message: "Scheduled maintenance for Manhole #07",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "system",
      message: "System update completed successfully",
      timestamp: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={`p-4 ${!notification.read ? "bg-muted/50" : ""}`}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {notification.timestamp}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 