import { Card } from "@/components/ui/card";
import Link from "next/link";
import { upcomingEvents } from "@/utils/mockOrganizer";
import { Calendar, MapPin, Ticket } from "lucide-react";

export default function RecentEvents() {
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-md border-border/50 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Sự kiện sắp tới
        </h3>
        <Link href="/organizer/events/create" className="text-sm font-medium text-primary hover:underline">
          + Tạo mới
        </Link>
      </div>

      {!upcomingEvents || upcomingEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chưa có sự kiện nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-4 rounded-xl border border-border/50 hover:bg-secondary/30 transition-colors group">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/organizer/events/${event.id}`} className="font-semibold text-lg hover:text-primary transition-colors block">
                    {event.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${event.status === 'Sắp diễn ra' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    event.status === 'Sắp hết vé' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-green-50 text-green-600 border-green-200'
                  }`}>
                  {event.status}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{event.sold}</span>
                    <span className="text-muted-foreground">/{event.total} vé</span>
                  </div>
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden ml-2">
                    <div className="h-full bg-primary" style={{ width: `${(event.sold / event.total) * 100}%` }} />
                  </div>
                </div>
                <span className="font-bold text-primary">{event.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
