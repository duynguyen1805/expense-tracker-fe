"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  Smartphone,
  Target,
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
  Trophy,
  Settings,
  RefreshCw,
  Save,
} from "lucide-react";
import { NotificationPreferences } from "@/lib/types";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";

export default function NotificationPreferencesComponent() {
  const {
    preferences,
    isLoading,
    isSaving,
    updatePreferences,
    resetPreferences,
    togglePreference,
  } = useNotificationPreferences();
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    togglePreference(key);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!preferences) return;

    const success = await updatePreferences({
      email: preferences.email,
      push: preferences.push,
      budgetAlerts: preferences.budgetAlerts,
      goalReminders: preferences.goalReminders,
      expenseAlerts: preferences.expenseAlerts,
      incomeAlerts: preferences.incomeAlerts,
      weeklyReports: preferences.weeklyReports,
      monthlyReports: preferences.monthlyReports,
      achievementCelebrations: preferences.achievementCelebrations,
      systemUpdates: preferences.systemUpdates,
    });

    if (success) {
      setHasChanges(false);
    }
  };

  const handleReset = async () => {
    const success = await resetPreferences();
    if (success) {
      setHasChanges(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "push":
        return <Smartphone className="h-4 w-4" />;
      case "budgetAlerts":
        return <Target className="h-4 w-4" />;
      case "goalReminders":
        return <Target className="h-4 w-4" />;
      case "expenseAlerts":
        return <TrendingDown className="h-4 w-4" />;
      case "incomeAlerts":
        return <TrendingUp className="h-4 w-4" />;
      case "weeklyReports":
        return <FileText className="h-4 w-4" />;
      case "monthlyReports":
        return <Calendar className="h-4 w-4" />;
      case "achievementCelebrations":
        return <Trophy className="h-4 w-4" />;
      case "systemUpdates":
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationDescription = (type: string) => {
    switch (type) {
      case "email":
        return "Receive notifications via email";
      case "push":
        return "Receive push notifications on mobile";
      case "budgetAlerts":
        return "Get alerts when you exceed budget limits";
      case "goalReminders":
        return "Get reminders about your financial goals";
      case "expenseAlerts":
        return "Get notified when new expenses are added";
      case "incomeAlerts":
        return "Get notified when new income is recorded";
      case "weeklyReports":
        return "Receive weekly financial summaries";
      case "monthlyReports":
        return "Receive monthly financial reports";
      case "achievementCelebrations":
        return "Get congratulatory messages for achievements";
      case "systemUpdates":
        return "Receive system maintenance and update notices";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-gray-500">
            Failed to load notification preferences
          </p>
        </CardContent>
      </Card>
    );
  }

  const notificationTypes = [
    { key: "email", label: "Email Notifications" },
    { key: "push", label: "Push Notifications" },
    { key: "budgetAlerts", label: "Budget Alerts" },
    { key: "goalReminders", label: "Goal Reminders" },
    { key: "expenseAlerts", label: "Expense Alerts" },
    { key: "incomeAlerts", label: "Income Alerts" },
    { key: "weeklyReports", label: "Weekly Reports" },
    { key: "monthlyReports", label: "Monthly Reports" },
    { key: "achievementCelebrations", label: "Achievement Celebrations" },
    { key: "systemUpdates", label: "System Updates" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Customize how you receive notifications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notificationTypes.map(({ key, label }) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-muted-foreground">
                    {getNotificationIcon(key)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={key} className="font-medium">
                        {label}
                      </Label>
                      {preferences[key as keyof NotificationPreferences] && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={
                    preferences[key as keyof NotificationPreferences] as boolean
                  }
                  onCheckedChange={() =>
                    handleToggle(key as keyof NotificationPreferences)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Badge variant={preferences.email ? "default" : "secondary"}>
                {preferences.email ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on mobile
                  </p>
                </div>
              </div>
              <Badge variant={preferences.push ? "default" : "secondary"}>
                {preferences.push ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
