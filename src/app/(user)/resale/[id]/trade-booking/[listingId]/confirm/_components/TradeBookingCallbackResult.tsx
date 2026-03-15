"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, ChevronLeft, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useGetBooking } from "@/hooks/useBooking";

const reasonMap: Record<string, string> = {
  "listing-unavailable": "Tin đăng không còn khả dụng hoặc đã được bán.",
  payment_failed: "Thanh toán thất bại hoặc đã bị hủy.",
};

interface TradeBookingCallbackResultProps {
  eventId: string;
  listingId: string;
  bookingId: string;
}

/** Callback từ payment gateway: fetch bookingId → hiển thị success hoặc fail */
export function TradeBookingCallbackResult({
  eventId,
  listingId,
  bookingId,
}: TradeBookingCallbackResultProps) {
  const { data: bookingRes, isLoading, isError } = useGetBooking(bookingId);
  const booking = bookingRes?.data;

  const isSuccess = booking?.status?.toLowerCase() === "paid" || !!booking?.paidAt;

  if (isLoading) return <Loading />;

  if (isError || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy thông tin giao dịch</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Mã booking không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild className="rounded-xl">
              <Link href={`/resale/${eventId}/trade-booking/${listingId}/confirm`}>
                <RotateCw className="mr-1 h-4 w-4" />
                Thử lại
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/resale/${eventId}`}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại vé bán lại
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Mua vé bán lại thành công</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Giao dịch của bạn đã hoàn tất. Vé sẽ được cập nhật trong khu vực vé của tôi.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild className="rounded-xl">
              <Link href="/user/dashboard/tickets">Xem vé của tôi</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/resale/${eventId}`}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại vé bán lại
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const reasonKey = "payment_failed";
  const reasonMessage = reasonMap[reasonKey] || "Không thể hoàn tất giao dịch mua lại. Vui lòng thử lại.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <AlertCircle className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Giao dịch mua lại thất bại</h1>
        <p className="mt-2 text-sm text-zinc-600">{reasonMessage}</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button asChild className="rounded-xl">
            <Link href={`/resale/${eventId}/trade-booking/${listingId}/confirm`}>
              <RotateCw className="mr-1 h-4 w-4" />
              Thử lại
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/resale/${eventId}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Quay lại vé bán lại
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
