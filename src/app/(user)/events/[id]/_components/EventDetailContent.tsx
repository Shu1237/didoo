"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { TicketType } from "@/types/ticketType";
import { EventStatus } from "@/utils/enum";
import { useGetOrganizer } from "@/hooks/useOrganizer";
import { toast } from "sonner";
import EventLocation from "./EventLocation";

interface EventDetailContentProps {
  event: Event;
  ticketTypes: TicketType[];
}

const FALLBACK_ORGANIZER_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop";

function getStatusLabel(status: EventStatus) {
  if (status === EventStatus.PUBLISHED || status === EventStatus.OPENED) return "Đang mở";
  if (status === EventStatus.CLOSED) return "Đã đóng";
  if (status === EventStatus.CANCELLED) return "Đã hủy";
  return "Sắp diễn ra";
}

function formatDate(s: string | undefined) {
  if (!s) return "Đang cập nhật";
  return new Date(s).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type TabId = "details" | "venue";

export default function EventDetailContent({ event, ticketTypes }: EventDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [selectedTickets, setSelectedTickets] = useState<{ ticketType: TicketType; quantity: number }[]>([]);

  const { data: orgData } = useGetOrganizer(event.organizer?.id || "");
  const organizer = orgData?.data;
  const orgImage =
    organizer?.bannerUrl || organizer?.logoUrl || event.organizer?.logoUrl || FALLBACK_ORGANIZER_IMAGE;

  const totalQuantity = selectedTickets.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = selectedTickets.reduce(
    (s, i) => s + i.quantity * (i.ticketType.price || 0),
    0
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, url: window.location.href });
        toast.success("Đã chia sẻ");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép link");
      }
    } catch {
      toast.info("Đã hủy chia sẻ");
    }
  };

  const handleQuantity = (ticketType: TicketType, delta: number) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((i) => i.ticketType.id === ticketType.id);
      const avail = ticketType.availableQuantity ?? 0;
      if (!existing) {
        if (delta <= 0 || avail <= 0) return prev;
        return [...prev, { ticketType, quantity: 1 }];
      }
      const next = Math.max(0, Math.min(avail, existing.quantity + delta));
      if (next === 0) return prev.filter((i) => i.ticketType.id !== ticketType.id);
      return prev.map((i) =>
        i.ticketType.id === ticketType.id ? { ...i, quantity: next } : i
      );
    });
  };

  const quickInfoItems = [
    { label: "Danh mục", value: event.category?.name || "Sự kiện chung", icon: Tag },
    {
      label: "Độ tuổi",
      value: event.ageRestriction > 0 ? `${event.ageRestriction}+` : "Mọi lứa tuổi",
      icon: Users,
    },
    { label: "Trạng thái", value: getStatusLabel(event.status), icon: Zap },
    {
      label: "Thời gian",
      value: `${event.openTime || "TBA"} - ${event.closedTime || "TBA"}`,
      icon: Clock3,
    },
    { label: "Ngày bắt đầu", value: formatDate(event.startTime), icon: CalendarDays },
    { label: "Ngày kết thúc", value: formatDate(event.endTime), icon: CalendarDays },
  ];

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Chi tiết" },
    { id: "venue", label: "Địa điểm" },
  ];

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    if (tabId === "venue" && event.locations?.length) {
      setTimeout(() => {
        document.getElementById("event-map")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left: Tabs + Content */}
        <div className="lg:col-span-7 xl:col-span-8">
          {/* Tabs */}
          <div className="border-b border-zinc-200">
            <nav className="-mb-px flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`border-b-2 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pt-8"
            >
              {/* About */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Về sự kiện</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-zinc-600">
                  {event.description}
                </p>
                {event.subtitle && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                    <p className="text-sm font-medium text-zinc-800">{event.subtitle}</p>
                  </div>
                )}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.tags.map((tag, i) => (
                      <span
                        key={`${tag.tagName}-${i}`}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-600"
                      >
                        #{tag.tagName}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="rounded-xl"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Heart className="mr-2 h-4 w-4" />
                    Lưu sự kiện
                  </Button>
                </div>
              </div>

              {/* Quick info grid */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Thông tin nhanh</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {quickInfoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500">{item.label}</p>
                        <p className="font-semibold text-zinc-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizer */}
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Nhà tổ chức</h2>
                <Link
                  href={`/organizers/${event.organizer?.id || ""}`}
                  className="mt-4 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    <Image
                      src={orgImage}
                      alt={organizer?.name || "Organizer"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-zinc-900">
                      {organizer?.name || event.organizer?.name || "Organizer"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                      {organizer?.description || "Nhà tổ chức sự kiện"}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-400" />
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "venue" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-8"
            >
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <h3 className="font-semibold text-zinc-900">Địa điểm sự kiện</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Xem bản đồ bên dưới để biết vị trí chính xác và chỉ đường.
                </p>
                <p className="mt-4 text-sm font-medium text-zinc-900">
                  {event.locations?.[0]?.name || event.locations?.[0]?.address || "Đang cập nhật"}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {event.locations?.[0]?.address}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Ticket sidebar */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Chọn vé</h2>

            {ticketTypes.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">Sự kiện chưa mở bán vé.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {ticketTypes.map((tt) => {
                  const item = selectedTickets.find((i) => i.ticketType.id === tt.id);
                  const qty = item?.quantity ?? 0;
                  const soldOut = (tt.availableQuantity ?? 0) <= 0;

                  return (
                    <div
                      key={tt.id}
                      className={`rounded-xl border p-4 ${
                        soldOut ? "border-zinc-200 bg-zinc-50 opacity-60" : "border-zinc-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-zinc-900">{tt.name}</h3>
                          {tt.description && (
                            <p className="mt-1 text-sm text-zinc-500">{tt.description}</p>
                          )}
                          <p className="mt-2 text-lg font-bold text-zinc-900">
                            {Number(tt.price || 0).toLocaleString("vi-VN")}đ
                          </p>
                          {soldOut && (
                            <span className="mt-2 inline-block text-xs font-medium text-rose-600">
                              Hết vé
                            </span>
                          )}
                        </div>
                        {!soldOut && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuantity(tt, -1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[2rem] text-center font-semibold text-zinc-900">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantity(tt, 1)}
                              disabled={qty >= (tt.availableQuantity ?? 0)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {ticketTypes.length > 0 && (
              <>
                <div className="mt-6 border-t border-zinc-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">Tổng</span>
                    <span className="text-xl font-bold text-zinc-900">
                      {totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  className="mt-6 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                >
                  <Link href={`/events/${event.id}/booking`}>
                    Mua vé ngay
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="mt-4 text-center text-xs text-zinc-500">
                  Bằng việc mua vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi.
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Cần hỗ trợ?</p>
                    <p className="text-xs text-zinc-600">Liên hệ bộ phận chăm sóc khách hàng</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Map section - always visible */}
      <div id="event-map" className="mt-16">
        <EventLocation event={event} />
      </div>
    </div>
  );
}
