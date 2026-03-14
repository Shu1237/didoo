import { observable } from "@legendapp/state";

export interface RealtimeNotification {
  title: string;
  message: string;
  type: string;
  relatedId?: string | null;
  createdAt: string;
}

export const notificationStore$ = observable({
  notifications: [] as RealtimeNotification[],
  isConnected: false,
});

export const addNotification = (n: RealtimeNotification) => {
  notificationStore$.notifications.set((prev) => [n, ...prev].slice(0, 50));
};

export const clearNotifications = () => {
  notificationStore$.notifications.set([]);
};

export const setNotificationConnection = (connected: boolean) => {
  notificationStore$.isConnected.set(connected);
};
