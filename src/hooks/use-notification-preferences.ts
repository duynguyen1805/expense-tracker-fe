import { useState, useEffect, useCallback } from "react";
import {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from "@/lib/types";
import { api } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";

export function useNotificationPreferences() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.user.getNotificationPreferences();
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [preferences, toast]);

  const updatePreferences = async (
    updateData: UpdateNotificationPreferencesRequest
  ) => {
    try {
      setIsSaving(true);
      const response = await api.user.updateNotificationPreferences(updateData);
      if (response.data.success) {
        setPreferences(response.data.data);
        toast({
          title: "Success",
          description: "Notification preferences updated successfully",
        });
        return true;
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetPreferences = async () => {
    try {
      setIsSaving(true);
      const response = await api.user.resetNotificationPreferences();
      if (response.data.success) {
        setPreferences(response.data.data);
        toast({
          title: "Success",
          description: "Notification preferences reset to default",
        });
        return true;
      }
    } catch (error) {
      console.error("Error resetting notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to reset notification preferences",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    if (!preferences) return;

    setPreferences((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    isLoading,
    isSaving,
    loadPreferences,
    updatePreferences,
    resetPreferences,
    togglePreference,
  };
}
