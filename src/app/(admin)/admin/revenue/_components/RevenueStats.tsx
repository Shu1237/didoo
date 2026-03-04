"use client";

import { Card } from "@/components/ui/card";

export interface AdminRevenueStatsData {
  totalRevenue: number;
  commission: number;
  pendingPayouts: number;
  completedPayouts: number;
}

interface RevenueStatsProps {
  stats: AdminRevenueStatsData;
}

const formatCurrencyCompact = (value: number) => {
  const amount = Math.max(0, value);
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ VNĐ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu VNĐ`;
  return `${new Intl.NumberFormat("vi-VN").format(amount)} VNĐ`;
};

export default function RevenueStats({ stats }: RevenueStatsProps) {
  const statCards = [
    { label: "Tổng doanh thu", value: formatCurrencyCompact(stats.totalRevenue) },
    { label: "Hoa hồng nền tảng", value: formatCurrencyCompact(stats.commission) },
    { label: "Khoản chờ xử lý", value: formatCurrencyCompact(stats.pendingPayouts) },
    { label: "Khoản đã hoàn tất", value: formatCurrencyCompact(stats.completedPayouts) },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">{stat.label}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
