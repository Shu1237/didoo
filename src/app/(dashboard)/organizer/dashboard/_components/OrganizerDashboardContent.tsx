"use client";

import { useGetMe } from "@/hooks/useUser";
import { useOrganizerStats } from "@/hooks/useOrganizerStats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventStatus } from "@/utils/enum";
import Link from "next/link";
import Image from "next/image";

const statusLabels: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: "Nháp",
  [EventStatus.PUBLISHED]: "Đã xuất bản",
  [EventStatus.CANCELLED]: "Đã hủy",
  [EventStatus.OPENED]: "Đang mở",
  [EventStatus.CLOSED]: "Đã đóng",
};

function formatDate(s: string | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return s;
  }
}

export function OrganizerDashboardContent() {
  const { data: meRes } = useGetMe();
  const organizerId = meRes?.data?.organizerId ?? undefined;
  const { stats, chartData, events, isLoading } = useOrganizerStats(organizerId);

  if (isLoading || !organizerId) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-200">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 animate-pulse rounded bg-zinc-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const recentEvents = events.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-zinc-200">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-zinc-500">{stat.title}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">Sự kiện gần đây</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-zinc-500">Chưa có sự kiện nào</p>
            ) : (
              recentEvents.map((e) => (
                <Link
                  key={e.id}
                  href={`/organizer/events/${e.id}`}
                  className="flex items-center gap-4 rounded-xl border border-zinc-200 p-3 transition hover:bg-zinc-50"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    {e.thumbnailUrl ? (
                      <Image src={e.thumbnailUrl} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-900 truncate">{e.name}</p>
                    <p className="text-sm text-zinc-500">{formatDate(e.startTime)}</p>
                  </div>
                  <Badge
                    variant={
                      (e.status as EventStatus) === EventStatus.OPENED
                        ? "default"
                        : (e.status as EventStatus) === EventStatus.CANCELLED
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {statusLabels[(e.status as EventStatus) ?? 0] ?? e.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
          <Link
            href="/organizer/events"
            className="mt-4 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Xem tất cả sự kiện →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
