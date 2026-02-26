"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import TicketCard from "@/components/ui/TicketCard";
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
            Xem tat ca
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {eventData.map((event) => (
          <TicketCard key={event.id} {...event} />
        ))}
      </motion.div>
    </section>
  );
}
