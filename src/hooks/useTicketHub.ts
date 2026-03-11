import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { createTicketHubConnection } from "@/lib/ticketHub";
import { toast } from "sonner";
import { useSessionStore } from "@/stores/sesionStore";

export const useTicketHub = (eventId: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [realtimeAvailability, setRealtimeAvailability] = useState<Record<string, number>>({});
  const [lockedTickets, setLockedTickets] = useState<Record<string, { userId: string, quantity: number }>>({});

  const token = useSessionStore((state) => state.accessToken);

  useEffect(() => {
    // SignalR temporarily disabled as per user request
    /*
    if (!eventId || !token) return;

    let isMounted = true;
    let conn: signalR.HubConnection | null = null;

    const startConnection = async () => {
      try {
        conn = createTicketHubConnection();
        
        // Setup listeners before starting
        // Backend uses "ReceiveZoneUpdate" with payload { TicketTypeId, RemainingCount }
        conn.on("ReceiveZoneUpdate", (data: { ticketTypeId: string, remainingCount: number }) => {
          if (!isMounted) return;
          console.log("SignalR: Received Zone Update", data);
          setRealtimeAvailability((prev) => ({
            ...prev,
            [data.ticketTypeId]: data.remainingCount,
          }));
        });

        await conn.start();
        
        if (!isMounted) {
          await conn.stop();
          return;
        }

        console.log(`SignalR Connected to Ticket Hub for event: ${eventId}`);
        await conn.invoke("JoinEventGroup", eventId);
        
        if (isMounted) {
          setConnection(conn);
        }
      } catch (err: any) {
        if (err.name === "AbortError" || err.message?.includes("stopped during negotiation")) {
          console.log("SignalR: Connection intentionally stopped (likely due to unmount/re-render).");
        } else {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (conn && conn.state !== signalR.HubConnectionState.Disconnected) {
        conn.stop().catch(() => {});
      }
    };
    */
  }, [eventId, token]);

  const lockTickets = async (ticketTypeId: string, quantity: number) => {
    // SignalR temporarily disabled
  };

  const unlockTickets = async (ticketTypeId: string) => {
    // SignalR temporarily disabled
  };

  return {
    realtimeAvailability,
    lockedTickets,
    lockTickets,
    unlockTickets,
    isConnected: connection?.state === signalR.HubConnectionState.Connected,
  };
};
