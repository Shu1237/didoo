"use client";

import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/event";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MonthOverviewProps {
  events: Event[];
}

export function MonthOverview({ events }: MonthOverviewProps) {
  const highlightEvents = events.slice(1, 5);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Khám phá thêm
          </h2>
          <p className="mt-2 text-zinc-600">Những sự kiện đáng chú ý</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlightEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link
                href={`/events/${event.id}`}
                className="block relative h-[380px] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={
                    event.thumbnailUrl ||
                    event.bannerUrl ||
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800"
                  }
                  alt={event.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-3">
                    {event.category?.name || "Sự kiện"}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-4">
                    {event.name}
                  </h3>
                  <div className="flex flex-col gap-2 text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" />
                      {format(new Date(event.startTime), "dd MMM yyyy", { locale: vi })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">
                        {event.locations?.[0]?.name || event.locations?.[0]?.address || "TBA"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
