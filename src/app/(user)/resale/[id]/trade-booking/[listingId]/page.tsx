"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketListing, useValidateTicketListing } from "@/hooks/useTicket";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800";

export default function TradeBookingListingDetailPage({
  params,
}: {
  params: Promise<{ id: string; listingId: string }>;
}) {
  const { id, listingId } = use(params);

  const { data: eventRes, isLoading: isEventLoading } = useGetEvent(id);
  const { data: listingRes, isLoading: isListingLoading } = useGetTicketListing(listingId, {
    enabled: !!listingId,
  });
  const { data: validateRes, isLoading: isValidateLoading } = useValidateTicketListing(listingId, {
    enabled: !!listingId,
  });

  const event = eventRes?.data;
  const listing = listingRes?.data;
  const validateData = validateRes?.data;
  const isAvailable = validateData?.isAvailable ?? false;

  if (isEventLoading || isListingLoading || isValidateLoading) return <Loading />;

  if (!event || !listing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy thông tin vé.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href={`/resale/${id}`}>Quay lại danh sách vé</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/resale/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← Quay lại danh sách vé
        </Link>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-zinc-100">
                <Image
                  src={
                    event.bannerUrl ||
                    event.thumbnailUrl ||
                    FALLBACK_IMAGE
                  }
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-zinc-900">{event.name}</h1>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-600">
                  {event.startTime && (
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {format(new Date(event.startTime), "dd MMM yyyy", { locale: vi })}
                    </span>
                  )}
                  {(event.locations?.[0]?.name || event.locations?.[0]?.address) && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.locations[0].name || event.locations[0].address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                <Ticket className="h-5 w-5 text-primary" />
                Thông tin vé
              </h2>
              <p className="mt-4 text-sm text-zinc-600">
                {listing.description || "Vé resale cho sự kiện. Liên hệ người bán nếu cần thêm thông tin."}
              </p>
              {!isAvailable && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Vé này không còn khả dụng để mua. Vui lòng chọn vé khác.
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900">Chi tiết giá</h2>
              <p className="mt-4 text-3xl font-black text-primary">
                {Number(listing.askingPrice || 0).toLocaleString("vi-VN")}đ
              </p>
              <p className="mt-1 text-sm text-zinc-500">Giá bán lại từ người bán</p>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Giao dịch an toàn
                </p>
                <p className="mt-1 text-zinc-600">
                  Thanh toán qua cổng an toàn. Vé được chuyển quyền sở hữu sau khi thanh toán thành công.
                </p>
              </div>

              <Button
                asChild
                disabled={!isAvailable}
                className="mt-6 h-14 w-full rounded-xl text-base font-semibold"
              >
                <Link href={`/resale/${id}/trade-booking/${listingId}/confirm`}>
                  Mua vé ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {!isAvailable && (
                <p className="mt-3 text-center text-sm text-zinc-500">
                  Vé đã được bán hoặc không còn khả dụng
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
