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
      ? format(new Date(featuredEvent.startTime), "MMM dd, yyyy", { locale: vi })
      : "Updating";

  return (
    <section className="relative overflow-visible px-4 pt-32 pb-20 md:pb-28">
      {/* Immersive Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-violet-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-amber-300/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8 lg:col-span-6 xl:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/50 bg-white/60 backdrop-blur-md px-5 py-2.5 text-xs font-black uppercase tracking-widest text-sky-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Event Discovery
          </div>

          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
              Find the perfect event
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-violet-600 mt-2">in seconds.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 font-medium">
              Explore our curated selection of upcoming events. From underground shows to tech conferences, easily book your tickets below.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-4">
            <div className="rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">
                Total Events
              </p>
              <p className="text-4xl font-black text-slate-900">{totalEvents}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">
                Categories
              </p>
              <p className="text-4xl font-black text-slate-900">{totalCategories}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button asChild className="h-14 rounded-full px-8 font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-600/20 hover:shadow-sky-600/40 transition-all">
              <Link href="#events-grid">
                Explore Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-slate-300 bg-white/50 backdrop-blur-md px-8 text-slate-700 hover:bg-white font-black uppercase tracking-widest text-sm"
            >
              <Link href="/map">View on Map</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="lg:col-span-6 xl:col-span-5 relative"
        >
          {featuredEvent ? (
            <Link href={`/events/${featuredEvent.id}`} className="group block relative">
              {/* Decorative back card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-violet-400 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-white shadow-2xl shadow-slate-900/10">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={
                      featuredEvent.thumbnailUrl ||
                      featuredEvent.bannerUrl ||
                      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={featuredEvent.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                  <div className="absolute top-6 left-6 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                    Featured Event
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                    <h2 className="line-clamp-2 text-3xl font-black tracking-tight text-white leading-tight">
                      {featuredEvent.name}
                    </h2>
                    <div className="flex flex-col gap-2 text-sm font-medium text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <CalendarDays className="h-4 w-4 text-white" />
                        </div>
                        <span>{featuredDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="line-clamp-1">
                          {featuredEvent.locations?.[0]?.name || "Location TBA"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white/40 backdrop-blur-md p-12 text-center text-slate-600 shadow-sm">
              <p className="font-bold">No featured event available.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
