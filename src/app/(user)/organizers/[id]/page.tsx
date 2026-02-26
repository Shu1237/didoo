"use client";

import { use } from "react";
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
  Ticket,
} from "lucide-react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import TicketCard from "@/components/ui/TicketCard";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetOrganizer } from "@/hooks/useOrganizer";

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop";
const FALLBACK_LOGO = "https://i.pravatar.cc/240?u=organizer";

export default function OrganizerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: organizerResponse, isLoading: isOrganizerLoading } = useGetOrganizer(id);
  const organizer = organizerResponse?.data;

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents({
    organizerId: id,
    pageSize: 12,
    isDescending: true,
  });
  const events = eventsResponse?.data.items || [];

  if (isOrganizerLoading) return <Loading />;

  if (!organizer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Organizer khong ton tai.</p>
          <Button asChild className="mt-4 rounded-full px-6">
            <Link href="/events">Quay lai danh sach su kien</Link>
          </Button>
        </div>
      </main>
    );
  }

  const socials = [
    { label: "Facebook", icon: Facebook, url: organizer.facebookUrl },
    { label: "Instagram", icon: Instagram, url: organizer.instagramUrl },
    { label: "TikTok", icon: Globe, url: organizer.tiktokUrl },
    { label: "Email", icon: Mail, url: organizer.email ? `mailto:${organizer.email}` : null },
    { label: "Phone", icon: Phone, url: organizer.phone ? `tel:${organizer.phone}` : null },
  ].filter((item) => item.url);

  const createdAtLabel = organizer.createdAt
    ? new Date(organizer.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Dang cap nhat";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-[-10%] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute top-1/3 right-[-8%] h-[22rem] w-[22rem] rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl space-y-8 px-4 md:px-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-52 sm:h-64 md:h-72">
            <Image
              src={organizer.bannerUrl || FALLBACK_BANNER}
              alt={organizer.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/20 to-transparent" />
          </div>

          <div className="relative px-5 pb-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="-mt-14 flex flex-col gap-5 md:-mt-16 md:flex-row md:items-end md:justify-between"
            >
              <div className="flex items-end gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-sm md:h-28 md:w-28">
                  <Image
                    src={organizer.logoUrl || FALLBACK_LOGO}
                    alt={organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-4xl">
                      {organizer.name}
                    </h1>
                    {organizer.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-200">Don vi to chuc su kien</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {organizer.websiteUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-full border-white/70 bg-white/90 text-slate-700 hover:bg-white"
                  >
                    <a href={organizer.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                <Button asChild className="h-10 rounded-full px-5">
                  <Link href="/events">Kham pha su kien</Link>
                </Button>
              </div>
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-2">
              {organizer.address && (
                <InfoChip icon={MapPin} value={organizer.address} />
              )}
              {organizer.email && <InfoChip icon={Mail} value={organizer.email} />}
              {organizer.phone && <InfoChip icon={Phone} value={organizer.phone} />}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Gioi thieu</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                {organizer.description ||
                  "Organizer chuyen to chuc cac su kien van hoa, giai tri va cong dong voi trai nghiem thuc te, ro rang va chuyen nghiep."}
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Ket noi</h3>
              {socials.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                    >
                      <social.icon className="h-4 w-4 text-sky-600" />
                      {social.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Chua co thong tin lien he.</p>
              )}
            </article>

            <article className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard
                icon={Ticket}
                label="Su kien da tao"
                value={events.length.toString()}
                tone="sky"
              />
              <StatCard
                icon={CalendarDays}
                label="Ngay tham gia"
                value={createdAtLabel}
                tone="amber"
              />
            </article>
          </div>

          <div className="lg:col-span-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Event List
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    Su kien da to chuc
                  </h2>
                </div>
                <span className="rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
                  {events.length} su kien
                </span>
              </div>

              {isEventsLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                    />
                  ))}
                </div>
              ) : events.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {events.map((event) => (
                    <TicketCard key={event.id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <p className="text-slate-600">Organizer nay chua co su kien duoc cong bo.</p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoChip({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 md:text-sm">
      <Icon className="h-3.5 w-3.5 text-sky-600" />
      <span className="line-clamp-1">{value}</span>
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "sky" | "amber";
}) {
  const toneClasses =
    tone === "sky"
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
