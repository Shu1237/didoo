"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Calendar as CalendarIcon, MapPin, ArrowRight } from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";
import { useEvent } from "@/hooks/useEvent";
import EventDetailModal from "./EventDetailModal";

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { update } = useEvent();

  const handleApprove = (event: Event) => {
    update.mutate({
      id: event.id,
      body: { Status: EventStatus.PUBLISHED }
    });
  };

  const handleReject = (event: Event) => {
    update.mutate({
      id: event.id,
      body: { Status: EventStatus.CANCELLED }
    });
  };

  if (!events || events.length === 0) {
    return (
      <Card className="p-16 text-center bg-white/50 backdrop-blur-sm border-zinc-200 border-dashed shadow-none rounded-[32px]">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Bạn chưa có sự kiện nào để quản lý.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {events.map((event: any) => {
        const isPending = event.status === 0; // Draft/Pending
        const isActive = event.status === 1;

        return (
          <Card key={event.id} className="p-4 bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px] border group">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-zinc-100 bg-zinc-50 relative group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={event.thumbnailUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[13px] text-zinc-900 leading-tight">
                      {event.name}
                    </p>
                    <Badge variant="secondary" className="bg-zinc-50 text-zinc-400 border-zinc-100 rounded-full px-1.5 py-0 text-[10px] font-bold uppercase tracking-widest">
                      {event.category?.name || "Event"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar className="w-4 h-4 shrink-0">
                        <AvatarImage src={event.organizer?.logoUrl || ""} />
                        <AvatarFallback className="text-[6px] font-bold">{event.organizer?.name?.[0] || "O"}</AvatarFallback>
                      </Avatar>
                      <p className="text-[11px] text-zinc-500 font-bold truncate">
                        {event.organizer?.name}
                      </p>
                    </div>
                    <span className="w-1 h-1 bg-zinc-200 rounded-full shrink-0" />
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider shrink-0">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(event.startTime).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  className={`hidden md:flex rounded-full px-2.5 py-0.5 border-none pointer-events-none uppercase text-[8px] tracking-widest font-bold ${isActive ? "bg-emerald-500 text-white" : isPending ? "bg-amber-500 text-white" : "bg-zinc-500 text-white"
                    }`}
                >
                  {isActive ? "Đang diễn ra" : isPending ? "Chờ duyệt" : "Khác"}
                </Badge>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedEvent(event)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-zinc-100 text-zinc-600 rounded-full px-4 h-9 text-xs font-bold hidden sm:flex items-center gap-2 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-zinc-200"
                  >
                    Chi tiết
                    <ArrowRight className="w-3 h-3" />
                  </Button>

                  {isPending && (
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleApprove(event)}
                        disabled={update.isPending}
                        className="rounded-full w-9 h-9 border-zinc-200 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 border-emerald-100 transition-all active:scale-90"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReject(event)}
                        disabled={update.isPending}
                        className="rounded-full w-9 h-9 border-zinc-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 border-rose-100 transition-all active:scale-90"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      <EventDetailModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onApprove={handleApprove}
        onReject={handleReject}
        isUpdating={update.isPending}
      />
    </div>
  );
}
