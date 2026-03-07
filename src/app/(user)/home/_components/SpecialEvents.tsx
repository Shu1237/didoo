"use client";

import { Event } from "@/types/event";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SpecialEventsProps {
  events: Event[];
}

export function SpecialEvents({ events }: SpecialEventsProps) {
  const gridEvents = events.slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
        >
          <div>
            <span className="text-primary font-semibold text-sm">Nổi bật</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mt-2">
              Sự kiện sắp diễn ra
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-zinc-600 hover:text-primary transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
          {gridEvents[0] && (
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <Link
                href={`/events/${gridEvents[0].id}`}
                className="block relative h-full min-h-[320px] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={
                    gridEvents[0].thumbnailUrl ||
                    gridEvents[0].bannerUrl ||
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
                  }
                  alt={gridEvents[0].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />

                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-white text-zinc-900 text-xs font-semibold">
                    Nổi bật
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                      {gridEvents[0].name}
                    </h3>
                    <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                      <span>
                        {format(new Date(gridEvents[0].startTime), "dd MMM", { locale: vi })}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{gridEvents[0].category?.name || "Sự kiện"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <div className="lg:col-span-5 flex flex-col gap-4">
            {gridEvents.slice(1).map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="w-20 h-20 shrink-0 rounded-xl bg-zinc-200 flex flex-col items-center justify-center text-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="text-xs font-semibold">
                      {format(new Date(event.startTime), "MMM", { locale: vi })}
                    </span>
                    <span className="text-2xl font-bold leading-none">
                      {format(new Date(event.startTime), "dd", { locale: vi })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-zinc-500 block mb-1">
                      {event.category?.name || "Sự kiện"}
                    </span>
                    <h4 className="font-semibold text-zinc-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {event.name}
                    </h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
