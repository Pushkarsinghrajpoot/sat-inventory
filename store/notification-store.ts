import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification } from "@/lib/types";
import { dummyNotifications } from "@/lib/dummy-data";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
  getNotificationsByCustomer: (customerId: string | null) => Notification[];
  updateUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: dummyNotifications || [],
      unreadCount: (dummyNotifications || []).filter(n => !n.isRead).length,
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        }));
        get().updateUnreadCount();
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, isRead: true }))
        }));
        get().updateUnreadCount();
      },
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `NOT${String((get().notifications || []).length + 1).padStart(3, "0")}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
        get().updateUnreadCount();
      },
      
      getNotificationsByCustomer: (customerId) => {
        return (get().notifications || []).filter(
          (notif) => notif.customerId === customerId || notif.customerId === null
        );
      },
      
      updateUnreadCount: () => {
        set((state) => ({
          unreadCount: (state.notifications || []).filter(n => !n.isRead).length
        }));
      }
    }),
    {
      name: "notification-storage"
    }
  )
);
