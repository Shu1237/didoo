"use client";

import { TicketListingStatus } from "@/utils/enum";

export function getListingStatusLabel(status?: number | string | null) {
  const s = Number(status ?? 0);
  if (s === TicketListingStatus.ACTIVE) {
    return { label: "Đang bán", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" };
  }
  if (s === TicketListingStatus.SOLD) {
    return { label: "Đã bán", className: "bg-blue-500/10 text-blue-700 border-blue-200" };
  }
  if (s === TicketListingStatus.CANCELLED) {
    return { label: "Đã hủy", className: "bg-rose-500/10 text-rose-700 border-rose-200" };
  }
  return { label: "Chờ duyệt", className: "bg-amber-500/10 text-amber-700 border-amber-200" };
}

export function getBookingStatusView(status?: string | number | null) {
  const raw = String(status ?? "").toLowerCase();
  if (raw.includes("paid") || raw.includes("success") || raw === "2") {
    return { label: "Đã thanh toán", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" };
  }
  if (raw.includes("pending") || raw === "1") {
    return { label: "Chờ thanh toán", className: "bg-amber-500/10 text-amber-700 border-amber-200" };
  }
  if (raw.includes("cancel") || raw.includes("failed") || raw === "3") {
    return { label: "Đã hủy", className: "bg-rose-500/10 text-rose-700 border-rose-200" };
  }
  return { label: "Không xác định", className: "bg-zinc-500/10 text-zinc-700 border-zinc-200" };
}
