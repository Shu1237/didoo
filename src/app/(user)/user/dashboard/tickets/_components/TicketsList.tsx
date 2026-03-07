"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Barcode from "react-barcode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useGetBookings } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetMe } from "@/hooks/useUser";
import { Booking } from "@/types/booking";
import {
  CalendarDays,
  Clock,
  MapPin,
  QrCode,
  ChevronRight,
  Ticket,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";

function getStatusStyle(status: string) {
  const normalized = status?.toLowerCase() || "";
  if (normalized.includes("paid") || normalized.includes("success")) {
    return {
      label: "Đã thanh toán",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    };
  }
  if (normalized.includes("pending")) {
    return {
      label: "Chờ thanh toán",
      className: "bg-amber-500/10 text-amber-600 border-amber-200",
    };
  }
  return {
    label: "Đã hủy",
    className: "bg-rose-500/10 text-rose-600 border-rose-200",
  };
}

export default function TicketsList() {
  const { data: userRes, isLoading: isUserLoading } = useGetMe();
  const user = userRes?.data;

  const {
    data: bookingsRes,
    isLoading: isBookingsLoading,
    isError,
  } = useGetBookings(
    { userId: user?.id, pageNumber: 1, pageSize: 20, isDescending: true },
    { enabled: !!user?.id }
  );

  const bookings = bookingsRes?.data.items || [];

  if (isUserLoading || isBookingsLoading) return <Loading />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">Có lỗi xảy ra</h3>
        <p className="mt-2 mx-auto max-w-sm text-zinc-600">
          Không thể tải danh sách vé. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  if (!user || bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <Ticket className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">Chưa có vé nào</h3>
        <p className="mt-2 mx-auto max-w-sm text-zinc-600">
          Đặt vé sự kiện để quản lý và xem vé tại đây.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/events">Khám phá sự kiện</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {bookings.map((booking) => (
        <TicketCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function TicketCard({ booking }: { booking: Booking }) {
  const { data: eventRes } = useGetEvent(booking.eventId);
  const event = eventRes?.data;
  const status = getStatusStyle(booking.status || "");
  const [showBarcode, setShowBarcode] = useState(false);

  const eventDate = event?.startTime
    ? new Date(event.startTime)
    : new Date();
  const location =
    event?.locations?.[0]?.name ||
    event?.locations?.[0]?.address ||
    "Online / TBA";

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {/* Header: Ảnh + Badge */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event?.thumbnailUrl || event?.bannerUrl || FALLBACK_IMAGE}
          alt={event?.name || "Sự kiện"}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-transparent to-transparent" />
        <Badge
          variant="outline"
          className={`absolute right-4 top-4 border-0 ${status.className}`}
        >
          {status.label}
        </Badge>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-bold text-white drop-shadow-sm line-clamp-2">
            {event?.name || "Sự kiện"}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {format(eventDate, "EEEE, d MMM yyyy", { locale: vi })}
          </p>
        </div>
      </div>

      {/* Divider kiểu vé */}
      <div className="flex items-center justify-center gap-4 border-y border-dashed border-zinc-200 bg-zinc-50/50 py-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Vé điện tử
        </span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Thông tin chi tiết */}
      <div className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Mã đặt vé</span>
            <span className="font-mono font-semibold text-zinc-900">
              #{booking.id?.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Clock className="h-4 w-4 shrink-0 text-zinc-400" />
            <span>
              {event?.openTime || "TBA"} – {event?.closedTime || "TBA"}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-zinc-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <span className="line-clamp-2">{location}</span>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
            <span className="text-sm text-zinc-500">Tổng tiền</span>
            <span className="font-bold text-zinc-900">
              {Number(booking.totalPrice || 0).toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        {/* Barcode (toggle) */}
        {showBarcode && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="mb-2 flex justify-center grayscale">
              <Barcode
                value={booking.id || "000000"}
                width={1.4}
                height={40}
                displayValue={false}
                background="transparent"
                lineColor="#18181b"
                margin={0}
              />
            </div>
            <p className="text-center font-mono text-[10px] text-zinc-500 break-all">
              {booking.id}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 space-y-3">
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
              <Link href={`/events/${booking.eventId}`}>Chi tiết sự kiện</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 rounded-xl">
              <Link
                href={`/events/${booking.eventId}/booking/confirm?bookingId=${booking.id}`}
              >
                Xem vé
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setShowBarcode(!showBarcode)}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <QrCode className="h-4 w-4" />
            {showBarcode ? "Ẩn mã vạch" : "Hiện mã vạch"}
          </button>
        </div>
      </div>
    </article>
  );
}
