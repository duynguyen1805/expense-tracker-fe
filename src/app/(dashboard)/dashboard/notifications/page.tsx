"use client";

import Notifications from "@/components/dashboard/notifications";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with your financial goals and important reminders
        </p>
      </div>
      
      <Notifications limit={50} showHeader={false} />
    </div>
  );
} 