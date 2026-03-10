"use client";

import { Ticket, Users, Star } from "lucide-react";

interface OrganizerStatsProps {
  eventCount: number;
}

export function OrganizerStats({ eventCount }: OrganizerStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{eventCount}</p>
            <p className="text-xs font-medium text-zinc-500">Sự kiện</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">—</p>
            <p className="text-xs font-medium text-zinc-500">Người theo dõi</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">—</p>
            <p className="text-xs font-medium text-zinc-500">Đánh giá</p>
          </div>
        </div>
      </div>
    </div>
  );
}
