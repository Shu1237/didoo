"use client";

import { useState, useMemo } from "react";
import { Ticket } from "lucide-react";
import { OrganizerEventCard } from "./OrganizerEventCard";
import type { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";

interface OrganizerEventsSectionProps {
  events: Event[];
  isLoading?: boolean;
}

type EventTab = "upcoming" | "opened" | "past";

export function OrganizerEventsSection({
  events,
  isLoading = false,
}: OrganizerEventsSectionProps) {
  const [eventTab, setEventTab] = useState<EventTab>("upcoming");

  const displayEvents = useMemo(() => {
    const now = new Date().getTime();
    if (eventTab === "upcoming") return events.filter((e) => new Date(e.startTime).getTime() >= now);
    if (eventTab === "opened") return events.filter((e) => (e.status as number) === EventStatus.OPENED);
    return events.filter((e) => new Date(e.startTime).getTime() < now);
  }, [events, eventTab]);

  const getEmptyMessage = () => {
    if (eventTab === "upcoming") return "Chưa có sự kiện sắp diễn ra";
    if (eventTab === "opened") return "Chưa có sự kiện đang mở bán vé";
    return "Chưa có sự kiện đã qua";
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-zinc-900">Sự kiện</h2>
        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setEventTab("upcoming")}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition min-h-[40px] min-w-[20px] ${
              eventTab === "upcoming"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Sắp diễn ra
          </button>
          <button
            type="button"
            onClick={() => setEventTab("opened")}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition min-h-[40px] min-w-[20px] ${
              eventTab === "opened"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Đang mở
          </button>
          <button
            type="button"
            onClick={() => setEventTab("past")}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition min-h-[40px] min-w-[20px] ${
              eventTab === "past"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Đã qua
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-zinc-100"
            />
          ))}
        </div>
      ) : displayEvents.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {displayEvents.map((event) => (
            <OrganizerEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <Ticket className="mx-auto h-12 w-12 text-zinc-400" />
          <p className="mt-4 font-medium text-zinc-600">{getEmptyMessage()}</p>
        </div>
      )}
    </section>
  );
}
