"use client";

import { Card } from "@/components/ui/card";


const mockStats = {
  totalRevenue: 1250000000,      // 1.25 tỷ VNĐ
  commission: 125000000,         // 125 triệu (10%)
  pendingPayouts: 320000000,     // 320 triệu
  completedPayouts: 805000000,   // 805 triệu
};

function formatVND(amount: number) {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ VNĐ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)} triệu VNĐ`;
  return `${amount.toLocaleString("vi-VN")} VNĐ`;
}

export default function RevenueStats() {
  const statCards = [
    { label: "Tổng doanh thu", value: formatVND(mockStats?.totalRevenue || 0) },
    { label: "Hoa hồng", value: formatVND(mockStats?.commission || 0) },
    { label: "Thanh toán chờ xử lý", value: formatVND(mockStats?.pendingPayouts || 0) },
    { label: "Thanh toán hoàn tất", value: formatVND(mockStats?.completedPayouts || 0) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 bg-white border-zinc-200 shadow-sm">
          <p className="text-sm text-zinc-500">{stat.label}</p>
          <p className="text-2xl font-bold mt-2 text-zinc-900">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
