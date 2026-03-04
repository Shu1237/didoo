"use client";

import { Card } from "@/components/ui/card";

export interface EventStatusRow {
  label: string;
  count: number;
  ratio: number;
  barClassName: string;
}

interface AdminEventHealthProps {
  eventStatusRows: EventStatusRow[];
  pendingOrganizers: number;
  verifiedOrganizers: number;
  bannedOrganizers: number;
  formatNumber: (value: number) => string;
}

export default function AdminEventHealth({
  eventStatusRows,
  pendingOrganizers,
  verifiedOrganizers,
  bannedOrganizers,
  formatNumber,
}: AdminEventHealthProps) {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900">Event Health</h3>
        <p className="text-xs text-zinc-500">Tinh trang event va organizer de xu ly nhanh.</p>
      </div>

      <div className="space-y-2.5">
        {eventStatusRows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-zinc-600">{row.label}</span>
              <span className="font-medium text-zinc-900">
                {formatNumber(row.count)} ({row.ratio.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-zinc-100">
              <div className={`h-2 rounded-full ${row.barClassName}`} style={{ width: `${row.ratio}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Organizer status</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-center">
            <p className="text-[11px] text-zinc-500">Pending</p>
            <p className="text-sm font-semibold text-zinc-900">{formatNumber(pendingOrganizers)}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-center">
            <p className="text-[11px] text-zinc-500">Verified</p>
            <p className="text-sm font-semibold text-zinc-900">{formatNumber(verifiedOrganizers)}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-center">
            <p className="text-[11px] text-zinc-500">Banned</p>
            <p className="text-sm font-semibold text-zinc-900">{formatNumber(bannedOrganizers)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
