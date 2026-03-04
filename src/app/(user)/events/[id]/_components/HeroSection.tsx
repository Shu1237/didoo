"use client";

import Image from "next/image";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      ? format(eventDate, "EEEE, MMMM dd, yyyy", { locale: vi }) // Let's keep date translation generic or just map to English date-fns if we want
      : "Updating";

  const minPrice = ticketTypes.length > 0 ? Math.min(...ticketTypes.map((ticket) => ticket.price)) : 0;
  const maxPrice = ticketTypes.length > 0 ? Math.max(...ticketTypes.map((ticket) => ticket.price)) : 0;

  const priceLabel =
    ticketTypes.length === 0
      ? "Free"
      : minPrice === maxPrice
        ? `${minPrice.toLocaleString("vi-VN")} VND`
        : `${minPrice.toLocaleString("vi-VN")} - ${maxPrice.toLocaleString("vi-VN")} VND`;

  return (
    <>
      {/* Immersive Edge-to-Edge Banner */}
      <section className="relative w-full h-[450px] md:h-[550px]">
        <Image
          src={event.bannerUrl || event.thumbnailUrl || FALLBACK_IMAGE}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        {/* Soft gradient into the page background */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/60 to-slate-900/20" />
      </section>

      {/* Floating Glassmorphism Content Card */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 xl:px-16 mx-auto -mt-32 md:-mt-48 pb-12">
        <div className="rounded-[2.5rem] bg-white/80 backdrop-blur-xl p-6 md:p-10 lg:p-12 shadow-2xl shadow-slate-200/50 border border-white/50 w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">

            {/* Left: Event Details */}
            <div className="space-y-8 lg:col-span-7 xl:col-span-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
                  {event.category?.name || "Event"}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
                  {event.name}
                </h1>
                <p className="max-w-3xl text-base md:text-lg font-medium leading-relaxed text-slate-600">
                  {event.subtitle || event.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-100 bg-white/60 backdrop-blur-md p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Date & Time</p>
                  <p className="mt-2 flex items-center gap-3 text-sm font-bold text-slate-800 md:text-base">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100/50">
                      <CalendarDays className="h-4 w-4 shrink-0 text-sky-600" />
                    </span>
                    <span className="line-clamp-2">{dateLabel}</span>
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-100 bg-white/60 backdrop-blur-md p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Location</p>
                  <p className="mt-2 flex items-center gap-3 text-sm font-bold text-slate-800 md:text-base">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100/50">
                      <MapPin className="h-4 w-4 shrink-0 text-sky-600" />
                    </span>
                    <span className="line-clamp-2">{event.locations?.[0]?.name || "Location TBA"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Actions & Price */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col justify-center lg:sticky lg:top-32">
              <div className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg shadow-slate-200/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center mb-2">Tickets From</p>
                <p className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-6">{priceLabel}</p>

                <div className="flex justify-center items-center gap-2 text-sm font-medium text-slate-500 mb-8 bg-slate-100/50 py-2 px-4 rounded-full mx-auto w-fit">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  <span>{event.openTime || "Doors open per notice"}</span>
                </div>

                <div className="flex flex-col gap-4">
                  <Button asChild className="h-14 w-full rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <Link href={`/events/${event.id}/booking`}>
                      Book Tickets
                      <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
