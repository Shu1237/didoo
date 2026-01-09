import { Card } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


interface RecentActivityProps {
  recentActivities: {
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
  }[]
}

export default function RecentActivity({recentActivities}: RecentActivityProps) {
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-md border-border/50 shadow-sm">
      <h3 className="text-xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent w-fit">
        Hoạt động gần đây
      </h3>

      {!recentActivities || recentActivities.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Chưa có hoạt động nào</p>
      ) : (
        <div className="space-y-6">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 group">
              <Avatar className="w-10 h-10 border border-primary/20">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback className="text-primary font-bold bg-primary/5">
                  {activity.user[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm leading-none">
                  <span className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium text-foreground">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
