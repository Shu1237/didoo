"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, CalendarDays } from "lucide-react";
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

  if (!bookingId)
    return <ErrorBox message="Thiếu mã booking trong đường dẫn." eventId={eventId} />;

  if (isLoading) return <Loading />;

  if (isError || !booking)
    return <ErrorBox message="Không tìm thấy thông tin đặt vé." eventId={eventId} />;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="relative md:w-1/2 h-72 md:h-auto bg-slate-900">
          <img
            src={
              event?.bannerUrl ||
              event?.thumbnailUrl ||
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
            }
            alt="Event"
            className="w-full h-full object-cover opacity-60"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-emerald-500 shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="mt-4 text-2xl font-black">
              Booking Successful
            </h1>

            <p className="mt-2 text-sm opacity-80 line-clamp-2">
              {event?.name || "Your Event Booking"}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <Link
              href={`/events/${eventId}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6"
            >
              <ChevronLeft size={16} />
              Back to Event
            </Link>

            <div className="grid grid-cols-2 gap-6">
              <Info label="Booking ID" value={booking.id?.slice(0, 12)} />
              <Info
                label="Total Payment"
                value={`${Number(
                  booking.totalPrice ?? booking.amount ?? 0
                ).toLocaleString("vi-VN")}đ`}
                highlight
              />
              <Info label="Name" value={booking.fullname} />
              <Info
                label="Created At"
                value={
                  booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString("vi-VN")
                    : "--"
                }
              />
              <div className="col-span-2">
                <Info label="Email" value={booking.email} />
              </div>
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                <CalendarDays size={16} />
                Important Note
              </div>
              <p className="mt-2 text-sm text-amber-800">
                Please arrive 30 minutes before opening time and prepare your QR code.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button asChild className="flex-1 rounded-xl">
              <Link href="/user/tickets">View Tickets</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-xl"
            >
              <Link href={`/events/${eventId}`}>Go Back</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </span>
      <span
        className={`text-lg font-bold ${highlight ? "text-emerald-500" : "text-slate-900"
          }`}
      >
        {value || "--"}
      </span>
    </div>
  );
}

function ErrorBox({
  message,
  eventId,
}: {
  message: string;
  eventId: string;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <p className="text-slate-600">{message}</p>
        <Button asChild className="mt-4">
          <Link href={`/events/${eventId}`}>Quay lại sự kiện</Link>
        </Button>
      </div>
    </main>
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