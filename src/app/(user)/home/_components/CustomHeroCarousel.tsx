'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Ticket } from 'lucide-react';
import { Event } from '@/utils/type';

interface CustomHeroCarouselProps {
    events: Event[];
}

export default function CustomHeroCarousel({ events }: CustomHeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            scale: 1.1,
            opacity: 0,
            zIndex: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            scale: 1,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            scale: 1.1,
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + events.length) % events.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 4000);
        return () => clearInterval(timer);
    }, [currentIndex, events.length]);

    if (!events || events.length === 0) return null;

    const item = events[currentIndex];

    return (
        <div className="relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl bg-black group isolate">
            {/* Main Carousel Track */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 200, damping: 30 },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.6 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full will-change-transform"
                >
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-[2000ms] ease-out brightness-75"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 mix-blend-multiply opacity-60" />
                </motion.div>
            </AnimatePresence>

            {/* Floating Content Card - Premium Look */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
                <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-3xl shadow-2xl overflow-hidden relative max-w-3xl mx-auto"
                >
                    {/* Glass Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-primary/20 backdrop-blur-sm">
                                    {item.category || "Featured"}
                                </span>
                                {item.price && (
                                    <span className="flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-sm">
                                        <Ticket className="w-3 h-3" />
                                        {item.price}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight line-clamp-2 drop-shadow-lg">
                                {item.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium pt-1">
                                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{new Date(item.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                    <MapPin className="w-4 h-4 text-pink-500" />
                                    <span className="truncate max-w-[200px]">{item.location}</span>
                                </div>
                            </div>
                        </div>

                        <Button className="shrink-0 h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105 active:scale-95 text-base w-full md:w-auto">
                            Đặt Vé Ngay
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Buttons - Hidden by default, show on hover */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 h-12 w-12 hover:scale-110 transition-all"
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 h-12 w-12 hover:scale-110 transition-all"
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Progress/Pagination Indicators */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-1.5 p-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                {events.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
