'use client';

import { motion } from 'framer-motion';
import { Event } from '@/types/event';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

interface HeroTextSectionProps {
  event: Event | null;
}

export default function HeroTextSection({ event }: HeroTextSectionProps) {
  const imageUrl = event?.bannerUrl || event?.thumbnailUrl || null;

  return (
    <section className="pt-32 pb-16 w-full flex flex-col items-center justify-center text-center relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle background decoration to mimic wireframe pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:20px_20px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[100px] tracking-tighter leading-[1.1] mb-8 text-white drop-shadow-sm font-serif italic"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Lễ Hội Âm Nhạc
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-zinc-400 max-w-2xl text-lg md:text-xl font-light tracking-wide leading-relaxed italic"
        >
          Đắm chìm trong không gian âm nhạc
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1800px] mx-auto mt-16 md:mt-24 px-4 md:px-8 relative"
      >
        <div className="w-full aspect-[4/3] md:aspect-video lg:aspect-[21/9] bg-zinc-900 rounded-2xl border border-zinc-800/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden group">
          {imageUrl ? (
            <>
              <Image src={imageUrl} alt={event?.name || 'Event hero'} fill className="object-cover opacity-80 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100" />
              
              {/* Dark gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/90 pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />

              {/* Corner Texts overlaying the image */}
              <div className="absolute inset-6 md:inset-10 lg:inset-12 pointer-events-none flex flex-col justify-between overflow-hidden">
                
                {/* Top Row: Title (Left) and Organizer (Right) */}
                <div className="flex justify-between items-start">
                  <div className="overflow-hidden p-2 -m-2">
                    <motion.h2 
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="text-4xl md:text-6xl lg:text-[80px] leading-none font-serif text-white tracking-widest uppercase drop-shadow-lg italic"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {event?.name}
                    </motion.h2>
                  </div>
                  
                  {event?.organizer?.name && (
                    <div className="hidden md:flex flex-col items-end text-right overflow-hidden p-2 -m-2">
                      <motion.span 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="text-zinc-200 text-sm tracking-[0.2em] uppercase font-bold"
                      >
                        {event.organizer.name}
                      </motion.span>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Description (Left) and Location/Date (Right) */}
                <div className="flex justify-between items-end">
                  <div className="hidden md:block max-w-md text-zinc-300 text-xs md:text-sm leading-relaxed tracking-wide mix-blend-screen opacity-80 overflow-hidden p-2 -m-2">
                    <motion.p 
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="line-clamp-3"
                    >
                      {event?.description || 'Truy cập để xem thêm thông tin chi tiết.'}
                    </motion.p>
                  </div>
                  
                  {(event?.locations?.[0]?.province || event?.startTime) && (
                    <div className="text-right flex-shrink-0 ml-auto overflow-hidden p-2 -m-2">
                      <motion.p 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white text-lg md:text-2xl tracking-widest drop-shadow-md" 
                      >
                        {[event?.locations?.[0]?.province, event?.startTime ? format(parseISO(event.startTime), 'dd/MM/yyyy') : null].filter(Boolean).join(' - ')}
                      </motion.p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-zinc-900" />
              <svg className="w-12 h-12 text-zinc-700 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}

