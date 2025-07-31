"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Smartphone, Settings } from "lucide-react";
import { NotificationPreferences } from "@/lib/types";
import { api } from "@/lib/api/client";
import Link from "next/link";

export default function NotificationSummary() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await api.user.getNotificationPreferences();
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-gray-500">Failed to load notification settings</p>
        </CardContent>
      </Card>
    );
  }

  const enabledChannels = [
    preferences.email ? "Email" : null,
    preferences.push ? "Push" : null,
  ].filter((channel): channel is string => channel !== null);

  const enabledTypes = [
    preferences.budgetAlerts ? "Budget Alerts" : null,
    preferences.goalReminders ? "Goal Reminders" : null,
    preferences.expenseAlerts ? "Expense Alerts" : null,
    preferences.incomeAlerts ? "Income Alerts" : null,
    preferences.weeklyReports ? "Weekly Reports" : null,
    preferences.monthlyReports ? "Monthly Reports" : null,
    preferences.achievementCelebrations ? "Achievements" : null,
    preferences.systemUpdates ? "System Updates" : null,
  ].filter((type): type is string => type !== null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Notification Settings</CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </div>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Notification Channels</h4>
            <div className="flex flex-wrap gap-2">
              {enabledChannels.length > 0 ? (
                enabledChannels.map((channel) => (
                  <Badge key={channel} variant="secondary" className="text-xs">
                    {channel}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No channels enabled</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Active Notifications</h4>
            <div className="flex flex-wrap gap-2">
              {enabledTypes.length > 0 ? (
                enabledTypes.slice(0, 3).map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No notifications enabled</span>
              )}
              {enabledTypes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{enabledTypes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-muted-foreground">
            {enabledTypes.length} of 8 notification types enabled
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/settings?tab=notifications">
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 