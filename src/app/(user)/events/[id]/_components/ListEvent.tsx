'use client';

import TicketCard from "@/components/ui/TicketCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Event } from "@/utils/type";
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface ListEventProps {
  title: string;
  eventData: Event[];
  relatedEvent?: boolean;
}

export default function ListEvent({ title, eventData, relatedEvent }: ListEventProps) {
  return (
    <div className="w-full py-24 relative overflow-hidden bg-[#050505]">
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header Section */}
        {!relatedEvent && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                  Featured Intelligence
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4 border-b border-white/10">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                  {title.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? "text-primary" : ""}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>
                <a href="/events" className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all duration-300">
                  Full Catalog
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-primary" />
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {/* Carousel Implementation */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-8 pb-16">
              {eventData.map((event, index) => (
                <CarouselItem key={event.id} className="pl-8 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <TicketCard {...event} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Minimalist Premium Controls */}
            <div className="flex justify-start gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-500 shadow-xl" />
              <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-500 shadow-xl" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
