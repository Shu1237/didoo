import * as signalR from "@microsoft/signalr";
import { envconfig } from "../../config";
import { useSessionStore } from "@/stores/sesionStore";

export const createTicketHubConnection = () => {
  const token = useSessionStore.getState().accessToken;
  const apiUrl = envconfig.NEXT_PUBLIC_API_URL;
  // Strip /api if present, as hubs are usually mapped to the root
  const rootUrl = apiUrl.replace(/\/api\/?$/, "");
  const hubUrl = `${rootUrl}/hubs/ticket`;

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => useSessionStore.getState().accessToken || "",
      skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  return connection;
};
