"use client";

import { Card } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
}

interface StatWithChartCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  data: ChartData[];
  barColor?: "green" | "red" | "blue" | "gold"; // Added gold
}

export default function StatWithChartCard({
  title,
  value,
  change,
  trend,
  data,
  barColor = "gold",
}: StatWithChartCardProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  // Simplified color logic
  const isNegative = trend === "down";

  return (
    <Card className="p-8 bg-white border-none shadow-sm rounded-[32px]">
      <div className="flex items-start justify-between mb-6">
        <h3 className="font-bold text-lg text-zinc-900">{title}</h3>
        <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-baseline gap-3 mb-8">
        <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${isNegative ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {change} <span className="font-medium text-zinc-500">so với năm ngoái</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-32 relative">
        {/* Dotted lines background mock */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
          <div className="w-full h-px bg-zinc-100 border-t border-dashed border-zinc-200" />
          <div className="w-full h-px bg-zinc-100 border-t border-dashed border-zinc-200" />
          <div className="w-full h-px bg-zinc-100 border-t border-dashed border-zinc-200" />
        </div>

        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isMax = item.value === maxValue;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 min-w-0 z-10 group relative">
              {/* Tooltip on hover */}
              {isMax && (
                <div className="absolute -top-10 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg mb-1 pointer-events-none transform transition-transform">
                  ${item.value.toLocaleString()}
                </div>
              )}

              <div
                className={`w-full max-w-[24px] mx-auto rounded-t-lg min-h-[8px] transition-all duration-500 ${isMax
                  ? (barColor === 'gold' ? 'bg-gradient-to-b from-[#FCD34D] to-[#F59E0B]' : 'bg-zinc-800')
                  : 'bg-gradient-to-b from-zinc-100 to-zinc-200 group-hover:from-zinc-200 group-hover:to-zinc-300'
                  }`}
                style={{
                  height: `${Math.max((item.value / maxValue) * 100, 10)}%`,
                }}
              />
              <span className="text-[10px] font-medium text-zinc-400 truncate w-full text-center">{item.name}</span>
            </div>
          )
        })}
      </div>
    </Card>
  );
}
