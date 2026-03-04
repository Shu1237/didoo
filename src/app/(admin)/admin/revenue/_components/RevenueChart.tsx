"use client";

import { Card } from "@/components/ui/card";

export interface RevenueChartPoint {
  label: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueChartPoint[];
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(value)))} VNĐ`;

export default function RevenueChart({ data }: RevenueChartProps) {
  const maxAmount = Math.max(...data.map((point) => point.amount), 1);

  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-900">Biểu đồ doanh thu 7 ngày</h3>
      </div>

      <div className="flex h-[260px] items-end gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
        {data.map((point) => {
          const height = Math.max((point.amount / maxAmount) * 100, 8);
          return (
            <div key={point.label} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div className="flex h-full w-full items-end rounded-lg border border-zinc-200 bg-white">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-indigo-500 to-sky-400"
                  style={{ height: `${point.amount > 0 ? height : 6}%` }}
                  title={formatCurrency(point.amount)}
                />
              </div>
              <p className="text-[11px] text-zinc-500">{point.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
