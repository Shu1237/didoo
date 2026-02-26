"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetBooking } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

function ConfirmContent({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";

  const { data: bookingRes, isLoading, isError } = useGetBooking(bookingId);
  const { data: eventRes } = useGetEvent(eventId);

  const booking = bookingRes?.data;
  const event = eventRes?.data;

  if (!bookingId) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-white/70 mb-6">Thiếu thông tin booking. Vui lòng kiểm tra lại link.</p>
          <Button asChild className="rounded-full bg-primary text-black">
            <Link href={`/events/${eventId}`}>Quay lại sự kiện</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) return <Loading />;

  if (isError || !booking) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-white/70 mb-6">Không tìm thấy thông tin đặt vé.</p>
          <Button asChild className="rounded-full bg-primary text-black">
            <Link href={`/events/${eventId}`}>Quay lại sự kiện</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại sự kiện</span>
        </Link>

        <div className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-primary shrink-0" />
            <div>
              <h1 className="text-2xl font-black uppercase">Xác nhận đặt vé</h1>
              <p className="text-white/60 text-sm mt-1">
                {event?.name || "Sự kiện"}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Mã đặt vé</span>
              <span className="font-bold">{booking.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Họ tên</span>
              <span className="font-bold">{booking.fullname}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Email</span>
              <span className="font-bold">{booking.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Tổng tiền</span>
              <span className="font-black text-primary">
                {Number(booking.totalPrice ?? booking.amount ?? 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Trạng thái</span>
              <span className="font-bold">{booking.status}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button asChild className="flex-1 rounded-full bg-primary text-black font-bold">
              <Link href="/user/tickets">Xem vé của tôi</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
              <Link href={`/events/${eventId}`}>Quay lại sự kiện</Link>
            </Button>
          </div>
        </div>
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
