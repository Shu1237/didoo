"use client";

import { Card } from "@/components/ui/card";

// TODO: Implement chart with a charting library
export default function RevenueChart() {
  return (
    <Card className="p-6 bg-white border-zinc-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900">Biểu đồ doanh thu</h3>
      <div className="h-64 flex items-center justify-center text-zinc-500 bg-zinc-50 rounded-lg border border-zinc-200">
        Biểu đồ doanh thu sẽ được hiển thị ở đây
      </div>
    </Card>
  );
}
