'use client';

import Image from 'next/image';
import { Calendar, MapPin, Share2, Heart, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import { motion, useScroll, useTransform } from 'framer-motion';
import { format, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TicketType } from '@/types/ticketType';

interface DetailEventProps {
  event: Event;
  ticketTypes: TicketType[];
}

export default function HeroSection({ event, ticketTypes }: DetailEventProps) {
  const eventDate = new Date(event.startTime);
  const isValidDate = event.startTime && isValid(eventDate);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  const minPrice = ticketTypes.length > 0 ? Math.min(...ticketTypes.map(t => t.price)) : 0;
  const maxPrice = ticketTypes.length > 0 ? Math.max(...ticketTypes.map(t => t.price)) : 0;

  const priceDisplay = ticketTypes.length === 0
    ? "Miễn phí"
    : minPrice === maxPrice
      ? `${minPrice.toLocaleString('vi-VN')} VND`
      : `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#050505]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-primary/30 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {event.category?.name || "Sự kiện đặc biệt"}
                </span>
              </div>

              {/* SỬA QUAN TRỌNG: 
                  - leading-[1.2] thay vì [0.95] để dấu không chạm dòng dưới
                  - tracking-normal thay vì tighter để các chữ không dính nhau 
              */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.2] tracking-normal uppercase transition-all duration-300">
                {event.name}
              </h1>

              <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-medium">
                {event.subtitle || event.description}
              </p>

              {/* Data Strip */}
              <div className="flex flex-wrap gap-10 py-8 border-y border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Thời gian</p>
                  <p className="text-xl font-medium text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {isValidDate ? format(eventDate, "dd MMMM, yyyy", { locale: vi }) : "Sắp công bố"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Địa điểm</p>
                  <p className="text-xl font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.locations?.[0]?.name || "Trực tuyến / TBA"}
                  </p>
                </div>
              </div>

              {/* Action Group */}
              <div className="flex flex-wrap gap-5 pt-4">
                <Button className="group relative h-16 px-10 overflow-hidden rounded-full bg-primary text-black font-bold text-lg transition-all hover:bg-primary/90">
                  <span className="relative z-10 uppercase">Đặt vé ngay</span>
                  <ArrowUpRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>

                <div className="flex gap-3">
                  <button className="h-16 w-16 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="h-16 w-16 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT CONTENT */}
          <motion.div
            style={{ y: y1 }}
            className="lg:col-span-5 order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden group border border-white/10">
              <Image
                src={event.thumbnailUrl || event.bannerUrl || ''}
                alt={event.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

              {/* Price Tag */}
              <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Giá vé từ</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{priceDisplay}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}