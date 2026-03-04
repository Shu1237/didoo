"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import Loading from "@/components/loading";
import { bookingRequest } from "@/apiRequest/booking";
import RevenueStats, { type AdminRevenueStatsData } from "./_components/RevenueStats";
import RevenueChart, { type RevenueChartPoint } from "./_components/RevenueChart";
import TransactionsList, { type AdminRevenueTransaction } from "./_components/TransactionsList";
import type { Booking } from "@/types/booking";

const toAmount = (booking: Booking) => {
  const amount = Number(booking.totalPrice || booking.amount || 0);
  return Number.isFinite(amount) ? amount : 0;
};

const toIso = (value?: string | null) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return new Date(0).toISOString();
  return date.toISOString();
};

const classifyStatus = (status?: string): AdminRevenueTransaction["status"] => {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("paid") || normalized.includes("success")) return "success";
  if (normalized.includes("pending")) return "pending";
  return "failed";
};

const fetchAllBookings = async () => {
  const result: Booking[] = [];
  let pageNumber = 1;
  let totalPages = 1;
  const pageSize = 100;
  const maxPages = 30;

  while (pageNumber <= totalPages && pageNumber <= maxPages) {
    const response = await bookingRequest.getList({ pageNumber, pageSize });
    const page = response.data;

    result.push(...(page.items || []));
    totalPages = page.totalPages || 1;
    pageNumber += 1;
  }

  return result;
};

export default function AdminRevenuePage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-revenue-bookings"],
    queryFn: fetchAllBookings,
  });

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(toIso(b.paidAt || b.createdAt)).getTime() - new Date(toIso(a.paidAt || a.createdAt)).getTime()),
    [bookings]
  );

  const { stats, chartData, transactions } = useMemo(() => {
    const paid = sortedBookings.filter((booking) => classifyStatus(booking.status) === "success");
    const pending = sortedBookings.filter((booking) => classifyStatus(booking.status) === "pending");

    const totalRevenue = paid.reduce((sum, booking) => sum + toAmount(booking), 0);
    const commission = totalRevenue * 0.1;
    const pendingPayouts = pending.reduce((sum, booking) => sum + toAmount(booking), 0);
    const completedPayouts = Math.max(0, totalRevenue - commission);

    const computedStats: AdminRevenueStatsData = {
      totalRevenue,
      commission,
      pendingPayouts,
      completedPayouts,
    };

    const formatter = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });
    const now = new Date();
    const points: RevenueChartPoint[] = [];
    const map = new Map<string, RevenueChartPoint>();

    for (let offset = 6; offset >= 0; offset--) {
      const day = new Date(now);
      day.setDate(now.getDate() - offset);
      day.setHours(0, 0, 0, 0);

      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, "0");
      const date = String(day.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${date}`;

      const point: RevenueChartPoint = {
        label: formatter.format(day).replace(/\./g, ""),
        amount: 0,
      };

      points.push(point);
      map.set(key, point);
    }

    for (const booking of paid) {
      const source = new Date(toIso(booking.paidAt || booking.createdAt));
      const year = source.getFullYear();
      const month = String(source.getMonth() + 1).padStart(2, "0");
      const date = String(source.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${date}`;

      const bucket = map.get(key);
      if (bucket) {
        bucket.amount += toAmount(booking);
      }
    }

    const computedTransactions: AdminRevenueTransaction[] = sortedBookings.slice(0, 10).map((booking) => ({
      id: booking.id,
      description: `Booking #${booking.id.slice(0, 8).toUpperCase()} • ${booking.fullname || booking.email || "Ẩn danh"}`,
      date: new Date(toIso(booking.paidAt || booking.createdAt)).toLocaleString("vi-VN"),
      amount: toAmount(booking),
      status: classifyStatus(booking.status),
    }));

    return {
      stats: computedStats,
      chartData: points,
      transactions: computedTransactions,
    };
  }, [sortedBookings]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <AdminPageHeader
        title="Quản lý doanh thu"
        description="Tổng hợp booking toàn hệ thống theo thời gian thực từ API"
        badge={`${bookings.length} giao dịch`}
      />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 lg:space-y-5">
        <RevenueStats stats={stats} />
        <RevenueChart data={chartData} />
        <TransactionsList transactions={transactions} />
      </div>
    </div>
  );
}
