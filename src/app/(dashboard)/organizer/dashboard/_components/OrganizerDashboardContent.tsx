"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetMe } from "@/hooks/useAuth";
import { useOrganizerStats } from "@/hooks/useEvent";
import { useGetBookings, useGetResales, useGetResaleTransactions } from "@/hooks/useBooking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventStatus } from "@/utils/enum";
import {
  DollarSign,
  Ticket,
  ArrowLeftRight,
  Gem,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";

const statusLabels: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: "Nháp",
  [EventStatus.PUBLISHED]: "Đã duyệt",
  [EventStatus.CANCELLED]: "Đã hủy",
  [EventStatus.OPENED]: "Đang mở",
  [EventStatus.CLOSED]: "Đã đóng",
};

const formatNumber = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
const formatCurrency = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B VNĐ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M VNĐ`;
  return `${formatNumber(Math.round(n))} VNĐ`;
};

function formatDate(s: string | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return s;
  }
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop";

export function OrganizerDashboardContent() {
  const { data: meRes } = useGetMe();
  const organizerId = meRes?.data?.organizerId ?? undefined;
  const { stats, chartData, events, isLoading } = useOrganizerStats(organizerId);
  const { data: bookingsRes } = useGetBookings(
    { pageNumber: 1, pageSize: 500, isDescending: true },
    { enabled: !!organizerId }
  );
  const { data: resaleRes } = useGetResales(
    { pageNumber: 1, pageSize: 200, isDescending: true },
    { enabled: !!organizerId }
  );
  const { data: resaleTransactionsRes } = useGetResaleTransactions(
    { pageNumber: 1, pageSize: 200, isDescending: true },
    { enabled: !!organizerId }
  );

  const eventIdSet = useMemo(() => new Set(events.map((e) => e.id)), [events]);
  const myBookings = useMemo(
    () => (bookingsRes?.data.items ?? []).filter((b) => eventIdSet.has(b.eventId)),
    [bookingsRes?.data.items, eventIdSet]
  );
  const paidBookings = useMemo(
    () => myBookings.filter((b) => /paid|success|2/i.test(String(b.status ?? ""))),
    [myBookings]
  );
  const myRevenue = useMemo(
    () => paidBookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0),
    [paidBookings]
  );
  const ticketsSold = useMemo(
    () => paidBookings.reduce((sum, b) => sum + Number(b.amount || 0), 0),
    [paidBookings]
  );
  const myResaleTransactions = resaleTransactionsRes?.data.items ?? [];
  const completedResaleTransactions = myResaleTransactions.filter((t) =>
    /paid|success|completed/i.test(String(t.status ?? ""))
  );
  const resaleVolume = useMemo(
    () => completedResaleTransactions.reduce((s, t) => s + Number(t.cost || 0), 0),
    [completedResaleTransactions]
  );
  const tradeCount = myResaleTransactions.length;

  const kpiCards = useMemo(
    () => [
      {
        title: "Tổng doanh số",
        value: formatCurrency(myRevenue),
        change: "+12.5% so với tháng trước",
        icon: DollarSign,
        trend: "up" as const,
      },
      {
        title: "Vé đã bán",
        value: formatNumber(ticketsSold),
        change: stats[1]?.change ? `${stats[1].change} tỉ lệ lấp đầy` : "—",
        icon: Ticket,
        trend: "up" as const,
      },
      {
        title: "Khối lượng Resale",
        value: formatCurrency(resaleVolume),
        change: "+15.4% phí bản quyền",
        icon: ArrowLeftRight,
        trend: "up" as const,
      },
      {
        title: "Chỉ số Trade",
        value: formatNumber(tradeCount),
        change: "+5.7% tương tác",
        icon: Gem,
        trend: "up" as const,
      },
    ],
    [myRevenue, ticketsSold, resaleVolume, tradeCount, stats]
  );

  const recentEvents = useMemo(() => {
    const now = new Date();
    return events
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 3)
      .map((e) => {
        const eventRevenue = paidBookings
          .filter((b) => b.eventId === e.id)
          .reduce((s, b) => s + Number(b.totalPrice || 0), 0);
        const sold = paidBookings
          .filter((b) => b.eventId === e.id)
          .reduce((s, b) => s + Number(b.amount || 0), 0);
        const total = Math.max(sold, 50);
        const percent = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
        let statusBadge: "LIVE" | "SẮP DIỄN RA" | "ĐÃ KẾT THÚC" = "SẮP DIỄN RA";
        if (e.status === EventStatus.OPENED || e.status === EventStatus.PUBLISHED) {
          const endTime = new Date(e.endTime || e.startTime);
          statusBadge = endTime >= now ? "LIVE" : "ĐÃ KẾT THÚC";
        } else if (e.status === EventStatus.CLOSED || e.status === EventStatus.CANCELLED) {
          statusBadge = "ĐÃ KẾT THÚC";
        }
        return { ...e, eventRevenue, percent, statusBadge };
      });
  }, [events, paidBookings]);

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

  return (
    <div className="min-w-0 space-y-6">
      {/* Organizer Overview */}
      <Card className="min-w-0 border-zinc-200">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Tổng quan tổ chức</CardTitle>
            <CardDescription>
              Hiệu suất bán vé và hoạt động thị trường thứ cấp
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3.5 w-3.5" />
              30 ngày qua
            </Badge>
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/organizer/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Tạo sự kiện mới
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <kpi.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500">{kpi.title}</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900">{kpi.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {kpi.change}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Doanh thu vé mỗi ngày */}
        <Card className="min-w-0 border-zinc-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu vé mỗi ngày</CardTitle>
            <CardDescription>7 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] min-h-0 w-full min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.[0] ? (
                        <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md">
                          <p className="font-medium text-zinc-900">{payload[0].payload.name}</p>
                          <p className="text-sm text-zinc-600">
                            {formatNumber(Number(payload[0].value) || 0)} vé
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="sales" fill="#EA580C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tăng trưởng doanh thu */}
        <Card className="min-w-0 border-zinc-200">
          <CardHeader>
            <CardTitle>Tăng trưởng doanh thu</CardTitle>
            <CardDescription>Sự ổn định của thị trường resale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-bold text-primary">
              {stats[3]?.change ?? "+0%"}
            </div>
            <div className="h-[180px] min-h-0 w-full min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="orgRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} hide />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.[0] ? (
                        <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md">
                          <p className="font-medium text-zinc-900">{payload[0].payload.name}</p>
                          <p className="text-sm text-zinc-600">
                            {formatNumber(Number(payload[0].value) || 0)} vé
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#EA580C"
                    strokeWidth={2}
                    fill="url(#orgRevenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sự kiện hoạt động gần đây */}
      <Card className="min-w-0 border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sự kiện hoạt động gần đây</CardTitle>
            <CardDescription>Tối đa 3 sự kiện mới nhất</CardDescription>
          </div>
          <Link href="/organizer/events">
            <Button variant="ghost" size="sm">
              Xem tất cả sự kiện
              <ArrowLeftRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((e) => (
                <Link
                  key={e.id}
                  href={`/organizer/events/${e.id}`}
                  className="group overflow-hidden rounded-xl border border-zinc-200 transition hover:border-primary/50 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full bg-zinc-100">
                    <Image
                      src={e.thumbnailUrl || e.bannerUrl || FALLBACK_IMAGE}
                      alt={e.name}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge
                        variant={
                          e.statusBadge === "LIVE"
                            ? "default"
                            : e.statusBadge === "SẮP DIỄN RA"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          e.statusBadge === "LIVE"
                            ? "bg-emerald-500"
                            : e.statusBadge === "SẮP DIỄN RA"
                              ? "bg-primary"
                              : ""
                        }
                      >
                        {e.statusBadge}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-zinc-900 truncate">{e.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(e.startTime)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex flex-1 items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${e.percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-zinc-600">
                          {e.percent}% vé đã bán
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(e.eventRevenue)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full py-8 text-center text-sm text-zinc-500">
                Chưa có sự kiện nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
