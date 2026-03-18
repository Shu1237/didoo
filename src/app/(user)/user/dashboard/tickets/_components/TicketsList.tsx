"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Barcode from "react-barcode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useGetTickets } from "@/hooks/useTicket";
import { Ticket as TicketData, TicketType as TicketTypeData } from "@/types/ticket";
import { Event as EventData } from "@/types/event";
import { CalendarDays, Clock, QrCode, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSessionStore } from "@/stores/sesionStore";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";

type TicketCardView = {
  id: string;
  eventId: string;
  status: number;
  totalPrice: number;
  createdAt: string;
  event?: Partial<EventData>;
  ticketType?: Partial<TicketTypeData>;
};

type TicketsListProps = {
  statusFilter?: string;
  sortBy?: string;
};

function getStatusStyle(status: number) {
  switch (status) {
    case 1:
      return { label: "Sẵn sàng", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" };
    case 2:
      return { label: "Đã dùng", className: "bg-zinc-500/10 text-zinc-600 border-zinc-200" };
    case 3:
      return { label: "Không khả dụng", className: "bg-rose-500/10 text-rose-600 border-rose-200" };
    case 4:
      return { label: "Đang khóa", className: "bg-amber-500/10 text-amber-600 border-amber-200" };
    default:
      return { label: "Không xác định", className: "bg-zinc-500/10 text-zinc-600 border-zinc-200" };
  }
}

export default function TicketsList({ statusFilter = "all", sortBy = "newest" }: TicketsListProps) {
  const { user } = useSessionStore()
  const {
    data: ticketsRes,
    isLoading: isTicketsLoading,
    isError,
  } = useGetTickets(
    {
      ownerId: user?.UserId,
      pageNumber: 1,
      pageSize: 200,
      isDescending: true,
      hasEvent: true,
      hasType: true,
    },
    { enabled: !!user?.UserId }
  );

  const tickets = ticketsRes?.data.items || [];
  const ticketCards: TicketCardView[] = tickets.map((ticket: TicketData) => ({
    id: ticket.id,
    eventId: ticket.event?.id || "",
    status: ticket.status,
    totalPrice: Number(ticket.ticketType?.price || 0),
    createdAt: ticket.createdAt || "",
    event: ticket.event,
    ticketType: ticket.ticketType,
  }));

  const filteredCards = ticketCards.filter((item) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "ready") return item.status === 1;
    if (statusFilter === "locked") return item.status === 4;
    if (statusFilter === "unavailable") return item.status === 3;
    if (statusFilter === "used") return item.status === 2;
    return true;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    if (sortBy === "priceAsc") return a.totalPrice - b.totalPrice;
    if (sortBy === "priceDesc") return b.totalPrice - a.totalPrice;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  if (isTicketsLoading) return <Loading />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
        <h3 className="text-lg font-semibold text-zinc-900">Có lỗi xảy ra</h3>
        <p className="mt-2 mx-auto max-w-sm text-zinc-600">Không thể tải danh sách vé. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (!user || ticketCards.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <TicketIcon className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">Chưa có vé nào</h3>
        <p className="mt-2 mx-auto max-w-sm text-zinc-600">Đặt vé sự kiện để quản lý và xem vé tại đây.</p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/events">Khám phá sự kiện</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {sortedCards.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: TicketCardView }) {
  const event = ticket.event;
  const status = getStatusStyle(ticket.status);
  const [showBarcode, setShowBarcode] = useState(false);

  const eventDate = event?.startTime ? new Date(event.startTime) : new Date();

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event?.thumbnailUrl || event?.bannerUrl || FALLBACK_IMAGE}
          alt={event?.name || "Sự kiện"}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-transparent to-transparent" />
        <Badge variant="outline" className={`absolute right-4 top-4 border-0 ${status.className}`}>
          {status.label}
        </Badge>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 font-bold text-white drop-shadow-sm">{event?.name || "Sự kiện"}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {format(eventDate, "EEEE, d MMM yyyy", { locale: vi })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 border-y border-dashed border-zinc-200 bg-zinc-50/50 py-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {ticket.ticketType?.name || "Vé điện tử"}
        </span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Mã vé</span>
            <span className="font-mono font-semibold text-zinc-900">#{ticket.id?.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Clock className="h-4 w-4 shrink-0 text-zinc-400" />
            <span>
              {event?.openTime || "Sẽ cập nhật"} - {event?.closedTime || "Sẽ cập nhật"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
            <span className="text-sm text-zinc-500">Giá vé</span>
            <span className="font-bold text-zinc-900">{ticket.totalPrice === 0 ? "Miễn phí" : `${Number(ticket.totalPrice).toLocaleString("vi-VN")}đ`}</span>
          </div>
        </div>

        {showBarcode && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="mb-2 flex justify-center grayscale">
              <Barcode
                value={ticket.id || "000000"}
                width={1.4}
                height={40}
                displayValue={false}
                background="transparent"
                lineColor="#18181b"
                margin={0}
              />
            </div>
            <p className="break-all text-center font-mono text-[10px] text-zinc-500">{ticket.id}</p>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
              <Link href={`/events/${ticket.eventId}`}>Chi tiết sự kiện</Link>
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowBarcode(!showBarcode)}
            className="w-full justify-center gap-2 rounded-xl text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <QrCode className="h-4 w-4" />
            {showBarcode ? "Ẩn mã vạch" : "Hiện mã vạch"}
          </Button>
        </div>
      </div>
    </article>
  );
}
