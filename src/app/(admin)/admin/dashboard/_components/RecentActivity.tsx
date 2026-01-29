import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MoreHorizontal } from "lucide-react";

interface RecentActivityProps {
  recentActivities: {
    user: string;
    action: string;
    target: string;
    time: string;
    avatar: string;
  }[]
}

export default function RecentActivity({ recentActivities }: RecentActivityProps) {
  return (
    <Card className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <h3 className="font-semibold text-foreground">Hoạt động mới nhất</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {!recentActivities || recentActivities.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">Chưa có hoạt động nào</div>
      ) : (
        <div className="divide-y divide-border/50">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <Avatar className="w-9 h-9 rounded-full overflow-hidden border border-border">
                <AvatarImage src={activity.avatar} className="object-cover w-full h-full" />
                <AvatarFallback className="w-full h-full flex items-center justify-center bg-secondary text-xs font-medium">
                  {activity.user[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  <span className="font-semibold">{activity.user}</span>
                  <span className="text-muted-foreground mx-1">{activity.action}</span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
