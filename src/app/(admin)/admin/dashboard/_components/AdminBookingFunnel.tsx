"use client";

import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BookingSummary {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
}

interface AdminBookingFunnelProps {
  bookingSummary: BookingSummary;
  failedBookings: number;
  paidRatio: number;
  pendingRatio: number;
  failedRatio: number;
  formatNumber: (value: number) => string;
}

export default function AdminBookingFunnel({
  bookingSummary,
  failedBookings,
  paidRatio,
  pendingRatio,
  failedRatio,
  formatNumber,
}: AdminBookingFunnelProps) {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Booking Funnel</h3>
          <p className="text-xs text-zinc-500">Phan bo trang thai booking toan he thong</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
          {bookingSummary.total > 0 ? `${paidRatio.toFixed(1)}% success` : "No data"}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Paid
            </span>
            <span className="font-medium text-zinc-700">{formatNumber(bookingSummary.paid)}</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${paidRatio}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-amber-700">
              <Clock3 className="h-3.5 w-3.5" />
              Pending
            </span>
            <span className="font-medium text-zinc-700">{formatNumber(bookingSummary.pending)}</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100">
            <div className="h-2 rounded-full bg-amber-500" style={{ width: `${pendingRatio}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Failed / Cancelled
            </span>
            <span className="font-medium text-zinc-700">{formatNumber(failedBookings)}</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100">
            <div className="h-2 rounded-full bg-rose-500" style={{ width: `${failedRatio}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
          <p className="text-[11px] text-zinc-500">Booking tong</p>
          <p className="text-base font-semibold text-zinc-900">{formatNumber(bookingSummary.total)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
          <p className="text-[11px] text-zinc-500">Cancels</p>
          <p className="text-base font-semibold text-zinc-900">{formatNumber(bookingSummary.cancelled)}</p>
        </div>
      </div>
    </Card>
  );
}
