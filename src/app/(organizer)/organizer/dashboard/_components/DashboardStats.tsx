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
          <Card key={index} className="p-5 rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-secondary text-foreground">
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              {isTrendUp ? (
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded-md">
                  <TrendingDown className="w-3 h-3" />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
