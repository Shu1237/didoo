import { Card } from "@/components/ui/card";


import { Wallet, Users, Calendar, Ticket } from "lucide-react";


interface AdminStatsProps {
  adminStats: {
    title: string;
    value: string;
    change: string;
    trend: string;
    icon: string;
    description: string;
  }[]

}
export default function AdminStats({ adminStats }: AdminStatsProps) {
  const iconMap: any = {
    Wallet,
    Users,
    Calendar,
    Ticket
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {adminStats.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        return (
          <Card key={index} className="p-6 bg-background/60 backdrop-blur-md border-border/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {Icon && <Icon className="w-6 h-6" />}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
