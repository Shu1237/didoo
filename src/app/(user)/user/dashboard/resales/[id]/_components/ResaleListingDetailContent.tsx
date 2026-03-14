"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetTicketListing, useGetTicketType } from "@/hooks/useTicket";
import { useGetBooking } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import type { TicketListing } from "@/types/ticket";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Ticket,
  Clock3,
  Activity,
} from "lucide-react";
import { TicketListingStatus } from "@/utils/enum";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export function ResaleListingDetailContent({ id }: { id: string }) {
  const { data: listingRes, isLoading } = useGetTicketListing(id);
  const listing: TicketListing | undefined = listingRes?.data;
  const firstTicketTypeId = listing?.ticket?.[0]?.ticketTypeId || "";
  const { data: ticketTypeRes } = useGetTicketType(firstTicketTypeId);
  const ticketType = ticketTypeRes?.data;

  const { data: bookingRes } = useGetBooking(listing?.bookingId || "");
  const booking = bookingRes?.data;

  const { data: eventRes } = useGetEvent(listing?.eventId || booking?.eventId || "");
  const event = eventRes?.data;

  if (isLoading) return null;

  if (!listing) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
        Không tìm thấy vé bán lại này.
      </div>
    );
  }

  const statusLabel =
    listing.status === TicketListingStatus.SOLD
      ? "Đã bán"
      : listing.status === TicketListingStatus.ACTIVE
        ? "Đang bán"
        : listing.status === TicketListingStatus.CANCELLED
          ? "Đã hủy"
          : "Chờ duyệt";

  const statusClass =
    listing.status === TicketListingStatus.SOLD
      ? "bg-blue-500/10 text-blue-700 border-blue-200"
      : listing.status === TicketListingStatus.ACTIVE
        ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
        : listing.status === TicketListingStatus.CANCELLED
          ? "bg-rose-500/10 text-rose-700 border-rose-200"
          : "bg-amber-500/10 text-amber-700 border-amber-200";

  const listingTickets = listing.ticket || [];
  const listedQty = listingTickets.length > 0 ? listingTickets.length : 1;
  const locationLabel =
    event?.locations?.[0]?.address ||
    event?.locations?.[0]?.province ||
    "Đang cập nhật";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full border border-zinc-200">
          <Link href="/user/dashboard/resales">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Chi tiết vé bán lại</h1>
          <p className="text-xs text-zinc-500">Mã niêm yết: {listing.id}</p>
        </div>
      </div>

      <Card className="overflow-hidden border-zinc-200">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-52 w-full shrink-0 bg-zinc-100 sm:h-auto sm:w-64">
            {event?.bannerUrl || event?.thumbnailUrl ? (
              <Image
                src={event?.bannerUrl || event?.thumbnailUrl || ""}
                alt={event?.name || "Sự kiện"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                <Ticket className="mr-1 h-4 w-4" />
                Ảnh sự kiện
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between gap-5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                  Vé niêm yết
                </p>
                <h2 className="text-xl font-semibold text-zinc-900">
                  {event?.name || listing.event?.name || "Sự kiện không xác định"}
                </h2>
                <p className="text-xs text-zinc-500">Mã niêm yết: {listing.id}</p>
              </div>
              <Badge variant="outline" className={statusClass}>
                {statusLabel}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs text-zinc-500">Giá đăng</p>
                <p className="mt-1 text-xl font-bold text-amber-600">
                  {formatCurrency(Number(listing.askingPrice || 0))}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs text-zinc-500">Đã bán ra</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">{listingTickets.length} vé</p>
              </div>
             
            </div>

            <div className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-500" />
                {locationLabel}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-zinc-500" />
                {event?.startTime
                  ? new Date(event.startTime).toLocaleString("vi-VN")
                  : "Đang cập nhật thời gian sự kiện"}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-zinc-500" />
                Tạo lúc {new Date(listing.createdAt).toLocaleString("vi-VN")}
              </p>
              <p className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-500" />
                Cập nhật:{" "}
                {listing.updatedAt ? new Date(listing.updatedAt).toLocaleString("vi-VN") : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold text-zinc-900">Thông tin vé bán</h3>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Số lượng niêm yết</span>
              <span className="font-semibold text-zinc-900">{listedQty} vé</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Loại vé</span>
              <span className="font-semibold text-zinc-900 text-right">
                {ticketType?.name || firstTicketTypeId || "Đang cập nhật"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Giá loại vé</span>
              <span className="font-semibold text-zinc-900">
                {ticketType?.price ? formatCurrency(Number(ticketType.price)) : "Đang cập nhật"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold text-zinc-900">Mô tả</h3>
          </CardHeader>
          <CardContent className="text-sm text-zinc-700">
            <div className="rounded-lg border border-zinc-200 p-3">
              <p>{listing.description || "Không có mô tả."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

