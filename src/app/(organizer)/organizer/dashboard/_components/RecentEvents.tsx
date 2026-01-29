import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, MoreHorizontal, ArrowUpRight } from "lucide-react";

interface RecentEventsProps {
  upcomingEvents: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    sold: number;
    total: number;
    status: string;
    revenue: string;
  }[]
}

export default function RecentEvents({ upcomingEvents }: RecentEventsProps) {
  return (
    <Card className="rounded-xl border border-border/50 bg-card shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <h3 className="font-semibold text-foreground">Sự kiện sắp tới</h3>
        <Link href="/organizer/events/create" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          Tất cả <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {!upcomingEvents || upcomingEvents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-sm">
          Chưa có sự kiện nào
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/organizer/events/${event.id}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                  {event.title}
                </Link>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${event.status === 'Sắp diễn ra' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    event.status === 'Sắp hết vé' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-green-50 text-green-600 border-green-200'
                  }`}>
                  {event.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="w-3 h-3" />
                <span>{event.date}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Vé đã bán</span>
                  <span className="font-medium">{event.sold}/{event.total}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(event.sold / event.total) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
