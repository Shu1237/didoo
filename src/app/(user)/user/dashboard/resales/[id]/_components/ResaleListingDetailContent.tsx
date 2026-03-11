"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetTicketListing } from "@/hooks/useTicket";
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
  Wallet,
  UserRound,
  Activity,
} from "lucide-react";
import { TicketListingStatus } from "@/utils/enum";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export function ResaleListingDetailContent({ id }: { id: string }) {
  const { data: listingRes, isLoading } = useGetTicketListing(id);
  const listing: TicketListing | undefined = listingRes?.data;

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

  const listedQty = 1;
  const soldQty = listing.status === TicketListingStatus.SOLD ? (booking?.amount || 1) : 0;
  const soldValue = soldQty > 0 ? Number(listing.askingPrice || 0) * soldQty : 0;
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
            {event?.thumbnailUrl ? (
              <Image
                src={event.thumbnailUrl}
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
                <p className="mt-1 text-xl font-bold text-zinc-900">{soldQty} vé</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs text-zinc-500">Doanh thu niêm yết</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">
                  {formatCurrency(soldValue)}
                </p>
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
              <span className="text-zinc-500">Số lượng đã bán</span>
              <span className="font-semibold text-zinc-900">{soldQty} vé</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Mã vé</span>
              <span className="font-mono text-xs text-zinc-900">{listing.ticket?.id || "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Mã loại vé</span>
              <span className="font-mono text-xs text-zinc-900">
                {listing.ticket?.ticketTypeId || "—"}
              </span>
            </div>
            {listing.description && (
              <div className="rounded-lg border border-zinc-200 p-3 text-zinc-700">
                <p className="mb-1 text-xs font-medium text-zinc-500">Mô tả</p>
                <p>{listing.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold text-zinc-900">Sự kiện & giao dịch</h3>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Mã sự kiện</span>
              <span className="font-mono text-xs text-zinc-900">
                {event?.id || listing.event?.id || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="text-zinc-500">Tên sự kiện</span>
              <span className="font-semibold text-zinc-900">
                {event?.name || listing.event?.name || "—"}
              </span>
            </div>
            {booking ? (
              <>
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <UserRound className="h-4 w-4" />
                    Người mua
                  </span>
                  <span className="font-semibold text-zinc-900">{booking.fullname}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Wallet className="h-4 w-4" />
                    Giao dịch liên quan
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency(Number(booking.totalPrice || 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                  <span className="text-zinc-500">Thời gian thanh toán</span>
                  <span className="font-semibold text-zinc-900">
                    {new Date(booking.paidAt || booking.createdAt || "").toLocaleString("vi-VN")}
                  </span>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 p-3 text-zinc-500">
                Chưa có giao dịch mua cho vé niêm yết này.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

