'use client';

import Image from 'next/image';
import { Calendar, MapPin, Share2, Heart, Ticket, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/utils/type';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DetailEventProps {
  event: Event;
}

export default function HeroSection({ event }: DetailEventProps) {
  const eventDate = new Date(event.date);
  const isValidDate = !isNaN(eventDate.getTime());

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden">

      {/* 1. Dynamic Background Ambience */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Blurry Image Background */}
        <div className="absolute inset-0">
          <Image
            src={event.image}
            alt="Background Ambience"
            fill
            className="object-cover opacity-[0.15] dark:opacity-[0.2] blur-[80px] scale-110"
            priority
          />
        </div>
        {/* Gradient Overlay for better text readability and fading */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group relative bg-white/60 dark:bg-card/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 lg:p-12 shadow-2xl overflow-hidden"
        >
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* LEFT: Event Image Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[4/5] md:aspect-[3/3.5] lg:aspect-[3.5/4.5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                  priority
                />

                {/* Status/Category Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20 shadow-lg">
                    {event.category}
                  </span>
                </div>
                {/* Price Tag Overlay (Mobile/Visual) */}
                <div className="absolute bottom-4 right-4 lg:hidden">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                    {event.price === '0' || event.price === 'Free' ? 'Miễn phí' : event.price}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Event Details */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">

              {/* Header Info */}
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] text-balance"
                >
                  {event.title}
                </motion.h1>

                {/* Metadata Rows */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4 text-base"
                >
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <Calendar className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="text-xs text-primary/70 uppercase font-bold tracking-wider">Ngày tổ chức</span>
                      <span className="font-semibold">
                        {isValidDate ? format(eventDate, "EEEE, dd/MM/yyyy", { locale: vi }) : event.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary/5 text-secondary border border-secondary/10">
                    <MapPin className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="text-xs text-secondary/70 uppercase font-bold tracking-wider">Địa điểm</span>
                      <span className="font-semibold">{event.location}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Price & Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="hidden lg:flex items-baseline gap-2">
                  <span className="text-lg text-muted-foreground font-medium">Giá vé từ:</span>
                  <span className="text-3xl font-bold text-primary">
                    {event.price === '0' || event.price === 'Free' ? 'Miễn phí' : event.price}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl line-clamp-3">
                  {event.description}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-black/5 dark:border-white/5"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Mua vé ngay</span>
                </Button>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-6 rounded-2xl border-2 hover:bg-accent/5 hover:text-accent hover:border-accent/30 transition-all flex items-center gap-2 text-base font-semibold"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="hidden sm:inline">Quan tâm</span>
                  </Button>

                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-14 w-14 rounded-2xl border-2 border-transparent hover:border-border hover:bg-background transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
