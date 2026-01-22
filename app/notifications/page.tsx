"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, AlertTriangle, Ticket as TicketIcon, CheckCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const userNotifications = useMemo(() => {
    return notifications.filter(
      n => n.customerId === user?.customerId || n.customerId === null
    );
  }, [notifications, user]);

  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [] as typeof notifications,
      yesterday: [] as typeof notifications,
      thisWeek: [] as typeof notifications,
      earlier: [] as typeof notifications,
    };

    userNotifications.forEach(notif => {
      const date = new Date(notif.createdAt);
      if (isToday(date)) {
        groups.today.push(notif);
      } else if (isYesterday(date)) {
        groups.yesterday.push(notif);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(notif);
      } else {
        groups.earlier.push(notif);
      }
    });

    return groups;
  }, [userNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "warranty_expiry":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "license_expiry":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "ticket_update":
        return <TicketIcon className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
  };

  const NotificationItem = ({ notif }: { notif: typeof notifications[0] }) => (
    <div
      className={cn(
        "p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors",
        !notif.isRead && "bg-blue-50 border-blue-200"
      )}
      onClick={() => handleNotificationClick(notif)}
    >
      <div className="flex items-start gap-3">
        {!notif.isRead && (
          <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
        )}
        <div className="flex-shrink-0">{getIcon(notif.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{notif.title}</h4>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {format(new Date(notif.createdAt), "HH:mm")}
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">{notif.message}</p>
          {notif.serialNumber && (
            <Link href="/inventory">
              <Badge variant="outline" className="mt-2 text-xs">
                {notif.serialNumber}
              </Badge>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const NotificationGroup = ({ title, items }: { title: string; items: typeof notifications }) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {title}
        </h3>
        {items.map(notif => (
          <NotificationItem key={notif.id} notif={notif} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Notifications</CardTitle>
              <Button variant="outline" onClick={handleMarkAllRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {userNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <>
                <NotificationGroup title="Today" items={groupedNotifications.today} />
                <NotificationGroup title="Yesterday" items={groupedNotifications.yesterday} />
                <NotificationGroup title="This Week" items={groupedNotifications.thisWeek} />
                <NotificationGroup title="Earlier" items={groupedNotifications.earlier} />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive notifications via email</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Preferences saved!")}
              >
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Warranty Expiry Alerts</p>
                <p className="text-sm text-slate-600">30, 60, and 90 day reminders</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Preferences saved!")}
              >
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Ticket Updates</p>
                <p className="text-sm text-slate-600">Status changes and new comments</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Preferences saved!")}
              >
                Enabled
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
