"use client";

import { useState } from "react";
import { useGetMe } from "@/hooks/useUser";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetTickets } from "@/hooks/useTicket";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { Ticket } from "@/types/ticket";
import { TicketStatus } from "@/utils/enum";
import AttendeesList from "./_components/AttendeesList";
import { Download, Search, Users, Ticket as TicketIcon, CalendarDays } from "lucide-react";

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getStatusLabel = (status: number) => {
  switch (status) {
    case TicketStatus.FULL:
      return "Đã sử dụng";
    case TicketStatus.AVAILABLE:
      return "Sẵn sàng";
    case TicketStatus.UNAVAILABLE:
      return "Không khả dụng";
    case TicketStatus.LOCKED:
      return "Đang khóa";
    default:
      return "Chưa rõ";
  }
};

const exportTicketsCsv = (eventName: string, tickets: Ticket[]) => {
  if (!tickets.length) return;

  const headers = ["ticket_id", "ticket_type", "zone", "status", "created_at"];
  const rows = tickets.map((ticket) => [
    ticket.id,
    ticket.ticketType?.name || "",
    ticket.zone || "",
    getStatusLabel(ticket.status),
    ticket.createdAt || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `tickets-${eventName.replace(/\s+/g, "-").toLowerCase()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function OrganizerOrdersPage() {
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const organizerId = userData?.data?.organizerId;

  const { data: eventsRes, isLoading: isEventsLoading } = useGetEvents(
    {
      organizerId: organizerId || undefined,
      pageSize: 100,
      hasCategory: true,
    },
    Boolean(organizerId)
  );

  const [manualSelectedEventId, setManualSelectedEventId] = useState<string | null>(null);
  const [eventSearch, setEventSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");

  const events = (eventsRes?.data?.items || []) as Event[];
  const selectedEventId =
    manualSelectedEventId && events.some((event) => event.id === manualSelectedEventId)
      ? manualSelectedEventId
      : (events[0]?.id ?? null);

  const { data: ticketsRes, isLoading: isTicketsLoading } = useGetTickets(
    {
      eventId: selectedEventId || undefined,
      pageSize: 300,
      hasType: true,
    },
    { enabled: Boolean(selectedEventId) }
  );

  if (isUserLoading || isEventsLoading) return <Loading />;

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null;
  const tickets = (ticketsRes?.data?.items || []) as Ticket[];

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(eventSearch.trim().toLowerCase())
  );

  const filteredTickets = tickets.filter((ticket) => {
    const q = ticketSearch.trim().toLowerCase();
    if (!q) return true;

    return [ticket.id, ticket.ticketType?.name || "", ticket.zone || "", getStatusLabel(ticket.status)]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const sold = toNumber(selectedEvent?.sold);
  const total = toNumber(selectedEvent?.total);
  const fillRate = total > 0 ? (sold / total) * 100 : 0;

  const usedTickets = tickets.filter((ticket) => ticket.status === TicketStatus.FULL).length;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <section className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm lg:px-6 lg:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Quản lý đơn vé</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Theo dõi danh sách vé theo từng sự kiện, tìm nhanh và xuất dữ liệu khi cần.
            </p>
          </div>

          <Button
            variant="outline"
            className="h-10 rounded-xl border-zinc-200 px-4"
            disabled={!selectedEvent || filteredTickets.length === 0}
            onClick={() => selectedEvent && exportTicketsCsv(selectedEvent.name, filteredTickets)}
          >
            <Download className="mr-2 h-4 w-4" />
            Xuất CSV
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-[11px] text-zinc-500">Tổng sự kiện</p>
            <p className="text-lg font-semibold text-zinc-900">{events.length}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-[11px] text-zinc-500">Vé đã tạo</p>
            <p className="text-lg font-semibold text-zinc-900">{tickets.length}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-[11px] text-zinc-500">Đã sử dụng</p>
            <p className="text-lg font-semibold text-zinc-900">{usedTickets}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-[11px] text-zinc-500">Lấp đầy sự kiện</p>
            <p className="text-lg font-semibold text-zinc-900">{fillRate.toFixed(1)}%</p>
          </div>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="min-h-0 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={eventSearch}
                onChange={(event) => setEventSearch(event.target.value)}
                placeholder="Tìm sự kiện"
                className="h-10 rounded-xl border-zinc-200 pl-9"
              />
            </div>
          </div>

          <div className="h-full overflow-auto p-3">
            {filteredEvents.length === 0 ? (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
                Không tìm thấy sự kiện phù hợp.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map((event) => {
                  const eventSold = toNumber(event.sold);
                  const eventTotal = toNumber(event.total);
                  const eventFill = eventTotal > 0 ? (eventSold / eventTotal) * 100 : 0;
                  const isActive = selectedEventId === event.id;

                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        setManualSelectedEventId(event.id);
                        setTicketSearch("");
                      }}
                      className={cn(
                        "w-full rounded-2xl border p-3 text-left transition",
                        isActive
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      <p className={cn("line-clamp-2 text-sm font-semibold", isActive ? "text-white" : "text-zinc-900")}>{event.name}</p>

                      <div className={cn("mt-2 flex items-center justify-between text-[11px]", isActive ? "text-zinc-300" : "text-zinc-500")}>
                        <span>{event.category?.name || "Chưa phân loại"}</span>
                        <span>{eventSold} / {eventTotal || 0}</span>
                      </div>

                      <div className={cn("mt-2 h-1.5 overflow-hidden rounded-full", isActive ? "bg-zinc-700" : "bg-zinc-100")}>
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.min(100, eventFill)}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <Card className="min-h-0 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          {selectedEvent ? (
            <>
              <div className="border-b border-zinc-100 p-4 lg:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-zinc-900">{selectedEvent.name}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(selectedEvent.startTime).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {sold} / {total || 0} vé
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <TicketIcon className="h-3.5 w-3.5" />
                        {tickets.length} vé đã tạo
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      value={ticketSearch}
                      onChange={(event) => setTicketSearch(event.target.value)}
                      placeholder="Tìm theo mã vé, loại vé..."
                      className="h-10 rounded-xl border-zinc-200 pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                <AttendeesList
                  tickets={filteredTickets}
                  isLoading={isTicketsLoading}
                  emptyMessage={ticketSearch ? "Không có kết quả theo từ khóa tìm kiếm." : "Sự kiện này chưa có vé."}
                />
              </div>

              <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-600 lg:px-5">
                Hiển thị {filteredTickets.length} / {tickets.length} vé
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-500">
              Chưa có sự kiện để hiển thị danh sách vé.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
