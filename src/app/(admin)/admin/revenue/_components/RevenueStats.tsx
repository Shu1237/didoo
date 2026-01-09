"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";


const mockStats = {
  totalRevenue: 1250000000,      // 1.25 tỷ VNĐ
  commission: 125000000,         // 125 triệu (10%)
  pendingPayouts: 320000000,     // 320 triệu
  completedPayouts: 805000000,   // 805 triệu
};

export default function RevenueStats() {


  const statCards = [
    { label: "Tổng doanh thu", value: `${mockStats?.totalRevenue || 0} VNĐ` },
    { label: "Hoa hồng", value: `${mockStats?.commission || 0} VNĐ` },
    { label: "Thanh toán chờ xử lý", value: `${mockStats?.pendingPayouts || 0} VNĐ` },
    { label: "Thanh toán hoàn tất", value: `${mockStats?.completedPayouts || 0} VNĐ` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
