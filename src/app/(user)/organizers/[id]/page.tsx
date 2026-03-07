"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Ticket,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetOrganizer } from "@/hooks/useOrganizer";
import { toast } from "sonner";

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop";
const FALLBACK_LOGO = "https://i.pravatar.cc/240?u=organizer";
const FALLBACK_EVENT =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070";

export default function OrganizerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [eventTab, setEventTab] = useState<"upcoming" | "past">("upcoming");

  const { data: organizerResponse, isLoading: isOrganizerLoading } = useGetOrganizer(id);
  const organizer = organizerResponse?.data;

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents({
    organizerId: id,
    pageSize: 20,
    hasCategory: true,
    hasLocations: true,
  });
  const allEvents = eventsResponse?.data.items || [];
  const now = new Date().getTime();
  const upcomingEvents = allEvents.filter((e) => new Date(e.startTime).getTime() >= now);
  const pastEvents = allEvents.filter((e) => new Date(e.startTime).getTime() < now);
  const displayEvents = eventTab === "upcoming" ? upcomingEvents : pastEvents;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: organizer?.name,
          url: window.location.href,
        });
        toast.success("Đã chia sẻ");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép link");
      }
    } catch {
      toast.info("Đã hủy chia sẻ");
    }
  };

  if (isOrganizerLoading) return <Loading />;

  if (!organizer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy nhà tổ chức.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/events">Quay lại sự kiện</Link>
          </Button>
        </div>
      </main>
    );
  }

  const joinedLabel = organizer.createdAt
    ? `Tham gia ${format(new Date(organizer.createdAt), "MMM yyyy", { locale: vi })}`
    : "";

  const socials = [
    { label: "Facebook", icon: Facebook, url: organizer.facebookUrl },
    { label: "Instagram", icon: Instagram, url: organizer.instagramUrl },
    { label: "TikTok", icon: Globe, url: organizer.tiktokUrl },
  ].filter((item) => item.url);

  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      {/* Banner */}
      <section className="relative h-[280px] md:h-[340px] w-full overflow-hidden">
        <Image
          src={organizer.bannerUrl || FALLBACK_BANNER}
          alt={organizer.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="-mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:h-36 md:w-36">
              <Image
                src={organizer.logoUrl || FALLBACK_LOGO}
                alt={organizer.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl lg:text-4xl">
                  {organizer.name}
                </h1>
                {organizer.isVerified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <BadgeCheck className="h-4 w-4" />
                    Đã xác minh
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                {organizer.address && `${organizer.address} • `}
                {joinedLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="rounded-xl font-semibold">Theo dõi</Button>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50"
              aria-label="Chia sẻ"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{allEvents.length}</p>
                <p className="text-xs font-medium text-zinc-500">Sự kiện</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">—</p>
                <p className="text-xs font-medium text-zinc-500">Người theo dõi</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">—</p>
                <p className="text-xs font-medium text-zinc-500">Đánh giá</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column */}
          <div className="space-y-10 lg:col-span-8">
            {/* About */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900">Về nhà tổ chức</h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                {organizer.description ||
                  "Nhà tổ chức sự kiện chuyên nghiệp, tạo ra những trải nghiệm đáng nhớ cho cộng đồng."}
              </p>
            </section>

            {/* Events with tabs */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <h2 className="text-lg font-bold text-zinc-900">Sự kiện</h2>
                <div className="flex gap-1 rounded-xl bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => setEventTab("upcoming")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      eventTab === "upcoming"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Sắp diễn ra
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventTab("past")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      eventTab === "past"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Đã qua
                  </button>
                </div>
              </div>

              {isEventsLoading ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-100" />
                  ))}
                </div>
              ) : displayEvents.length > 0 ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {displayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
                  <Ticket className="mx-auto h-12 w-12 text-zinc-400" />
                  <p className="mt-4 font-medium text-zinc-600">
                    {eventTab === "upcoming"
                      ? "Chưa có sự kiện sắp diễn ra"
                      : "Chưa có sự kiện đã qua"}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6 lg:col-span-4">
            {/* Contact Info */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900">Thông tin liên hệ</h2>
              <div className="mt-4 space-y-3">
                {organizer.email && (
                  <a
                    href={`mailto:${organizer.email}`}
                    className="flex items-center gap-3 text-sm text-zinc-600 hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    {organizer.email}
                  </a>
                )}
                {organizer.phone && (
                  <a
                    href={`tel:${organizer.phone}`}
                    className="flex items-center gap-3 text-sm text-zinc-600 hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {organizer.phone}
                  </a>
                )}
                {organizer.websiteUrl && (
                  <a
                    href={organizer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-zinc-600 hover:text-primary"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    {organizer.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {!organizer.email && !organizer.phone && !organizer.websiteUrl && (
                  <p className="text-sm text-zinc-500">Chưa có thông tin liên hệ</p>
                )}
              </div>
            </section>

            {/* Social Media */}
            {socials.length > 0 && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900">Mạng xã hội</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition hover:border-primary hover:text-primary"
                      title={s.label}
                    >
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Quick info / Achievements */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900">Thông tin nhanh</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{allEvents.length} sự kiện</p>
                    <p className="text-xs text-zinc-500">Đã tổ chức</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {organizer.createdAt
                        ? new Date(organizer.createdAt).getFullYear()
                        : "—"}
                    </p>
                    <p className="text-xs text-zinc-500">Năm tham gia</p>
                  </div>
                </div>
                {organizer.isVerified && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Đã xác minh</p>
                      <p className="text-xs text-zinc-500">Nhà tổ chức uy tín</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function EventCard({ event }: { event: any }) {
  const startDate = new Date(event.startTime);
  const location = event.locations?.[0]?.name || event.locations?.[0]?.address || "TBA";

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.thumbnailUrl || event.bannerUrl || FALLBACK_EVENT}
          alt={event.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
        <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-zinc-900">
          {format(startDate, "dd MMM", { locale: vi })}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-zinc-900 line-clamp-2">{event.name}</h3>
        <div className="mt-2 flex flex-col gap-1 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {event.openTime || "TBA"} - {event.closedTime || "TBA"}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </span>
        </div>
        <span className="mt-4 flex w-full items-center justify-center rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition group-hover:border-primary group-hover:text-primary">
          Xem sự kiện
        </span>
      </div>
    </Link>
  );
}
