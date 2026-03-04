"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingRequest } from "@/apiRequest/booking";
import Loading from "@/components/loading";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetOrganizers } from "@/hooks/useOrganizer";
import { useGetUsers } from "@/hooks/useUser";
import type { Booking } from "@/types/booking";
import { BookingStatus, EventStatus, OrganizerStatus } from "@/utils/enum";
import AdminBookingFunnel from "./_components/AdminBookingFunnel";
import AdminDashboardHeader from "./_components/AdminDashboardHeader";
import AdminEventHealth, { type EventStatusRow } from "./_components/AdminEventHealth";
import AdminOperationalNotes from "./_components/AdminOperationalNotes";
import AdminRecentEvents, { type AdminRecentEventItem } from "./_components/AdminRecentEvents";
import AdminRecentTransactions, {
  type AdminRecentTransactionItem,
} from "./_components/AdminRecentTransactions";
import AdminRevenueChart, { type AdminRevenueTrendPoint } from "./_components/AdminRevenueChart";
import AdminStatsGrid from "./_components/AdminStatsGrid";

type BookingState = "success" | "pending" | "failed";

type BookingCounts = {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
};

const updatedFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
const formatCurrency = (value: number) => `${formatNumber(Math.max(0, Math.round(value)))} VNĐ`;

const toAmount = (booking: Booking) => {
  const amount = Number(booking.totalPrice || booking.amount || 0);
  return Number.isFinite(amount) ? amount : 0;
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toSafeDate = (value?: string | null) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date;
};

const normalizeBookingStatus = (status: unknown): BookingState => {
  if (typeof status === "number") {
    if (status === BookingStatus.PAID) return "success";
    if (status === BookingStatus.PENDING) return "pending";
    return "failed";
  }

  const raw = String(status ?? "").trim().toLowerCase();
  const asNumber = Number(raw);

  if (raw && Number.isFinite(asNumber)) {
    if (asNumber === BookingStatus.PAID) return "success";
    if (asNumber === BookingStatus.PENDING) return "pending";
    return "failed";
  }

  if (raw.includes("paid") || raw.includes("success") || raw.includes("completed")) return "success";
  if (raw.includes("pending") || raw.includes("processing")) return "pending";
  return "failed";
};

