'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { format, parseISO } from 'date-fns';

interface ScheduleSectionProps {
  events: Event[];
}

export default function ScheduleSection({ events }: ScheduleSectionProps) {
  // Main Carousel: Image cards. align: center, looped
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    loop: true,
  });

  // Autoplay functionality using setInterval
  useEffect(() => {
    if (!emblaMainApi) return;
    const intervalId = setInterval(() => {
      emblaMainApi.scrollNext();
    }, 4500); // 4.5 seconds delay

    // Pause autoplay on user interaction
    const stopAutoplay = () => clearInterval(intervalId);
    emblaMainApi.on('pointerDown', stopAutoplay);

    return () => clearInterval(intervalId);
  }, [emblaMainApi]);

  if (!events || events.length === 0) return null;

  // Duplicate items for infinite marquee to ensure it fills the screen
  const marqueeItems = Array.from({ length: 30 }).map((_, i) => events[i % events.length]);

  return (
    <section className="py-24 w-full bg-[#0a0a0a] overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-[70px] font-serif uppercase tracking-widest text-zinc-100 flex flex-col md:flex-row mb-6 mt-16"
          >
            Lịch Trình
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full h-[1px] bg-zinc-800 my-8" 
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 italic font-light text-sm md:text-base max-w-xl leading-relaxed tracking-wider ml-auto uppercase text-right"
          >
            Khám phá lịch trình của các thần tượng yêu thích và ủng hộ họ tại một concert cực kỳ hoành tráng
          </motion.p>
        </div>

      {/* INFINITE MARQUEE (Top row) */}
      <div className="w-full relative select-none overflow-hidden mb-16 border-y border-zinc-800/50 py-6 bg-[#0a0a0a]/50 flex items-center">
        {/* Fading edges left/right to blend into the background */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex w-max items-center gap-16 md:gap-32 pl-16 md:pl-32"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {marqueeItems.map((event, index) => {
            const fallbackName = event.organizer?.name || event.name.substring(0, 15);
            return (
              <div 
                key={`marquee-${event.id}-${index}`} 
                className="flex items-center gap-4 whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                {/* Render logo if exists, else text */}
                {event.organizer?.logoUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-full overflow-hidden shrink-0 bg-white/10 flex items-center justify-center p-1 border border-zinc-700/50">
                      <Image src={event.organizer.logoUrl} alt={fallbackName} fill className="object-cover p-1" />
                    </div>
                    <span className="text-2xl md:text-3xl tracking-[0.2em] font-medium text-white uppercase italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
                      {fallbackName}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl md:text-4xl tracking-[0.3em] font-medium text-white uppercase italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    {fallbackName}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* MAIN CAROUSEL (IMAGES & SCHEDULE) */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 relative">
        <div className="overflow-hidden rounded-xl border border-zinc-800/60 drop-shadow-2xl" ref={emblaMainRef}>
          <div className="flex h-[60vh] md:h-[80vh] min-h-[500px]" style={{ touchAction: 'pan-y pinch-zoom' }}>
            {events.map((event, index) => {
              const imageUrl = event.bannerUrl || event.thumbnailUrl || null;
              
              // Parse event time for fake schedule display
              let eventDateStr = "TBA";
              let eventMonth = "UPCOMING";
              let dateDay = "XX";
              try {
                if (event.startTime) {
                  const d = parseISO(event.startTime);
                  eventDateStr = format(d, 'MMMM d, yyyy');
                  eventMonth = format(d, 'MMMM').toUpperCase();
                  dateDay = format(d, 'dd');
                }
              } catch (e) {}

              return (
                <div key={`main-${event.id}-${index}`} className="flex-[0_0_100%] min-w-0 relative w-full h-full">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={event.name} fill className="object-cover opacity-60" priority={index === 0} />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none" />
                  
                  {/* Event Title Overlap */}
                  <div className="absolute top-12 left-12 right-12 text-center pointer-events-none drop-shadow-lg opacity-40">
                    <h3 className="text-4xl md:text-6xl font-black text-white/10 tracking-[0.2em] uppercase line-clamp-1 italic" style={{ fontFamily: "var(--font-playfair), serif" }}>{event.name}</h3>
                  </div>

                  {/* SCHEDULE OVERLAY (API OR LOREM FALLBACK) */}
                  <div className="absolute inset-x-0 bottom-0 top-1/2 md:top-auto p-6 md:p-12 lg:p-16 flex flex-col justify-end pointer-events-none">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                      {(event.locations && event.locations.length > 0 ? event.locations.slice(0, 3) : [1, 2, 3]).map((loc, i) => {
                        const isDummy = typeof loc === 'number';
                        const locName = isDummy ? "Chưa rõ địa điểm" : (loc as any).name || (loc as any).address || "Sân khấu chính";
                        const locCity = isDummy ? "Thành phố" : (loc as any).province || "Sự kiện";
                        const displayDateDay = isDummy && dateDay !== "XX" ? String(parseInt(dateDay) + (i * 7)).padStart(2, '0') : dateDay;
                        const displayMonth = isDummy && i > 0 ? (i === 1 ? 'THÁNG 10' : 'THÁNG 11') : eventMonth;
                        
                        return (
                          <div key={isDummy ? `dummy-${i}` : (loc as any).id || i} className="flex flex-col">
                            <h4 className="text-2xl font-serif text-white mb-6 uppercase tracking-widest border-b border-zinc-800 pb-4">
                              {displayMonth}
                            </h4>
                            <div className="flex gap-4 md:gap-6 items-start">
                              <span className="text-4xl md:text-5xl font-serif text-zinc-300 italic">{displayDateDay}</span>
                              <div className="flex flex-col pt-1">
                                <span className="text-white font-bold text-lg">{locCity}</span>
                                <span className="text-zinc-400 text-sm mt-1 line-clamp-2">{locName}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16 w-full relative z-10 bg-[#0a0a0a]">
        <Link href="/events">
          <Button variant="outline" className="px-12 py-6 rounded-none border-zinc-600 text-zinc-300 hover:bg-white hover:text-black transition-colors text-sm tracking-widest uppercase bg-transparent italic">
            Xem tất cả lịch trình
          </Button>
        </Link>
      </div>
    </section>
  );
}
