"use client";

import { Suspense, use } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CheckCircle2, ChevronLeft, Mail, User2 } from "lucide-react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetBooking } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";

function ConfirmContent({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";

  const { data: bookingRes, isLoading, isError } = useGetBooking(bookingId);
  const { data: eventRes } = useGetEvent(eventId);

  const booking = bookingRes?.data;
  const event = eventRes?.data;

  if (!bookingId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Thieu ma booking trong duong dan.</p>
          <Button asChild className="mt-5 rounded-full px-6">
            <Link href={`/events/${eventId}`}>Quay lai su kien</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) return <Loading />;

  if (isError || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Khong tim thay thong tin dat ve.</p>
          <Button asChild className="mt-5 rounded-full px-6">
            <Link href={`/events/${eventId}`}>Quay lai su kien</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-28">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/events/${eventId}`}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lai su kien
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                Xac nhan dat ve thanh cong
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {event?.name || "Su kien"} - vui long kiem tra thong tin ben duoi.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoRow label="Ma booking" value={booking.id} />
            <InfoRow
              label="Tong thanh toan"
              value={`${Number(booking.totalPrice ?? booking.amount ?? 0).toLocaleString("vi-VN")} VND`}
              highlight
            />
            <InfoRow
              label="Trang thai"
              value={booking.status || "Dang xu ly"}
            />
            <InfoRow
              label="Ngay tao"
              value={
                booking.createdAt
                  ? new Date(booking.createdAt).toLocaleString("vi-VN")
                  : "Dang cap nhat"
              }
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoCard icon={User2} label="Khach hang" value={booking.fullname || "Dang cap nhat"} />
            <InfoCard icon={Mail} label="Email" value={booking.email || "Dang cap nhat"} />
          </div>

          <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
            <p className="flex items-center gap-2 font-semibold">
              <CalendarDays className="h-4 w-4" />
              Luu y
            </p>
            <p className="mt-1">
              Vui long den som truoc gio mo cua de check-in nhanh va mang theo ma QR trong ve cua ban.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-full px-6">
              <Link href="/user/tickets">Xem ve cua toi</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-700 hover:bg-slate-50"
            >
              <Link href={`/events/${eventId}`}>Quay lai su kien</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${highlight ? "text-sky-700" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-4 w-4 text-sky-600" />
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function BookingConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<Loading />}>
      <ConfirmContent eventId={id} />
    </Suspense>
  );
}
