"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import { createNotificationHubConnection } from "@/lib/notificationHub";
import { useSessionStore } from "@/stores/sesionStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { KEY } from "@/utils/constant";
import { 
  notificationStore$, 
  addNotification, 
  clearNotifications, 
  setNotificationConnection,
  type RealtimeNotification 
} from "@/stores/notificationStore";
import { observer } from "@legendapp/state/react";

interface NotificationContextType {
  notifications: RealtimeNotification[];
  addNotification: (n: RealtimeNotification) => void;
  clearNotifications: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = observer(({ children }: { children: ReactNode }) => {
  const accessToken = useSessionStore((state) => state.accessToken);
  const user = useSessionStore((state) => state.user);
  const queryClient = useQueryClient();
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (!accessToken || !user?.UserId) return;

    let isMounted = true;
    let conn: signalR.HubConnection | null = null;

    const startConnection = async () => {
      if (isStartedRef.current) return;

      console.log("[NotificationHub] Starting connection, token:", !!useSessionStore.getState().accessToken);

      // Wait for token to be available
      let attempts = 0;
      const maxAttempts = 10;
      while (!useSessionStore.getState().accessToken && attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 500));
        attempts++;
      }

      const token = useSessionStore.getState().accessToken;
      if (!token) {
        console.log("[NotificationHub] No token after waiting, skip connection");
        // Don't set isStartedRef to true, allow retry when token becomes available
        return;
      }

      isStartedRef.current = true;

      try {
        conn = createNotificationHubConnection();

        conn.on("ReceiveNotification", (data: RealtimeNotification) => {
          if (!isMounted) return;

          console.log("[Notification] Received notification:", data);

          const payload = data as any;
          const n: RealtimeNotification = {
            title: payload.title ?? payload.Title ?? "",
            message: payload.message ?? payload.Message ?? "",
            type: payload.type ?? payload.Type ?? "",
            relatedId: payload.relatedId ?? payload.RelatedId ?? null,
            createdAt: payload.createdAt ?? payload.CreatedAt ?? new Date().toISOString(),
          };

          addNotification(n);
          toast.success(n.title, { description: n.message });

          // Specific handling for business types - Normalize to UPPERCASE for matching
          const upperType = n.type.toUpperCase();

          // 4 real-time areas: TICKET, BOOKING, RESALE, VERIFYORGANIZER
          if (upperType.includes("TICKET")) {
            queryClient.invalidateQueries({ queryKey: KEY.tickets });
          }

          if (upperType.includes("BOOKING")) {
            queryClient.invalidateQueries({ queryKey: KEY.bookings });
          }

          if (upperType.includes("RESALE")) {
            queryClient.invalidateQueries({ queryKey: KEY.resales });
            queryClient.invalidateQueries({ queryKey: KEY.resaleTransactions });
          }

          if (upperType.includes("ORGANIZERVERIFY") || upperType.includes("VERIFYORGANIZER")) {
            // Refresh "me" to update role/dashboard link
            queryClient.invalidateQueries({ queryKey: KEY.users });
          }

          queryClient.invalidateQueries({ queryKey: KEY.notifications });
        });

        await conn.start();

        if (isMounted) {
          setNotificationConnection(true);
        } else {
          conn.stop().catch(() => {});
        }
      } catch (err: unknown) {
        if (!isMounted) return;

        // Reset to allow retry
        isStartedRef.current = false;

        const e = err as { name?: string; message?: string };
        const isAbort =
          e?.name === "AbortError" ||
          e?.message?.includes("stopped during negotiation") ||
          e?.message?.includes("The connection was stopped") ||
          e?.message?.includes("WebSocket") ||
          e?.message?.includes("negotiate") ||
          e?.message?.includes("Failed to negotiate") ||
          e?.message?.includes("Aborted");

        // Log error details for debugging
        console.log(`[NotificationHub] Connection failed: ${e?.name || "Unknown error"} - ${e?.message || "No message"}`);

        if (!isAbort) {
          console.error("NotificationHub connection error:", err);
        }
        setNotificationConnection(false);

        // Retry after 5 seconds
        setTimeout(() => {
          if (isMounted && useSessionStore.getState().accessToken) {
            startConnection();
          }
        }, 5000);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      isStartedRef.current = false;
      if (conn) {
        if (conn.state !== signalR.HubConnectionState.Disconnected) {
          conn.stop().catch(() => {});
        }
        setNotificationConnection(false);
      }
    };
  }, [accessToken, user?.UserId, queryClient]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificationStore$.notifications.get(),
        addNotification,
        clearNotifications,
        isConnected: notificationStore$.isConnected.get(),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
});

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }
  return ctx;
}

export function useNotificationContextOptional() {
  return useContext(NotificationContext);
}
