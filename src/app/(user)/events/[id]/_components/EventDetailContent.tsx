"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  Share2,
  ShoppingCart,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { TicketType } from "@/types/ticket";
import { EventStatus } from "@/utils/enum";
import { useGetOrganizer } from "@/hooks/useEvent";
import { toast } from "sonner";
import EventLocation from "./EventLocation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface EventDetailContentProps {
  event: Event;
  ticketTypes: TicketType[];
  eventRelated?: Event[];
}

const FALLBACK_ORGANIZER_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop";

const FALLBACK_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800";

function getStatusLabel(status: EventStatus) {
  if (status === EventStatus.PUBLISHED || status === EventStatus.OPENED) return "Đang mở bán";
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

export default function EventDetailContent({
  event,
  ticketTypes,
  eventRelated = [],
}: EventDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("details");

  const { data: orgData } = useGetOrganizer(event.organizer?.id || "");
  const organizer = orgData?.data;
  const orgImage =
    organizer?.bannerUrl || organizer?.logoUrl || event.organizer?.logoUrl || FALLBACK_ORGANIZER_IMAGE;

  const minPrice =
    ticketTypes.length > 0
      ? Math.min(...ticketTypes.map((t) => Number(t.price || 0)))
      : 0;
  const totalTickets = ticketTypes.reduce((s, t) => s + (t.totalQuantity ?? 0), 0);
  const soldTickets = ticketTypes.reduce(
    (s, t) => s + ((t.totalQuantity ?? 0) - (t.availableQuantity ?? 0)),
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

  const quickInfoItems = [
    { label: "Thể loại", value: event.category?.name || "Sự kiện chung", icon: Tag },
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

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
      <span className="h-6 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/events?categoryId=${event.category?.id || ""}`}
          className="hover:text-primary transition-colors"
        >
          {event.category?.name || "Sự kiện"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-900 font-medium truncate max-w-[200px]">{event.name}</span>
      </nav>

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
              {/* Quick info - 4 cards */}
              <div className="grid grid-cols-2 gap-4">
                {quickInfoItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        item.label === "Trạng thái"
                          ? "bg-primary/10 text-primary"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {item.label}
                      </p>
                      <p
                        className={`font-semibold ${
                          item.label === "Trạng thái" ? "text-primary" : "text-zinc-900"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Về sự kiện */}
              <div>
                <SectionHeading>Về sự kiện</SectionHeading>
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
              </div>

              {/* Nhà tổ chức */}
              <div>
                <SectionHeading>Nhà tổ chức</SectionHeading>
                <Link
                  href={`/organizers/${event.organizer?.id || ""}`}
                  className="mt-4 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-zinc-900">
                      {organizer?.name || event.organizer?.name || "Organizer"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                      {organizer?.description || "Nhà tổ chức sự kiện"}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Xem trang cá nhân
                      <ChevronRight className="h-4 w-4" />
                    </span>
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

        {/* Right: Sidebar */}
        <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Ticket card */}
          <div className="sticky top-24 space-y-6">
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
              {ticketTypes.length > 0 && minPrice > 0 && (
                <span className="absolute right-4 top-4 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white">
                  Sale off
                </span>
              )}
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Giá vé từ
              </p>
              <p className="mt-1 text-3xl font-black text-zinc-900">
                {ticketTypes.length > 0
                  ? `${minPrice.toLocaleString("vi-VN")}₫`
                  : "Liên hệ"}
              </p>
              {totalTickets > 0 && (
                <p className="mt-2 text-sm text-zinc-600">
                  Đã bán: {soldTickets.toLocaleString("vi-VN")}/{totalTickets.toLocaleString("vi-VN")} vé
                </p>
              )}
              {ticketTypes.length > 0 ? (
                <Button
                  asChild
                  className="mt-6 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                >
                  <Link href={`/events/${event.id}/booking`}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Chọn vé ngay
                  </Link>
                </Button>
              ) : (
                <p className="mt-6 text-sm text-zinc-500">Sự kiện chưa mở bán vé.</p>
              )}
              <div className="mt-4 flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                  <Heart className="mr-2 h-4 w-4" />
                  Lưu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia sẻ
                </Button>
              </div>
            </div>

            {/* Địa điểm tổ chức */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <SectionHeading>Địa điểm tổ chức</SectionHeading>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("event-map")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="relative block w-full aspect-video overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 group"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/80">
                    <MapPin className="h-12 w-12 text-zinc-400" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900">
                      Xem bản đồ
                    </span>
                  </div>
                </button>
                <p className="mt-3 text-sm text-zinc-600 line-clamp-2">
                  {event.locations?.[0]?.address || "Đang cập nhật địa chỉ"}
                </p>
              </div>
            </div>

            {/* Sự kiện tương tự */}
            {eventRelated.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <SectionHeading>Sự kiện tương tự</SectionHeading>
                <div className="mt-4 space-y-4">
                  {eventRelated.slice(0, 3).map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/events/${ev.id}`}
                      className="flex gap-4 rounded-xl border border-zinc-200 p-3 transition hover:border-primary/30 hover:shadow-sm"
                    >
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={
                            ev.thumbnailUrl ||
                            ev.bannerUrl ||
                            FALLBACK_EVENT_IMAGE
                          }
                          alt={ev.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-zinc-900 line-clamp-2 text-sm">
                          {ev.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(new Date(ev.startTime), "dd MMM yyyy", { locale: vi })}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="line-clamp-1">
                            {ev.locations?.[0]?.name || ev.locations?.[0]?.address || "TBA"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Map section */}
      <div id="event-map" className="mt-16">
        <EventLocation event={event} />
      </div>
    </div>
  );
}
