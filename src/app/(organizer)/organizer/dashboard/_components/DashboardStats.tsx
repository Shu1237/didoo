import { Card } from "@/components/ui/card";
import { organizerStats } from "@/utils/mockOrganizer";
import { Wallet, Ticket, Calendar, Users } from "lucide-react";

export default function DashboardStats() {
  const iconMap: any = {
    Wallet,
    Ticket,
    Calendar,
    Users
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {organizerStats.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        return (
          <Card key={index} className="p-6 bg-background/60 backdrop-blur-md border-border/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {Icon && <Icon className="w-6 h-6" />}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-secondary text-muted-foreground'}`}>
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
