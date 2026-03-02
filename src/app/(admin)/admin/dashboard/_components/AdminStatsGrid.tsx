"use client";

import { Card } from "@/components/ui/card";
import {
  BadgeDollarSign,
  Building2,
  CalendarDays,
  FolderTree,
  ReceiptText,
  Users,
} from "lucide-react";

interface AdminStatsGridProps {
  totalUsers: number;
  totalOrganizers: number;
  pendingOrganizers: number;
  totalEvents: number;
  activeEvents: number;
  totalCategories: number;
  paidBookings: number;
  paidRatio: number;
  totalRevenue: number;
  averageOrderValue: number;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}

function MetricCard({
  title,
  value,
  description,
  iconClassName,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  iconClassName: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
        <div className={`rounded-lg border px-2 py-1 ${iconClassName}`}>{icon}</div>
      </div>

      <p className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </Card>
  );
}

export default function AdminStatsGrid({
  totalUsers,
  totalOrganizers,
  pendingOrganizers,
  totalEvents,
  activeEvents,
  totalCategories,
  paidBookings,
  paidRatio,
  totalRevenue,
  averageOrderValue,
  formatNumber,
  formatCurrency,
}: AdminStatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <MetricCard
        title="Tong users"
        value={formatNumber(totalUsers)}
        description="Tat ca tai khoan nguoi dung"
        iconClassName="border-blue-200 bg-blue-50 text-blue-700"
        icon={<Users className="h-4 w-4" />}
      />

      <MetricCard
        title="Tong organizers"
        value={formatNumber(totalOrganizers)}
        description={`${formatNumber(pendingOrganizers)} dang cho duyet`}
        iconClassName="border-violet-200 bg-violet-50 text-violet-700"
        icon={<Building2 className="h-4 w-4" />}
      />

      <MetricCard
        title="Tong su kien"
        value={formatNumber(totalEvents)}
        description={`${formatNumber(activeEvents)} dang hoat dong`}
        iconClassName="border-emerald-200 bg-emerald-50 text-emerald-700"
        icon={<CalendarDays className="h-4 w-4" />}
      />

      <MetricCard
        title="Danh muc"
        value={formatNumber(totalCategories)}
        description="So danh muc dang quan ly"
        iconClassName="border-zinc-200 bg-zinc-50 text-zinc-700"
        icon={<FolderTree className="h-4 w-4" />}
      />

      <MetricCard
        title="Paid bookings"
        value={formatNumber(paidBookings)}
        description={`${paidRatio.toFixed(1)}% thanh cong`}
        iconClassName="border-cyan-200 bg-cyan-50 text-cyan-700"
        icon={<ReceiptText className="h-4 w-4" />}
      />

      <MetricCard
        title="Tong doanh thu"
        value={formatCurrency(totalRevenue)}
        description={`AOV: ${formatCurrency(averageOrderValue)}`}
        iconClassName="border-amber-200 bg-amber-50 text-amber-700"
        icon={<BadgeDollarSign className="h-4 w-4" />}
      />
    </section>
  );
}
