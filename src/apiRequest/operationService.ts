import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { CheckInGetListQuery, CheckIn, NotificationGetListQuery, Notification } from "@/types/operation";
import { CheckInCreateBody, CheckInUpdateBody, NotificationCreateBody, NotificationUpdateBody } from "@/schemas/operation";
import { PaginatedData } from "@/types/base";

export const checkInRequest = {
  getList: (params?: CheckInGetListQuery) =>
    http.get<PaginatedData<CheckIn>>(ENDPOINT_CLIENT.CHECKINS, { query: params || {} }),
  getById: (id: string) => http.get<CheckIn>(ENDPOINT_CLIENT.CHECKIN_DETAIL(id)),
  create: (body: CheckInCreateBody) => http.post<CheckIn>(ENDPOINT_CLIENT.CHECKINS, body),
  update: (id: string, body: CheckInUpdateBody) => http.put<Partial<CheckIn>>(ENDPOINT_CLIENT.CHECKIN_DETAIL(id), body),
  delete: (id: string) => http.delete<null>(ENDPOINT_CLIENT.CHECKIN_DETAIL(id)),
  restore: (id: string) => http.patch<null>(ENDPOINT_CLIENT.CHECKIN_DETAIL(id), {}),
};

export const notificationRequest = {
  getList: (params?: NotificationGetListQuery) =>
    http.get<PaginatedData<Notification>>(ENDPOINT_CLIENT.NOTIFICATIONS, { query: params || {} }),
  getById: (id: string) => http.get<Notification>(ENDPOINT_CLIENT.NOTIFICATION_DETAIL(id)),
  create: (body: NotificationCreateBody) => http.post<Notification>(ENDPOINT_CLIENT.NOTIFICATIONS, body),
  update: (id: string, body: NotificationUpdateBody) =>
    http.put<Partial<Notification>>(ENDPOINT_CLIENT.NOTIFICATION_DETAIL(id), body),
  delete: (id: string) => http.delete<null>(ENDPOINT_CLIENT.NOTIFICATION_DETAIL(id)),
  restore: (id: string) => http.patch<null>(ENDPOINT_CLIENT.NOTIFICATION_DETAIL(id), {}),
};
