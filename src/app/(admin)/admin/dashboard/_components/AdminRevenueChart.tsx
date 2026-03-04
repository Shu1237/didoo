"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

export interface AdminRevenueTrendPoint {
  label: string;
  amount: number;
  count: number;
}

interface AdminRevenueChartProps {
  trendData: AdminRevenueTrendPoint[];
  todayRevenue: number;
  paidBookings7Days: number;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}

export default function AdminRevenueChart({
  trendData,
  todayRevenue,
  paidBookings7Days,
  formatNumber,
  formatCurrency,
}: AdminRevenueChartProps) {
  const maxAmount = Math.max(...trendData.map((point) => point.amount), 1);
  const maxCount = Math.max(...trendData.map((point) => point.count), 1);

  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Revenue & Paid Orders (7 days)</h3>
          <p className="text-xs text-zinc-500">Doanh thu chi tinh tu booking paid/success.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:w-[360px]">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-[11px] text-zinc-500">Doanh thu hom nay</p>
            <p className="text-sm font-semibold text-zinc-900">{formatCurrency(todayRevenue)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-[11px] text-zinc-500">Paid bookings 7 ngay</p>
            <p className="text-sm font-semibold text-zinc-900">{formatNumber(paidBookings7Days)}</p>
          </div>
        </div>
      </div>

      <div className="h-[320px] rounded-xl border border-zinc-100 bg-zinc-50 px-2 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData}>
            <defs>
              <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              width={70}
              domain={[0, maxAmount]}
              tickFormatter={(value: number) => formatNumber(Math.round(value))}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={36}
              domain={[0, maxCount]}
              tickFormatter={(value: number) => formatNumber(Math.round(value))}
            />
            <Tooltip
              formatter={(value: number | string | undefined, name: string | undefined) => {
                const numeric = Number(value) || 0;
                if (name === "amount") return [formatCurrency(numeric), "Doanh thu"];
                return [formatNumber(numeric), "Paid bookings"];
              }}
              labelFormatter={(label: any) => `Ngay: ${label}`}
            />
            <Legend formatter={(value: string) => (value === "amount" ? "Doanh thu" : "Paid bookings")} />
            <Bar yAxisId="right" dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={16} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="amount"
              stroke="#0284c7"
              strokeWidth={2.5}
              fill="url(#adminRevenueGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
