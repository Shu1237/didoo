import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Wallet, Ticket, Calendar, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardStatsProps {
  reportData: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: string;
    description: string;
  }[];
}

const iconMap = {
  Wallet,
  Ticket,
  Calendar,
  Users,
};

const trendStyles: Record<"up" | "down" | "neutral", string> = {
  up: "border-emerald-200 bg-emerald-50 text-emerald-700",
  down: "border-rose-200 bg-rose-50 text-rose-700",
  neutral: "border-zinc-200 bg-zinc-100 text-zinc-600",
};

export default function DashboardStats({ reportData }: DashboardStatsProps) {
  if (!reportData || reportData.length === 0) {
    return (
      <Card className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Chưa có dữ liệu dashboard từ API.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {reportData.map((stat, index) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? Calendar;
        const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;

        return (
          <Card
            key={`${stat.title}-${index}`}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  trendStyles[stat.trend]
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {stat.change}
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{stat.title}</p>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
