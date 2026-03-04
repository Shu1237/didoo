"use client";

import DashboardStats from "./_components/DashboardStats";
import RecentEvents, { type RecentEventItem, type RecentEventTone } from "./_components/RecentEvents";
import SalesChart from "./_components/SalesChart";
import { useGetMe } from "@/hooks/useUser";
import { useOrganizerStats } from "@/hooks/useOrganizerStats";
import Loading from "@/components/loading";
import { EventStatus } from "@/utils/enum";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
});

const updatedFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toSafeDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getEventStatus = (
  status: EventStatus,
  sold: number,
  total: number
): { label: string; tone: RecentEventTone } => {
  if (total > 0 && sold >= total) return { label: "Sold out", tone: "danger" };

  switch (status) {
    case EventStatus.DRAFT:
      return { label: "Bản nháp", tone: "neutral" };
    case EventStatus.CANCELLED:
      return { label: "Đã hủy", tone: "danger" };
    case EventStatus.CLOSED:
      return { label: "Đã kết thúc", tone: "warning" };
    case EventStatus.OPENED:
    case EventStatus.PUBLISHED:
      return { label: "Đang mở bán", tone: "success" };
    default:
      return { label: "Chưa cập nhật", tone: "neutral" };
  }
};

export default function OrganizerDashboardPage() {
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const organizerId = userData?.data?.organizerId;

  const { stats, chartData, events, isLoading: isStatsLoading } = useOrganizerStats(organizerId || undefined);

  if (isUserLoading || isStatsLoading) return <Loading />;

  const sortedEvents = [...events].sort((left, right) => {
    const leftTime = toSafeDate(left.startTime)?.getTime() ?? 0;
    const rightTime = toSafeDate(right.startTime)?.getTime() ?? 0;
    return rightTime - leftTime;
  });

  const formattedEvents: RecentEventItem[] = sortedEvents.slice(0, 6).map((event) => {
    const sold = toNumber(event.sold);
    const total = toNumber(event.total);
    const fillRate = total > 0 ? (sold / total) * 100 : 0;

    const startTime = toSafeDate(event.startTime);
    const status = getEventStatus(event.status, sold, total);

    return {
      id: event.id,
      title: event.name,
      date: startTime ? dateFormatter.format(startTime) : "--/--/----",
      time: startTime ? timeFormatter.format(startTime) : "--:--",
      location: event.locations?.[0]?.name || "Chưa cập nhật địa điểm",
      sold,
      total,
      fillRate,
      statusLabel: status.label,
      statusTone: status.tone,
    };
  });

  const activeEventsCount = events.filter(
    (event) => event.status === EventStatus.OPENED || event.status === EventStatus.PUBLISHED
  ).length;
  const totalTicketsSold = events.reduce((sum, event) => sum + toNumber(event.sold), 0);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <section className="relative shrink-0 overflow-hidden rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm lg:px-6 lg:py-5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-50/70 via-transparent to-emerald-50/70" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                Organizer Dashboard
              </span>
              <span className="text-xs text-zinc-500">Cập nhật lúc {updatedFormatter.format(new Date())}</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Tổng quan hoạt động</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Theo dõi nhanh hiệu suất sự kiện, tốc độ bán vé và mức lấp đầy từ dữ liệu API.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
              <p className="text-[11px] text-zinc-500">Đang mở</p>
              <p className="text-lg font-semibold text-zinc-900">{activeEventsCount}</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
              <p className="text-[11px] text-zinc-500">Tổng sự kiện</p>
              <p className="text-lg font-semibold text-zinc-900">{events.length}</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
              <p className="text-[11px] text-zinc-500">Vé đã bán</p>
              <p className="text-lg font-semibold text-zinc-900">{totalTicketsSold.toLocaleString("vi-VN")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="shrink-0">
        <DashboardStats reportData={stats} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
        <div className="min-h-0 xl:col-span-2">
          <SalesChart data={chartData} />
        </div>

        <div className="min-h-0">
          <RecentEvents upcomingEvents={formattedEvents} />
        </div>
      </div>
    </div>
  );
}
