"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";

interface EventsGridProps {
  title: string;
  eventData: Event[];
  description?: string;
  icon?: ReactNode;
  viewAllLink?: string;
}

export default function EventsGrid({
  title,
  eventData,
  description,
  icon,
  viewAllLink = "/events",
}: EventsGridProps) {
  if (!eventData?.length) return null;

  return (
    <section className="w-full space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            {icon}
            <span>{title}</span>
          </div>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              {description}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          asChild
          className="h-10 rounded-full border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-50"
        >
          <Link href={viewAllLink}>
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="flex flex-wrap justify-center gap-6"
      >
        {eventData.map((event) => (
          <motion.div
            key={event.id}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="h-[400px] lg:h-[450px] w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] 2xl:w-[calc(20%-1.2rem)] shrink-0"
          >
            <Link href={`/events/${event.id}`} className="block relative w-full h-full rounded-[2rem] overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
              <Image
                src={event.thumbnailUrl || event.bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070'}
                alt={event.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                    {event.category?.name || "Event"}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-black text-white mb-2 leading-[1.1] line-clamp-3">
                    {event.name}
                  </h3>

                  <div className="flex flex-col gap-2 mt-4 text-slate-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-3 h-3 text-white" />
                      </div>
                      {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <span className="line-clamp-1">{event.locations?.[0]?.name || "Online / TBA"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
