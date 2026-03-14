import * as signalR from "@microsoft/signalr";
import { envconfig } from "../../config";
import { useSessionStore } from "@/stores/sesionStore";

/** Tạo kết nối SignalR tới NotificationHub (thông báo real-time) - yêu cầu JWT */
export const createNotificationHubConnection = () => {
  const apiUrl = envconfig.NEXT_PUBLIC_API_URL;
  const rootUrl = apiUrl.replace(/\/api\/?$/, "");
  const hubUrl = `${rootUrl}/hubs/notification`;

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
