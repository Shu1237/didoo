"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface AdminRecentEventItem {
  id: string;
  name: string;
  organizerName: string;
  categoryName: string;
  statusLabel: string;
  statusClassName: string;
}

interface AdminRecentEventsProps {
  recentEvents: AdminRecentEventItem[];
}

export default function AdminRecentEvents({ recentEvents }: AdminRecentEventsProps) {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Latest Events</h3>
          <p className="text-xs text-zinc-500">Nhanh de theo doi chat luong event dang len he thong.</p>
        </div>
        <Button asChild variant="outline" className="h-8 rounded-lg border-zinc-200 px-3 text-xs">
          <Link href="/admin/events">View all</Link>
        </Button>
      </div>

      {recentEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
          Chua co su kien.
        </div>
      ) : (
        <div className="space-y-2">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">{event.name}</p>
                <p className="truncate text-xs text-zinc-500">
                  {event.organizerName} - {event.categoryName}
                </p>
              </div>

              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${event.statusClassName}`}>
                {event.statusLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
