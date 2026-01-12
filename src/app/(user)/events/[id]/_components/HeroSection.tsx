'use client';

import Image from 'next/image';
import { Calendar, MapPin, DollarSign, Share2, Heart } from 'lucide-react';
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
    <section className="relative w-full py-20 lg:py-32 overflow-hidden">
      {/* Background Ambience - Blurs the event image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={event.image}
          alt="Background"
          fill
          className="object-cover opacity-20 dark:opacity-10 blur-3xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/40" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/50 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT — Banner Image */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-semibold border border-white/20 shadow-lg">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — Event Info */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]"
                >
                  {event.title}
                </motion.h1>

                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-muted-foreground pt-2">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {isValidDate ? format(eventDate, "EEEE, dd 'tháng' MM, yyyy", { locale: vi }) : event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-secondary/5 border border-secondary/10">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <span className="font-medium text-foreground">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {event.price === '0' || event.price === 'Free' ? 'Miễn phí' : event.price}
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {/* Placeholder for description if not in Event type, or generic text */}
                  Hãy tham gia cùng chúng tôi trong sự kiện đặc biệt này. Một trải nghiệm không thể bỏ lỡ với những khoảnh khắc đáng nhớ và kết nối tuyệt vời.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/40">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex-1 sm:flex-none">
                  Mua vé ngay
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-6 rounded-2xl border-border/60 hover:bg-muted text-foreground flex gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Quan tâm</span>
                </Button>
                <Button size="lg" variant="ghost" className="h-14 w-14 rounded-2xl hover:bg-muted text-muted-foreground p-0">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