const getEventStatusMeta = (status: EventStatus) => {
  switch (status) {
    case EventStatus.OPENED:
      return { label: "Dang mo", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case EventStatus.PUBLISHED:
      return { label: "Da xuat ban", className: "bg-sky-50 text-sky-700 border-sky-200" };
    case EventStatus.DRAFT:
      return { label: "Ban nhap", className: "bg-zinc-50 text-zinc-700 border-zinc-200" };
    case EventStatus.CLOSED:
      return { label: "Da dong", className: "bg-amber-50 text-amber-700 border-amber-200" };
    case EventStatus.CANCELLED:
      return { label: "Da huy", className: "bg-rose-50 text-rose-700 border-rose-200" };
    default:
      return { label: "Khac", className: "bg-zinc-50 text-zinc-700 border-zinc-200" };
  }
};

const fetchAllBookings = async () => {
  const result: Booking[] = [];
  let pageNumber = 1;
  let totalPages = 1;
  const pageSize = 100;
  const maxPages = 30;

  while (pageNumber <= totalPages && pageNumber <= maxPages) {
    const res = await bookingRequest.getList({ pageNumber, pageSize });
    const data = res.data;

    result.push(...(data.items || []));
    totalPages = data.totalPages || 1;
    pageNumber += 1;
  }

  return result;
};

const fetchBookingCounts = async (): Promise<BookingCounts> => {
  const [all, paid, pending, cancelled] = await Promise.all([
    bookingRequest.getList({ pageNumber: 1, pageSize: 1 }),
    bookingRequest.getList({ pageNumber: 1, pageSize: 1, status: BookingStatus.PAID }),
    bookingRequest.getList({ pageNumber: 1, pageSize: 1, status: BookingStatus.PENDING }),
    bookingRequest.getList({ pageNumber: 1, pageSize: 1, status: BookingStatus.CANCELLED }),
  ]);

  return {
    total: all.data.totalItems || 0,
    paid: paid.data.totalItems || 0,
    pending: pending.data.totalItems || 0,
    cancelled: cancelled.data.totalItems || 0,
  };
};

export default function AdminOverviewPage() {
  const { data: usersRes, isLoading: loadingUsers } = useGetUsers({ pageSize: 1 });
  const { data: categoriesRes, isLoading: loadingCategories } = useGetCategories({ pageSize: 1 });

  const { data: organizersRes, isLoading: loadingOrganizers } = useGetOrganizers({ pageSize: 1 });
  const { data: pendingOrganizersRes, isLoading: loadingPendingOrganizers } = useGetOrganizers({
    pageSize: 1,
    status: OrganizerStatus.PENDING,
  });
  const { data: verifiedOrganizersRes, isLoading: loadingVerifiedOrganizers } = useGetOrganizers({
    pageSize: 1,
    status: OrganizerStatus.VERIFIED,
  });
  const { data: bannedOrganizersRes, isLoading: loadingBannedOrganizers } = useGetOrganizers({
    pageSize: 1,
    status: OrganizerStatus.BANNED,
  });

  const { data: eventsRes, isLoading: loadingEvents } = useGetEvents({ pageSize: 1 });
  const { data: openedEventsRes, isLoading: loadingOpenedEvents } = useGetEvents({
    pageSize: 1,
    status: EventStatus.OPENED,
  });
  const { data: publishedEventsRes, isLoading: loadingPublishedEvents } = useGetEvents({
    pageSize: 1,
    status: EventStatus.PUBLISHED,
  });
  const { data: draftEventsRes, isLoading: loadingDraftEvents } = useGetEvents({
    pageSize: 1,
    status: EventStatus.DRAFT,
  });
  const { data: closedEventsRes, isLoading: loadingClosedEvents } = useGetEvents({
    pageSize: 1,
    status: EventStatus.CLOSED,
  });
  const { data: cancelledEventsRes, isLoading: loadingCancelledEvents } = useGetEvents({
    pageSize: 1,
    status: EventStatus.CANCELLED,
  });
  const { data: latestEventsRes, isLoading: loadingLatestEvents } = useGetEvents({
    pageSize: 8,
    hasOrganizer: true,
    hasCategory: true,
    isDescending: true,
  });

  const { data: bookingCounts, isLoading: loadingBookingCounts } = useQuery({
    queryKey: ["admin-overview-booking-counts"],
    queryFn: fetchBookingCounts,
  });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["admin-overview-bookings"],
    queryFn: fetchAllBookings,
  });

  const isLoading =
    loadingUsers ||
    loadingCategories ||
    loadingOrganizers ||
    loadingPendingOrganizers ||
    loadingVerifiedOrganizers ||
    loadingBannedOrganizers ||
    loadingEvents ||
    loadingOpenedEvents ||
    loadingPublishedEvents ||
    loadingDraftEvents ||
    loadingClosedEvents ||
    loadingCancelledEvents ||
    loadingLatestEvents ||
    loadingBookingCounts ||
    loadingBookings;

  const totalUsers = usersRes?.data?.totalItems || 0;
  const totalCategories = categoriesRes?.data?.totalItems || 0;
  const totalOrganizers = organizersRes?.data?.totalItems || 0;
  const totalEvents = eventsRes?.data?.totalItems || 0;

  const pendingOrganizers = pendingOrganizersRes?.data?.totalItems || 0;
  const verifiedOrganizers = verifiedOrganizersRes?.data?.totalItems || 0;
  const bannedOrganizers = bannedOrganizersRes?.data?.totalItems || 0;

  const eventOpened = openedEventsRes?.data?.totalItems || 0;
  const eventPublished = publishedEventsRes?.data?.totalItems || 0;
  const eventDraft = draftEventsRes?.data?.totalItems || 0;
  const eventClosed = closedEventsRes?.data?.totalItems || 0;
  const eventCancelled = cancelledEventsRes?.data?.totalItems || 0;

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort((left, right) => {
        const leftDate = toSafeDate(left.paidAt || left.createdAt)?.getTime() ?? 0;
        const rightDate = toSafeDate(right.paidAt || right.createdAt)?.getTime() ?? 0;
        return rightDate - leftDate;
      }),
    [bookings]
  );

  const paidBookings = useMemo(
    () => sortedBookings.filter((booking) => normalizeBookingStatus(booking.status) === "success"),
    [sortedBookings]
  );

  const totalRevenue = useMemo(
    () => paidBookings.reduce((sum, booking) => sum + toAmount(booking), 0),
    [paidBookings]
  );
  const averageOrderValue = paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;

  const trendData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });
    const today = new Date();
    const points: AdminRevenueTrendPoint[] = [];
    const map = new Map<string, AdminRevenueTrendPoint>();

    for (let offset = 6; offset >= 0; offset--) {
      const day = new Date(today);
      day.setDate(today.getDate() - offset);
      day.setHours(0, 0, 0, 0);

      const point: AdminRevenueTrendPoint = {
        label: formatter.format(day).replace(/\./g, ""),
        amount: 0,
        count: 0,
      };

      points.push(point);
      map.set(toDateKey(day), point);
    }

    for (const booking of paidBookings) {
      const paidDate = toSafeDate(booking.paidAt || booking.createdAt);
      if (!paidDate) continue;

      const bucket = map.get(toDateKey(paidDate));
      if (!bucket) continue;

      bucket.amount += toAmount(booking);
      bucket.count += 1;
    }

    return points;
  }, [paidBookings]);

  const todayRevenue = trendData.at(-1)?.amount || 0;
  const paidBookings7Days = trendData.reduce((sum, point) => sum + point.count, 0);

  const bookingSummary = bookingCounts || { total: 0, paid: 0, pending: 0, cancelled: 0 };
  const failedBookings = Math.max(
    bookingSummary.total - bookingSummary.paid - bookingSummary.pending,
    bookingSummary.cancelled
  );
  const paidRatio = bookingSummary.total > 0 ? (bookingSummary.paid / bookingSummary.total) * 100 : 0;
  const pendingRatio = bookingSummary.total > 0 ? (bookingSummary.pending / bookingSummary.total) * 100 : 0;
  const failedRatio = bookingSummary.total > 0 ? (failedBookings / bookingSummary.total) * 100 : 0;

  const eventStatusRows: EventStatusRow[] = [
    {
      label: "Dang mo",
      count: eventOpened,
      ratio: totalEvents > 0 ? (eventOpened / totalEvents) * 100 : 0,
      barClassName: "bg-emerald-500",
    },
    {
      label: "Da xuat ban",
      count: eventPublished,
      ratio: totalEvents > 0 ? (eventPublished / totalEvents) * 100 : 0,
      barClassName: "bg-sky-500",
    },
    {
      label: "Ban nhap",
      count: eventDraft,
      ratio: totalEvents > 0 ? (eventDraft / totalEvents) * 100 : 0,
      barClassName: "bg-zinc-500",
    },
    {
      label: "Da dong",
      count: eventClosed,
      ratio: totalEvents > 0 ? (eventClosed / totalEvents) * 100 : 0,
      barClassName: "bg-amber-500",
    },
    {
      label: "Da huy",
      count: eventCancelled,
      ratio: totalEvents > 0 ? (eventCancelled / totalEvents) * 100 : 0,
      barClassName: "bg-rose-500",
    },
  ];

  const recentEvents: AdminRecentEventItem[] = (latestEventsRes?.data?.items || []).map((event) => {
    const statusMeta = getEventStatusMeta(event.status);
    return {
      id: event.id,
      name: event.name,
      organizerName: event.organizer?.name || "Chua co organizer",
      categoryName: event.category?.name || "No category",
      statusLabel: statusMeta.label,
      statusClassName: statusMeta.className,
    };
  });

  const recentTransactions: AdminRecentTransactionItem[] = sortedBookings.slice(0, 8).map((booking) => {
    const created = toSafeDate(booking.paidAt || booking.createdAt);
    return {
      id: booking.id.slice(0, 8).toUpperCase(),
      customerName: booking.fullname || booking.email || "Khach",
      occurredAtLabel: created ? dateTimeFormatter.format(created) : "Khong ro thoi gian",
      status: normalizeBookingStatus(booking.status),
      amount: toAmount(booking),
    };
  });

  const activeEvents = eventOpened + eventPublished;

  if (isLoading) return <Loading />;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <AdminDashboardHeader
        totalBookings={bookingSummary.total}
        updatedAtLabel={updatedFormatter.format(new Date())}
        formatNumber={formatNumber}
      />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 lg:space-y-5">
        <AdminStatsGrid
          totalUsers={totalUsers}
          totalOrganizers={totalOrganizers}
          pendingOrganizers={pendingOrganizers}
          totalEvents={totalEvents}
          activeEvents={activeEvents}
          totalCategories={totalCategories}
          paidBookings={bookingSummary.paid}
          paidRatio={paidRatio}
          totalRevenue={totalRevenue}
          averageOrderValue={averageOrderValue}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <AdminRevenueChart
              trendData={trendData}
              todayRevenue={todayRevenue}
              paidBookings7Days={paidBookings7Days}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />
          </div>
          <AdminBookingFunnel
            bookingSummary={bookingSummary}
            failedBookings={failedBookings}
            paidRatio={paidRatio}
            pendingRatio={pendingRatio}
            failedRatio={failedRatio}
            formatNumber={formatNumber}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <AdminEventHealth
              eventStatusRows={eventStatusRows}
              pendingOrganizers={pendingOrganizers}
              verifiedOrganizers={verifiedOrganizers}
              bannedOrganizers={bannedOrganizers}
              formatNumber={formatNumber}
            />
          </div>
          <div className="xl:col-span-3">
            <AdminRecentTransactions
              items={recentTransactions}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <AdminRecentEvents recentEvents={recentEvents} />
          <AdminOperationalNotes
            paidRatio={paidRatio}
            totalBookings={bookingSummary.total}
            pendingOrganizers={pendingOrganizers}
            activeEvents={activeEvents}
            totalEvents={totalEvents}
            formatNumber={formatNumber}
          />
        </section>
      </div>
    </div>
  );
}
