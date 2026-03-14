import { useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { createTicketHubConnection } from "@/lib/ticketHub";
import { toast } from "sonner";

/** Payload từ BE: ReceiveZoneUpdate - ASP.NET serialize camelCase */
type ZoneUpdatePayload = {
  ticketTypeId: string;
  remainingCount: number;
};

export const useTicketHub = (eventId: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [realtimeAvailability, setRealtimeAvailability] = useState<Record<string, number>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const selectTicket = useCallback(
    async (ticketTypeId: string, quantityChange: number) => {
      const conn = connectionRef.current ?? connection;
      if (!conn || conn.state !== signalR.HubConnectionState.Connected || !eventId) return;
      try {
        await conn.invoke("SelectTicket", eventId, ticketTypeId, quantityChange);
      } catch (err) {
        console.error("SignalR SelectTicket error:", err);
        toast.error("Không thể cập nhật vé. Vui lòng thử lại.");
      }
    },
    [eventId, connection]
  );

  useEffect(() => {
    if (!eventId) return;

    let isMounted = true;
    let conn: signalR.HubConnection | null = null;

    const startConnection = async () => {
      try {
        conn = createTicketHubConnection();
        connectionRef.current = conn;

        conn.on("ReceiveZoneUpdate", (data: ZoneUpdatePayload) => {
          if (!isMounted) return;
          const id = data.ticketTypeId ?? (data as unknown as { TicketTypeId?: string }).TicketTypeId;
          const count = data.remainingCount ?? (data as unknown as { RemainingCount?: number }).RemainingCount;
          if (id != null && typeof count === "number") {
            setRealtimeAvailability((prev) => ({ ...prev, [id]: count }));
          }
        });

        conn.on("ReceiveTicketUpdateFailed", (ticketTypeId: string, errorMessage: string) => {
          if (!isMounted) return;
          toast.error(errorMessage || "Không thể chọn thêm vé. Vé có thể đã hết.");
        });

        await conn.start();

        if (!isMounted) {
          await conn.stop().catch(() => {});
          return;
        }

        await conn.invoke("JoinEventGroup", eventId);
        setConnection(conn);
      } catch (err: unknown) {
        const e = err as { name?: string; message?: string };
        if (e?.name === "AbortError" || e?.message?.includes("stopped during negotiation")) {
          // Connection intentionally stopped
        } else {
          console.error("SignalR TicketHub connection error:", err);
        }
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      const c = conn;
      if (c && c.state !== signalR.HubConnectionState.Disconnected) {
        c
          .invoke("LeaveEventGroup", eventId)
          .catch(() => {})
          .finally(() => {
            c.stop().catch(() => {});
          });
      }
      connectionRef.current = null;
    };
  }, [eventId]);

  return {
    realtimeAvailability,
    selectTicket,
    isConnected: connection?.state === signalR.HubConnectionState.Connected,
  };
};
