"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMe } from "@/hooks/useAuth";
import { useGetBookings, useGetResaleTransactions } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/types/booking";
import { useGetEvent } from "@/hooks/useEvent";
import { BookingTypeStatus } from "@/utils/enum";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";

function getStatusStyle(status: string) {
  const normalized = status?.toLowerCase() || "";
  if (normalized.includes("paid") || normalized.includes("success")) {
    return { label: "Đã thanh toán", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" };
  }
  if (normalized.includes("pending")) {
    return { label: "Chờ thanh toán", className: "bg-amber-500/10 text-amber-600 border-amber-200" };
  }
  return { label: "Đã hủy", className: "bg-rose-500/10 text-rose-600 border-rose-200" };
}

function getBookingTypeStyle(bookingType?: number | string) {
  const bt = Number(bookingType);
  if (bt === BookingTypeStatus.TRADE_PURCHASE || bt === 2) {
    return { label: "Mua lại", className: "bg-violet-500/10 text-violet-700 border-violet-200" };
  }
  return { label: "Mua trực tiếp", className: "bg-blue-500/10 text-blue-700 border-blue-200" };
}

function HistoryRow({ booking }: { booking: Booking }) {
  const { data: eventRes } = useGetEvent(booking.eventId);
  const event = eventRes?.data;
  const status = getStatusStyle(booking.status || "");
  const bookingType = getBookingTypeStyle(booking.bookingType);
  const dateStr = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "--";

  return (
    <Link
      href={`/events/${booking.eventId}/booking/confirm?bookingId=${booking.id}`}
      className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-20 sm:w-32">
        <Image
          src={event?.thumbnailUrl || event?.bannerUrl || FALLBACK_IMAGE}
          alt={event?.name || "Sự kiện"}
          fill
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-zinc-900 truncate">{event?.name || "Sự kiện"}</h3>
          <Badge variant="outline" className={bookingType.className}>
            {bookingType.label}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-zinc-500">#{booking.id?.substring(0, 8).toUpperCase()}</p>
        <p className="mt-1 text-sm text-zinc-500">{dateStr}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <Badge variant="outline" className={status.className}>
          {status.label}
        </Badge>
        <p className="font-semibold text-zinc-900">
          {Number(booking.totalPrice || 0).toLocaleString("vi-VN")}đ
        </p>
      </div>
    </Link>
  );
}

export default function DashboardHistoryContent() {
  const { data: meRes } = useGetMe();
  const user = meRes?.data;

  const { data: bookingsRes } = useGetBookings(
    { userId: user?.id, pageNumber: 1, pageSize: 50, isDescending: true },
    { enabled: !!user?.id }
  );
  const { data: resaleTransactionsRes } = useGetResaleTransactions(
    { buyerUserId: user?.id, pageNumber: 1, pageSize: 20, isDescending: true },
    { enabled: !!user?.id }
  );
  const bookings = bookingsRes?.data.items || [];
  const resaleTransactions = resaleTransactionsRes?.data.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Lịch sử mua hàng</h1>
        <p className="mt-1 text-zinc-600">Xem tất cả đơn hàng đã đặt</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">Chưa có đơn hàng</h3>
          <p className="mt-2 max-w-sm mx-auto text-zinc-600">
            Đặt vé sự kiện để xem lịch sử mua hàng tại đây.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/events">Khám phá sự kiện</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <HistoryRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}

      {resaleTransactions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-900">Giao dịch mua lại</h2>
          {resaleTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-zinc-900">#{transaction.id.substring(0, 8).toUpperCase()}</p>
                <p className="text-sm text-zinc-500">{transaction.status}</p>
              </div>
              <p className="font-semibold text-zinc-900">
                {Number(transaction.cost || 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
