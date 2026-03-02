"use client";

import { AlertTriangle, CalendarDays, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AdminOperationalNotesProps {
  paidRatio: number;
  totalBookings: number;
  pendingOrganizers: number;
  activeEvents: number;
  totalEvents: number;
  formatNumber: (value: number) => string;
}

export default function AdminOperationalNotes({
  paidRatio,
  totalBookings,
  pendingOrganizers,
  activeEvents,
  totalEvents,
  formatNumber,
}: AdminOperationalNotesProps) {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-900">Operational Notes</h3>
        <p className="text-xs text-zinc-500">Goi y hanh dong uu tien dua tren so lieu hien tai.</p>
      </div>

      <div className="space-y-2.5">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800">
            <TrendingUp className="h-4 w-4 text-cyan-600" />
            Success rate booking
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Hien tai dat <strong>{paidRatio.toFixed(1)}%</strong> tren tong {formatNumber(totalBookings)} booking.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Organizer pending review
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Dang co <strong>{formatNumber(pendingOrganizers)}</strong> ho so cho duyet. Nen uu tien review nhanh.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800">
            <CalendarDays className="h-4 w-4 text-emerald-600" />
            Event availability
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Co <strong>{formatNumber(activeEvents)}</strong> event dang hoat dong, chiem{" "}
            <strong>{totalEvents > 0 ? ((activeEvents / totalEvents) * 100).toFixed(1) : "0.0"}%</strong> tong event.
          </p>
        </div>
      </div>
    </Card>
  );
}
