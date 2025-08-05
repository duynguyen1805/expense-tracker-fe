"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Smartphone, Check, Trash2, Clock } from "lucide-react";
import { Notification } from "@/lib/types";
import { api } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationsProps {
  limit?: number;
  showHeader?: boolean;
}

export default function Notifications({
  limit = 20,
  showHeader = true,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.notifications.getAll(limit);
      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await api.notifications.getUnreadCount();
      if (response.data.success) {
        setUnreadCount(response.data.data || 0);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await api.notifications.markAsRead(notificationId);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.notificationId === notificationId
              ? { ...notif, status: "READ" as const }
              : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        toast({
          title: "Success",
          description: "Notification marked as read",
        });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      const response = await api.notifications.delete(notificationId);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.notificationId !== notificationId)
        );
        // update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.notificationId === notificationId
        );
        if (deletedNotification && deletedNotification.status !== "READ") {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        toast({
          title: "Success",
          description: "Notification deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-4 w-4" />;
      case "PUSH":
        return <Smartphone className="h-4 w-4" />;
      case "IN_APP":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "SENT":
        return <Badge variant="default">Sent</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "READ":
        return <Badge variant="outline">Read</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with your financial goals
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      )}

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                You will receive notifications about your financial goals here
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.notificationId}
              className={`transition-all duration-200 ${
                notification.status === "READ"
                  ? "opacity-75"
                  : "border-primary/20 bg-primary/5"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(notification.status)}
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {notification.status !== "READ" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleMarkAsRead(notification.notificationId)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.notificationId)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
