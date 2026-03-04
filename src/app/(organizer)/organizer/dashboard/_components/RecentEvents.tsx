import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CalendarClock, MapPin, Ticket, ArrowRight } from "lucide-react";

export type RecentEventTone = "success" | "warning" | "danger" | "neutral";

export interface RecentEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  sold: number;
  total: number;
  fillRate: number;
  statusLabel: string;
  statusTone: RecentEventTone;
}

interface RecentEventsProps {
  upcomingEvents: RecentEventItem[];
}

const statusStyles: Record<RecentEventTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  neutral: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export default function RecentEvents({ upcomingEvents }: RecentEventsProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Sự kiện gần nhất</h3>
          <p className="text-xs text-zinc-500">Theo dõi trạng thái bán vé theo từng sự kiện</p>
        </div>

        <Link
          href="/organizer/events"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
        >
          Xem tất cả
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {!upcomingEvents || upcomingEvents.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-sm text-zinc-500">Chưa có sự kiện nào từ API.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="divide-y divide-zinc-100">
            {upcomingEvents.map((event) => {
              const progress = Math.max(0, Math.min(100, event.fillRate));

              return (
                <div key={event.id} className="space-y-3 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/organizer/events/${event.id}`}
                      className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors hover:text-primary"
                    >
                      {event.title}
                    </Link>

                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        statusStyles[event.statusTone]
                      )}
                    >
                      {event.statusLabel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {event.date} • {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Ticket className="h-3.5 w-3.5" />
                        {event.sold} / {event.total} vé
                      </span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
