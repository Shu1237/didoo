"use client";

import { useGetMe } from "@/hooks/useAuth";
import { useGetNotifications, useNotification } from "@/hooks/useOperation";
import { useSessionStore } from "@/stores/sesionStore";
import { useNotificationContextOptional } from "@/contexts/notificationContext";
import Loading from "@/components/loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const user = useSessionStore((state) => state.user);
  const { data: meRes, isLoading: isMeLoading } = useGetMe();
  const ctx = useNotificationContextOptional();
  const realtimeNotifications = ctx?.notifications ?? [];
  const { data: apiRes, isLoading: isApiLoading } = useGetNotifications(
    { pageNumber: 1, pageSize: 50, userId: user?.UserId ?? meRes?.data?.id },
    { enabled: !!(user?.UserId ?? meRes?.data?.id) }
  );
  const { markAsRead } = useNotification();

  const apiItems = apiRes?.data?.items ?? [];
  const allItems = [
    ...realtimeNotifications.map((n) => ({
      id: `rt-${n.createdAt}`,
      title: n.title,
      message: n.message,
      isRead: false,
      type: n.type,
      relatedId: n.relatedId,
      createdAt: n.createdAt,
    })),
    ...apiItems.map((n) => ({
      id: n.id ?? "",
      title: n.title ?? "",
      message: n.message ?? "",
      isRead: n.isRead ?? false,
      type: (n as { type?: string }).type ?? "",
      relatedId: n.event?.id ?? (n as { relatedId?: string }).relatedId ?? null,
      createdAt: "",
    })),
  ].slice(0, 50);

  const getLink = (item: (typeof allItems)[0]) => {
    if (item.type === "OrganizerVerify") return "/organizer/dashboard";
    if (item.type === "BookingSuccess") return "/user/dashboard/tickets";
    if (item.type === "ResaleSuccess") return "/user/dashboard/resales";
    return "#";
  };

  const handleMarkRead = async (id: string) => {
    if (id.startsWith("rt-") || !id) return;
    try {
      await markAsRead.mutateAsync(id);
    } catch {
      // ignore
    }
  };

  if (isMeLoading) return <Loading />;

  if (!user && !meRes?.data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Card className="max-w-md border-zinc-200">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-600">Vui lòng đăng nhập để xem thông báo.</p>
            <Button asChild className="mt-4">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Thông báo</h1>
      </div>

      <Card className="border-zinc-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-zinc-600" />
            <span className="font-semibold text-zinc-900">Tất cả thông báo</span>
          </div>
        </CardHeader>
        <CardContent>
          {isApiLoading && allItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">Đang tải...</div>
          ) : allItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">Chưa có thông báo</div>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {allItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={getLink(item)}
                    onClick={() => handleMarkRead(item.id)}
                    className={`flex gap-4 rounded-lg p-4 transition hover:bg-zinc-50 ${
                      !item.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-zinc-900">{item.title}</p>
                      <p className="mt-1 text-sm text-zinc-600">{item.message}</p>
                    </div>
                    {!item.isRead && !item.id.startsWith("rt-") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkRead(item.id);
                        }}
                        className="shrink-0"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
