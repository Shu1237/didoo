'use client';

import Image from 'next/image';
import { Calendar, MapPin, Share2, Heart, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/utils/type';
import { motion, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DetailEventProps {
  event: Event;
}

export default function HeroSection({ event }: DetailEventProps) {
  const eventDate = new Date(event.date);
  const isValidDate = !isNaN(eventDate.getTime());
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#050505]">
      {/* Background Layer: Grainy Gradient + Ambient Light */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT CONTENT: Content & Narrative */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                  Verified Luxury Experience
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                {event.title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-primary block" : "block"}>
                    {word}
                  </span>
                ))}
              </h1>

              <p className="text-xl text-white/50 max-w-xl leading-relaxed font-light">
                {event.description || "An immersive journey into the future of digital art and high-tech innovation. Join an elite circle of creators and visionaries."}
              </p>

              {/* Data Strip */}
              <div className="flex flex-wrap gap-10 py-8 border-y border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Timeline</p>
                  <p className="text-xl font-medium text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {isValidDate ? format(eventDate, "dd MMMM, yyyy", { locale: vi }) : event.date}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Venue</p>
                  <p className="text-xl font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Action Group */}
              <div className="flex flex-wrap gap-5 pt-4">
                <Button className="group relative h-16 px-10 overflow-hidden rounded-full bg-primary text-black font-bold text-lg transition-all hover:pr-14">
                  <span className="relative z-10 uppercase tracking-tight">Reserve Access</span>
                  <ArrowUpRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
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

          {/* RIGHT CONTENT: Visual Showcase */}
          <motion.div
            style={{ y: y1 }}
            className="lg:col-span-5 order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden group">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />

              {/* Floating Price Tag */}
              <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Entry Value</p>
                    <p className="text-3xl font-bold text-white tracking-tighter">{event.price}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-primary/30 rounded-tr-[40px]" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-white/20 rounded-bl-[40px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}