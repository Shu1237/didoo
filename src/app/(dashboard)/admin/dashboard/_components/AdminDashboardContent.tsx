"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useGetUsers } from "@/hooks/useAuth";
import { useGetOrganizers, useGetEvents } from "@/hooks/useEvent";
import { bookingRequest } from "@/apiRequest/bookingService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventStatus, OrganizerStatus, BookingStatus } from "@/utils/enum";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  ArrowRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

const formatNumber = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
const formatCurrency = (n: number) => `${formatNumber(Math.round(n))}₫`;

const CHART_COLORS = ["#EA580C", "#0D9488", "#7C3AED", "#059669", "#DC2626"];

export function AdminDashboardContent() {
  const { data: usersRes } = useGetUsers({ pageSize: 1 });
  const { data: organizersRes } = useGetOrganizers({ pageSize: 1 });
  const { data: pendingOrgRes } = useGetOrganizers({ pageSize: 1, status: OrganizerStatus.PENDING });
  const { data: eventsRes } = useGetEvents({ pageSize: 1 });
  const { data: openedRes } = useGetEvents({ pageSize: 1, status: EventStatus.OPENED });
  const { data: publishedRes } = useGetEvents({ pageSize: 1, status: EventStatus.PUBLISHED });
  const { data: pendingEventsRes } = useGetEvents({ pageSize: 1, status: EventStatus.DRAFT });
  const { data: bookingsRes } = useQuery({
    queryKey: ["admin-dashboard-bookings"],
    queryFn: async () => {
      const [all, paid] = await Promise.all([
        bookingRequest.getList({ pageNumber: 1, pageSize: 500 }),
        bookingRequest.getList({ pageNumber: 1, pageSize: 500, status: BookingStatus.PAID }),
      ]);
      return { all: all.data.items, paid: paid.data.items };
    },
  });
  const totalUsers = usersRes?.data?.totalItems ?? 0;
  const totalOrganizers = organizersRes?.data?.totalItems ?? 0;
  const pendingOrganizers = pendingOrgRes?.data?.totalItems ?? 0;
  const totalEvents = eventsRes?.data?.totalItems ?? 0;
  const activeEvents = (openedRes?.data?.totalItems ?? 0) + (publishedRes?.data?.totalItems ?? 0);
  const pendingEvents = pendingEventsRes?.data?.totalItems ?? 0;
  const allBookings = bookingsRes?.all ?? [];
  const paidBookings = bookingsRes?.paid ?? [];
  const totalRevenue = paidBookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0);
  const avgOrder = paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;
  const orderStatusData = useMemo(() => {
    const paid = allBookings.filter((b) => {
      const s = String(b.status ?? "").toLowerCase();
      return s === "2" || s === "paid" || s.includes("success");
    }).length;
    const pending = allBookings.filter((b) => {
      const s = String(b.status ?? "").toLowerCase();
      return s === "1" || s.includes("pending");
    }).length;
    const cancelled = allBookings.filter((b) => {
      const s = String(b.status ?? "").toLowerCase();
      return s === "3" || s.includes("cancel");
    }).length;
    const total = paid + pending + cancelled || 1;
    return [
      { name: "Đã thanh toán", value: paid, percent: Math.round((paid / total) * 100), fill: CHART_COLORS[3] },
      { name: "Chờ thanh toán", value: pending, percent: Math.round((pending / total) * 100), fill: CHART_COLORS[0] },
      { name: "Đã hủy", value: cancelled, percent: Math.round((cancelled / total) * 100), fill: CHART_COLORS[4] },
    ].filter((d) => d.value > 0);
  }, [allBookings]);

  const revenueTrendData = useMemo(() => {
    const last30Days: { date: string; revenue: number; orders: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last30Days.push({
        date: key,
        revenue: 0,
        orders: 0,
      });
    }
    const map = new Map(last30Days.map((d) => [d.date, d]));
    for (const b of paidBookings) {
      const createdAt = b.paidAt || b.createdAt;
      if (!createdAt) continue;
      const key = createdAt.slice(0, 10);
      const entry = map.get(key);
      if (entry) {
        entry.revenue += Number(b.totalPrice) || 0;
        entry.orders += 1;
      }
    }
    return last30Days;
  }, [paidBookings]);

  const recentTransactions = useMemo(() => {
    return [...allBookings]
      .sort((a, b) => {
        const da = new Date(a.paidAt || a.createdAt || 0).getTime();
        const db = new Date(b.paidAt || b.createdAt || 0).getTime();
        return db - da;
      })
      .slice(0, 15);
  }, [allBookings]);

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "—";
  };

  const getStatusLabel = (status: string | number | undefined) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "2" || s.includes("paid") || s.includes("success")) return { label: "HOÀN TẤT", variant: "default" as const };
    if (s === "1" || s.includes("pending")) return { label: "CHỜ XỬ LÝ", variant: "secondary" as const };
    if (s === "3" || s.includes("cancel")) return { label: "ĐÃ HỦY", variant: "destructive" as const };
    return { label: "CHỜ XỬ LÝ", variant: "secondary" as const };
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* System Overview */}
      <Card className="min-w-0 border-zinc-200">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Tổng quan hệ thống</CardTitle>
            <CardDescription>
              Hiệu suất và thống kê thời gian thực — {new Date().toLocaleDateString("vi-VN", { dateStyle: "long" })}
            </CardDescription>
          </div>
          <Button size="sm" className="w-fit bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-zinc-500">Người dùng</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{formatNumber(totalUsers)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                +12.5% so với tháng trước
              </p>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-zinc-500">Organizer</span>
                {pendingOrganizers > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {pendingOrganizers} chờ duyệt
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{formatNumber(totalOrganizers)}</p>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-zinc-500">Sự kiện đang mở</span>
                {activeEvents > 0 && (
                  <Badge variant="default" className="ml-auto text-[10px]">
                    Live
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{formatNumber(activeEvents)}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {totalEvents} tổng · {pendingEvents} chờ duyệt
              </p>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-zinc-500">Doanh thu</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{formatCurrency(totalRevenue)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                TB: {formatCurrency(avgOrder)}/đơn
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        {/* Revenue Trend */}
        <Card className="min-w-0 border-zinc-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Xu hướng doanh thu</CardTitle>
            <CardDescription>30 ngày gần nhất</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="h-[280px] min-h-0 w-full min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("vi-VN", { day: "2-digit", month: "short" })}
                  />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.[0] ? (
                        <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md">
                          <p className="text-xs text-zinc-500">
                            {label ? new Date(label).toLocaleDateString("vi-VN", { dateStyle: "long" }) : ""}
                          </p>
                          <p className="font-semibold text-zinc-900">{formatCurrency(Number(payload[0].value) || 0)}</p>
                        </div>
                      ) : null
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EA580C"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="min-w-0 border-zinc-200">
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
            <CardDescription>{formatNumber(allBookings.length)} đơn tổng</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="flex h-[240px] min-w-0 items-center justify-center">
              {orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md">
                            <p className="font-medium text-zinc-900">{payload[0].payload.name}</p>
                            <p className="text-sm text-zinc-600">
                              {payload[0].value} đơn ({payload[0].payload.percent}%)
                            </p>
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-zinc-500">Chưa có dữ liệu đơn hàng</p>
              )}
            </div>
            {orderStatusData.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {orderStatusData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-xs text-zinc-600">
                      {d.name}: {d.percent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Giao dịch gần đây - Table */}
      <Card className="min-w-0 border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>Dữ liệu {formatNumber(allBookings.length)} giao dịch mới nhất</CardDescription>
          </div>
          <Link href="/admin/revenue">
            <Button variant="ghost" size="sm">
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            {recentTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent">
                    <TableHead className="font-semibold text-zinc-600">MÃ ĐƠN</TableHead>
                    <TableHead className="font-semibold text-zinc-600">KHÁCH HÀNG</TableHead>
                    <TableHead className="font-semibold text-zinc-600">NGÀY ĐẶT</TableHead>
                    <TableHead className="font-semibold text-zinc-600">GIÁ TRỊ</TableHead>
                    <TableHead className="font-semibold text-zinc-600">TRẠNG THÁI</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((b) => {
                    const statusInfo = getStatusLabel(b.status);
                    return (
                      <TableRow key={b.id} className="border-zinc-100">
                        <TableCell className="font-mono text-zinc-700">
                          #DH-{b.id.replace(/-/g, "").slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-zinc-200">
                              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                {getInitials(b.fullname || "")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-zinc-900">{b.fullname || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-600">
                          {b.paidAt || b.createdAt
                            ? new Date(b.paidAt || b.createdAt!).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="font-semibold text-zinc-900">
                          {formatCurrency(Number(b.totalPrice) || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href="/admin/revenue" className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-sm text-zinc-500">Chưa có giao dịch</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
