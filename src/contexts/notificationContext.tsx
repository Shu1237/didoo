"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import { createNotificationHubConnection } from "@/lib/notificationHub";
import { useSessionStore } from "@/stores/sesionStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { KEY } from "@/utils/constant";

/** Payload từ BE ReceiveNotification - ASP.NET serialize camelCase */
export interface RealtimeNotification {
  title: string;
  message: string;
  type: string;
  relatedId?: string | null;
  createdAt: string;
}

interface NotificationContextType {
  notifications: RealtimeNotification[];
  addNotification: (n: RealtimeNotification) => void;
  clearNotifications: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const accessToken = useSessionStore((state) => state.accessToken);
  const user = useSessionStore((state) => state.user);
  const queryClient = useQueryClient();
  const connRef = useRef<signalR.HubConnection | null>(null);

  const addNotification = useCallback((n: RealtimeNotification) => {
    setNotifications((prev) => [n, ...prev].slice(0, 50));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  useEffect(() => {
    if (!accessToken || !user?.UserId) return;

    let conn: signalR.HubConnection | null = null;

    const startConnection = async () => {
      try {
        conn = createNotificationHubConnection();
        connRef.current = conn;

        conn.on("ReceiveNotification", (data: RealtimeNotification) => {
          const payload = data as RealtimeNotification & {
            Title?: string;
            Message?: string;
            Type?: string;
            RelatedId?: string | null;
            CreatedAt?: string;
          };
          const n: RealtimeNotification = {
            title: payload.title ?? payload.Title ?? "",
            message: payload.message ?? payload.Message ?? "",
            type: payload.type ?? payload.Type ?? "",
            relatedId: payload.relatedId ?? payload.RelatedId ?? null,
            createdAt: payload.createdAt ?? payload.CreatedAt ?? new Date().toISOString(),
          };
          addNotification(n);
          toast.success(n.title, { description: n.message });
          queryClient.invalidateQueries({ queryKey: KEY.notifications });
        });

        await conn.start();
        setConnection(conn);
      } catch (err: unknown) {
        const e = err as { name?: string; message?: string };
        if (e?.name !== "AbortError" && !e?.message?.includes("stopped during negotiation")) {
          console.error("NotificationHub connection error:", err);
        }
      }
    };

    startConnection();

    return () => {
      if (conn && conn.state !== signalR.HubConnectionState.Disconnected) {
        conn.stop().catch(() => {});
      }
      connRef.current = null;
      setConnection(null);
    };
  }, [accessToken, user?.UserId, addNotification, queryClient]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        isConnected: connection?.state === signalR.HubConnectionState.Connected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }
  return ctx;
}

/** Optional version - returns undefined when outside provider */
export function useNotificationContextOptional() {
  return useContext(NotificationContext);
}
