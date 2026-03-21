'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

interface GroupsSectionProps {
  events: Event[];
}

// Sub-component for individual row to handle its own scroll parallax
function EventRow({ event, alignRight }: { event: Event, alignRight: boolean }) {
  const imageUrl = event.thumbnailUrl || event.bannerUrl || null;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Parallax effect for the background text
  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className={`flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto py-16 md:py-24 items-stretch relative gap-8 lg:gap-16 px-6 ${alignRight ? 'lg:flex-row-reverse' : ''}`}>

      {/* Background Watermark Text - visible on desktop */}
      <motion.div
        style={{ y: yBg }}
        className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 ${alignRight ? 'left-10' : 'right-10'} w-1/2 pointer-events-none overflow-hidden`}
      >
        <h2 className="text-[120px] lg:text-[180px] xl:text-[220px] font-black italic text-zinc-800/20 leading-none whitespace-nowrap select-none overflow-hidden text-clip tracking-tighter mix-blend-screen"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)', fontFamily: "var(--font-playfair), serif" }}>
          {event.name}
        </h2>
      </motion.div>

      {/* Poster Column - Left side */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/2 flex items-start lg:items-center relative z-10"
      >
        <div className="w-full aspect-video sm:aspect-[16/9] lg:aspect-[4/3] relative bg-zinc-900 overflow-hidden group border border-zinc-800 rounded-sm drop-shadow-lg">
          {imageUrl ? (
            <Image src={imageUrl} alt={event.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </motion.div>

      {/* Text Content Column - Right side, vertically centered */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 py-4 lg:py-8"
      >
        <div className="overflow-hidden p-1 -m-1">
          <motion.h3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl lg:text-5xl italic mb-4 text-white uppercase tracking-widest drop-shadow-md"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {event.name}
          </motion.h3>
        </div>
        <div className="overflow-hidden p-1 -m-1">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-[0.2em]"
          >
            {event.organizer?.name || 'Đa Dạng Công Ty'}
          </motion.p>
        </div>
        <div className="overflow-hidden p-1 -m-1 text-left w-full">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-500 mb-8 leading-relaxed text-base font-light italic line-clamp-3 max-w-xl"
          >
            {event.description || event.subtitle || "Chưa có thông tin mô tả cho sự kiện này."}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href={`/events/${event.slug || event.id}`}>
            <Button variant="outline" className="w-fit rounded-none border-zinc-600 text-zinc-300 hover:bg-white hover:text-black transition-all duration-300 relative overflow-hidden group bg-transparent px-8 py-5 text-xs tracking-widest uppercase">
              Xem thêm
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function GroupsSection({ events }: GroupsSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="w-full flex flex-col bg-[#0a0a0a] py-12 md:py-24 overflow-hidden">
      <div className="flex flex-col gap-0 md:gap-32 lg:gap-0">
        {events.map((event, index) => (
          <EventRow key={event.id} event={event} alignRight={index % 2 !== 0} />
        ))}
      </div>

      <div className="flex justify-center py-20 relative z-20">
        <Link href="/events">
          <Button variant="outline" className="rounded-full border-zinc-600 text-zinc-300 hover:bg-white hover:text-[#0a0a0a] transition-all px-8 py-6 text-sm tracking-widest uppercase bg-transparent">
            Xem thêm sự kiện
          </Button>
        </Link>
      </div>
    </section>
  );
}
