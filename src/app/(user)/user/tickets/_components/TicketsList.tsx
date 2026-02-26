"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useGetBookings } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetMe } from "@/hooks/useUser";
import { Booking } from "@/types/booking";
import { CalendarDays, Clock3, MapPin, QrCode, ReceiptText } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("paid") || normalized.includes("success")) {
    return {
      label: "Da thanh toan",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (normalized.includes("pending")) {
    return {
      label: "Cho thanh toan",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  if (normalized.includes("cancel")) {
    return {
      label: "Da huy",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  return {
    label: status,
    className: "border-slate-200 bg-slate-50 text-slate-700",
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
    {
      userId: user?.id,
      pageNumber: 1,
      pageSize: 20,
      isDescending: true,
    },
    { enabled: !!user?.id },
  );

  const bookings = bookingsRes?.data.items || [];

  if (isUserLoading) return <Loading />;

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Ban chua dang nhap</h2>
        <p className="mt-2 text-slate-600">
          Dang nhap de xem booking va thong tin ve da dat.
        </p>
        <Button asChild className="mt-5 rounded-full px-6">
          <Link href="/login?redirect=/user/tickets">Dang nhap ngay</Link>
        </Button>
      </div>
    );
  }

  if (isBookingsLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Loading text="Dang tai danh sach booking..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Khong tai duoc booking</h2>
        <p className="mt-2 text-slate-600">Vui long thu lai sau it phut.</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700">
          <QrCode className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Chua co booking nao</h2>
        <p className="mx-auto mt-2 max-w-lg text-slate-600">
          Ban chua dat ve cho su kien nao. Hay kham pha va dat ve de bat dau trai nghiem.
        </p>
        <Button asChild className="mt-6 rounded-full px-6">
          <Link href="/events">Kham pha su kien</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { data: eventRes } = useGetEvent(booking.eventId);
  const event = eventRes?.data;

  const status = getStatusStyle(booking.status || "Dang xu ly");
  const eventDate = event?.startTime
    ? new Date(event.startTime)
    : booking.createdAt
      ? new Date(booking.createdAt)
      : null;

  const dateText = eventDate
    ? eventDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Dang cap nhat";

  const timeText = eventDate
    ? eventDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const locationText = event?.locations?.[0]?.name || "Dia diem dang cap nhat";
  const eventTitle = event?.name || "Su kien";

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-[0_24px_40px_-32px_rgba(15,23,42,0.5)]">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event?.thumbnailUrl || event?.bannerUrl || FALLBACK_IMAGE}
          alt={eventTitle}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <Badge className={`absolute left-4 top-4 border ${status.className}`}>{status.label}</Badge>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="line-clamp-2 text-xl font-bold text-slate-900">{eventTitle}</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoItem icon={CalendarDays} label="Ngay" value={dateText} />
          <InfoItem icon={Clock3} label="Gio" value={timeText} />
          <InfoItem icon={MapPin} label="Dia diem" value={locationText} className="col-span-2" />
          <InfoItem
            icon={ReceiptText}
            label="Tong tien"
            value={`${Number(booking.totalPrice ?? booking.amount ?? 0).toLocaleString("vi-VN")} VND`}
            className="col-span-2"
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ma booking
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-slate-800">{booking.id}</p>
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              <Link href={`/events/${booking.eventId}`}>Chi tiet</Link>
            </Button>
            <Button asChild size="sm" className="h-9 rounded-full px-4">
              <Link href={`/events/${booking.eventId}/booking/confirm?bookingId=${booking.id}`}>
                Xem ve
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-3.5 w-3.5 text-sky-600" />
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
