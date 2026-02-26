"use client";

import Image from "next/image";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventActions from "./EventActions";
import { Event } from "@/types/event";
import { TicketType } from "@/types/ticketType";

interface DetailEventProps {
  event: Event;
  ticketTypes: TicketType[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop";

export default function HeroSection({ event, ticketTypes }: DetailEventProps) {
  const eventDate = new Date(event.startTime);
  const dateLabel =
    event.startTime && isValid(eventDate)
      ? format(eventDate, "EEEE, dd MMMM yyyy", { locale: vi })
      : "Dang cap nhat";

  const minPrice = ticketTypes.length > 0 ? Math.min(...ticketTypes.map((ticket) => ticket.price)) : 0;
  const maxPrice = ticketTypes.length > 0 ? Math.max(...ticketTypes.map((ticket) => ticket.price)) : 0;

  const priceLabel =
    ticketTypes.length === 0
      ? "Mien phi"
      : minPrice === maxPrice
        ? `${minPrice.toLocaleString("vi-VN")} VND`
        : `${minPrice.toLocaleString("vi-VN")} - ${maxPrice.toLocaleString("vi-VN")} VND`;

  return (
    <section className="relative px-4 pb-10 pt-28 md:pb-14">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:items-center">
        <div className="space-y-7 lg:col-span-7">
          <div className="inline-flex items-center rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
            {event.category?.name || "Event"}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              {event.name}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
              {event.subtitle || event.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Thoi gian</p>
              <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-slate-800 md:text-base">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>{dateLabel}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Dia diem</p>
              <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-slate-800 md:text-base">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>{event.locations?.[0]?.name || "Dang cap nhat dia diem"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full px-7 text-base">
              <Link href={`/events/${event.id}/booking`}>
                Dat ve ngay
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <EventActions eventId={event.id} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_40px_-32px_rgba(15,23,42,0.6)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={event.thumbnailUrl || event.bannerUrl || FALLBACK_IMAGE}
                alt={event.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Gia ve</p>
                <p className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">{priceLabel}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4 text-sky-600" />
                  <span>{event.openTime || "Mo cua theo thong bao BTC"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
