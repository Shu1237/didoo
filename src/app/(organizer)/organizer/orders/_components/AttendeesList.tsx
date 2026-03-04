"use client";

import { Ticket } from "@/types/ticket";
import { TicketStatus } from "@/utils/enum";
import { cn } from "@/lib/utils";

interface AttendeesListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  emptyMessage?: string;
}

type BadgeTone = "green" | "amber" | "rose" | "zinc";

const statusMap: Record<number, { label: string; tone: BadgeTone }> = {
  [TicketStatus.AVAILABLE]: { label: "Sẵn sàng", tone: "green" },
  [TicketStatus.FULL]: { label: "Đã sử dụng", tone: "amber" },
  [TicketStatus.UNAVAILABLE]: { label: "Không khả dụng", tone: "rose" },
  [TicketStatus.LOCKED]: { label: "Đang khóa", tone: "zinc" },
};

const toneClasses: Record<BadgeTone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const getStatusInfo = (status: number) => statusMap[status] || { label: "Chưa rõ", tone: "zinc" as const };

const toToken = (id: string) => id.split("-")[0]?.toUpperCase() || id.slice(0, 8).toUpperCase();

export default function AttendeesList({ tickets, isLoading, emptyMessage }: AttendeesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4 lg:p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`loading-${index}`} className="h-14 animate-pulse rounded-xl bg-zinc-100" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center p-6 text-center">
        <p className="text-sm text-zinc-500">{emptyMessage || "Chưa có vé nào."}</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Mã vé</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Loại vé</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Khu vực</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Thời gian tạo</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Trạng thái</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Token</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {tickets.map((ticket) => {
              const statusInfo = getStatusInfo(ticket.status);

              return (
                <tr key={ticket.id} className="transition-colors hover:bg-zinc-50/70">
                  <td className="px-5 py-3 text-sm font-medium text-zinc-900">{ticket.id}</td>
                  <td className="px-5 py-3 text-sm text-zinc-700">{ticket.ticketType?.name || "Standard"}</td>
                  <td className="px-5 py-3 text-sm text-zinc-600">{ticket.zone || "--"}</td>
                  <td className="px-5 py-3 text-sm text-zinc-600">{dateTimeFormatter.format(new Date(ticket.createdAt))}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        toneClasses[statusInfo.tone]
                      )}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-primary">#{toToken(ticket.id)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 p-3 md:hidden">
        {tickets.map((ticket) => {
          const statusInfo = getStatusInfo(ticket.status);

          return (
            <div key={`mobile-${ticket.id}`} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-1 text-sm font-semibold text-zinc-900">{ticket.id}</p>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    toneClasses[statusInfo.tone]
                  )}
                >
                  {statusInfo.label}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-xs text-zinc-600">
                <p>Loại vé: {ticket.ticketType?.name || "Standard"}</p>
                <p>Khu vực: {ticket.zone || "--"}</p>
                <p>Thời gian: {dateTimeFormatter.format(new Date(ticket.createdAt))}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
