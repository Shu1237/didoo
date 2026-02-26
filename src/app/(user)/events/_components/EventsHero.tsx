"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";

interface EventsHeroProps {
  featuredEvent?: Event;
  totalEvents: number;
  totalCategories: number;
}

export default function EventsHero({
  featuredEvent,
  totalEvents,
  totalCategories,
}: EventsHeroProps) {
  const featuredDate =
    featuredEvent?.startTime && isValid(new Date(featuredEvent.startTime))
      ? format(new Date(featuredEvent.startTime), "dd MMMM, yyyy", { locale: vi })
      : "Dang cap nhat";

  return (
    <section className="relative overflow-hidden px-4 pt-28 pb-14 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 left-[-6%] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute top-0 right-[-8%] h-[22rem] w-[22rem] rounded-full bg-amber-200/60 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Event Discovery
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Tim su kien phu hop
              <span className="block text-sky-600">de dat ve nhanh hon</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Giao dien moi giup ban xem lich, dia diem va thong tin ve ro rang hon,
              thao tac dat ve nhanh va de tren ca mobile lan desktop.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Tong su kien
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalEvents}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Danh muc
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalCategories}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="h-11 rounded-full px-6">
              <Link href="/events">
                Kham pha ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-slate-300 bg-white/80 px-6 text-slate-700 hover:bg-white"
            >
              <Link href="/map">Xem ban do</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          {featuredEvent ? (
            <Link href={`/events/${featuredEvent.id}`} className="group block">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_40px_-25px_rgba(15,23,42,0.45)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={
                      featuredEvent.thumbnailUrl ||
                      featuredEvent.bannerUrl ||
                      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={featuredEvent.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                    Spotlight
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <h2 className="line-clamp-2 text-2xl font-bold tracking-tight text-slate-900">
                    {featuredEvent.name}
                  </h2>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-sky-600" />
                      <span>{featuredDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sky-600" />
                      <span className="line-clamp-1">
                        {featuredEvent.locations?.[0]?.name || "Dang cap nhat dia diem"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600 shadow-sm">
              Chua co su kien noi bat.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
