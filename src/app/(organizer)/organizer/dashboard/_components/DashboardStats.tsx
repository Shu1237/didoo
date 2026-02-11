import { Card } from "@/components/ui/card";
import { Wallet, Ticket, Calendar, Users, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStatsProps {
  reportData: {
    title: string;
    value: string;
    change: string;
    trend: string
    icon: string;
    description: string;
  }[]
}

export default function DashboardStats({ reportData }: DashboardStatsProps) {
  const iconMap: any = {
    Wallet,
    Ticket,
    Calendar,
    Users
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {reportData.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        const isTrendUp = stat.trend === 'up';

        return (
          <Card key={index} className="p-4 rounded-[28px] border border-zinc-100 bg-white hover:border-primary/20 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-[24px] rounded-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              {isTrendUp ? (
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                  <TrendingDown className="w-3 h-3" />
                  {stat.change}
                </div>
              )}
            </div>

            <div className="space-y-0.5 relative z-10">
              <h3 className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-primary transition-colors">{stat.value}</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 group-hover:text-zinc-500 transition-colors italic truncate">{stat.title}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
