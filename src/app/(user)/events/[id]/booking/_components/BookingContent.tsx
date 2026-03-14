"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, HelpCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { TicketType } from "@/types/ticket";

export type BookingDraftItem = {
  ticketTypeId: string;
  quantity: number;
};

interface BookingContentProps {
  eventId: string;
  event: Event;
  ticketTypes: TicketType[];
  selected: BookingDraftItem | null;
  totalPrice: number;
  realtimeAvailability: Record<string, number>;
  maxPerUser: (tt: TicketType) => number | null;
  maxAllowed: (tt: TicketType) => number;
  hasReachedMax: (tt: TicketType) => boolean;
  onQuantityChange: (tt: TicketType, delta: number) => void;
  onGoToConfirm: () => void;
}

export function BookingContent({
  eventId,
  event,
  ticketTypes,
  selected,
  totalPrice,
  realtimeAvailability,
  maxPerUser,
  maxAllowed,
  hasReachedMax,
  onQuantityChange,
  onGoToConfirm,
}: BookingContentProps) {
  const TicketCard = ({
    tt,
    soldOut,
    isSelected,
    limit,
    reachedMax,
  }: {
    tt: TicketType;
    soldOut: boolean;
    isSelected: boolean;
    limit: number;
    reachedMax: boolean;
  }) => {
    const total = tt.totalQuantity ?? 0;
    const avail = realtimeAvailability[tt.id] ?? Math.max(0, Number(tt.availableQuantity ?? 0));
    const sold = total - avail;
    const cap = maxPerUser(tt);

    return (
      <div
        className={`rounded-xl border p-4 transition ${
          soldOut
            ? "border-zinc-200 bg-zinc-50 opacity-60"
            : isSelected
              ? "border-primary bg-primary/5"
              : "border-zinc-200 bg-white hover:border-zinc-300"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-zinc-900">{tt.name}</h3>
            {tt.description && (
              <p className="mt-1 text-sm text-zinc-500">{tt.description}</p>
            )}
            <p className="mt-2 text-lg font-bold text-zinc-900">
              {Number(tt.price ?? 0) === 0
                ? "Miễn phí"
                : `${Number(tt.price).toLocaleString("vi-VN")}đ`}
            </p>
            {!soldOut && (
              <span className="text-xs font-medium text-zinc-600">
                {sold}/{total} đã bán
                {cap != null && ` · Tối đa ${cap} vé/người`}
              </span>
            )}
            {!soldOut && reachedMax && (
              <span className="mt-2 inline-block text-xs font-medium text-amber-600">
                Bạn đã đạt giới hạn vé cho loại này
              </span>
            )}
            {soldOut && (
              <span className="mt-2 inline-block text-xs font-medium text-rose-600">
                Hết vé
              </span>
            )}
          </div>
          {!soldOut && (
            <span className="text-xs font-medium text-zinc-600">
              Còn {avail} vé
            </span>
          )}
        </div>
        {!soldOut && (
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuantityChange(tt, -1)}
              disabled={!isSelected || (selected?.quantity ?? 0) <= 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center font-semibold text-zinc-900">
              {isSelected ? selected?.quantity ?? 0 : 0}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(tt, 1)}
              disabled={reachedMax || (isSelected && (selected?.quantity ?? 0) >= limit)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
            {!isSelected && (
              <span className="ml-2 text-xs text-zinc-500">
                Chỉ được chọn 1 loại vé
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <>
      <h2 className="text-lg font-bold text-zinc-900">Chọn vé</h2>
      <p className="mt-1 text-xs text-zinc-500">Chỉ được chọn 1 loại vé trong 1 đơn</p>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        {selected ? (
          <div>
            <p className="font-semibold text-zinc-900">
              {ticketTypes.find((t) => t.id === selected.ticketTypeId)?.name}
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              {selected.quantity} x{" "}
              {Number(
                ticketTypes.find((t) => t.id === selected.ticketTypeId)?.price ?? 0
              ) === 0
                ? "Miễn phí"
                : `${Number(
                    ticketTypes.find((t) => t.id === selected.ticketTypeId)?.price
                  ).toLocaleString("vi-VN")}đ`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Chưa chọn vé</p>
        )}
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-900">Tổng</span>
          <span className="text-xl font-bold text-zinc-900">
            {totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      <Button
        type="button"
        onClick={onGoToConfirm}
        disabled={!selected || selected.quantity <= 0}
        className="mt-6 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
      >
        Mua vé ngay
        <ArrowUpRight className="ml-2 h-5 w-5" />
      </Button>

      <p className="mt-4 text-center text-xs text-zinc-500">
        Bằng việc mua vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Cần hỗ trợ?</p>
          <p className="text-xs text-zinc-600">Liên hệ bộ phận chăm sóc khách hàng</p>
        </div>
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/events/${eventId}`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại sự kiện
        </Link>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900">Loại vé</h2>
              <div className="mt-4 space-y-4">
                {ticketTypes.map((tt) => {
                  const avail = realtimeAvailability[tt.id] ?? Math.max(0, Number(tt.availableQuantity ?? 0));
                  const soldOut = avail <= 0;
                  const isSelected = selected?.ticketTypeId === tt.id;
                  const limit = maxAllowed(tt);
                  const reachedMax = hasReachedMax(tt);
                  return (
                    <TicketCard
                      key={tt.id}
                      tt={tt}
                      soldOut={soldOut}
                      isSelected={isSelected}
                      limit={limit}
                      reachedMax={reachedMax}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <SidebarContent />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
