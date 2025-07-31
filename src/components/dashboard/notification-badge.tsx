"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/client";

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    
    // Refresh every 60 seconds
    const interval = setInterval(loadUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await api.notifications.getUnreadCount();
      if (response.data.success) {
        setUnreadCount(response.data.data || 0);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  );
} 