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
    <Card className="rounded-[32px] border border-zinc-100 bg-white h-full flex flex-col overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center text-primary border border-zinc-100">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black tracking-tighter text-zinc-900 uppercase italic">Events</h3>
        </div>
        <Link href="/organizer/events/create" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5">
          All <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {!upcomingEvents || upcomingEvents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8 text-zinc-400 text-xs font-semibold italic">
          No events found
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 flex-1 overflow-auto scrollbar-thin">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-zinc-50 transition-all duration-500 group">
              <div className="flex justify-between items-start gap-3 mb-4">
                <Link href={`/organizer/events/${event.id}`} className="text-sm font-black text-zinc-900 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
                  {event.title}
                </Link>
                <span className={`shrink-0 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${event.status === 'Sắp diễn ra' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    event.status === 'Sắp hết vé' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                  {event.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 mb-5">
                <div className="flex items-center gap-2 bg-zinc-100/50 px-3 py-1.5 rounded-lg border border-zinc-100">
                  <Calendar className="w-3 h-3 text-zinc-400" />
                  <span>{event.date}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-zinc-400">Sold</span>
                  <span className="text-zinc-800">{event.sold} / {event.total}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/30">
                  <div
                    className="h-full bg-linear-to-r from-primary to-primary/80 rounded-full shadow-sm"
                    style={{ width: `${(event.sold / event.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
