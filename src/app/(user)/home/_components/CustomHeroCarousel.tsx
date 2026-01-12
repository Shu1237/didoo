'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { MockImage } from '@/utils/mock';

export default function CustomHeroCarousel() {
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
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + MockImage.length) % MockImage.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const item = MockImage[currentIndex];

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
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-[2000ms] ease-out"
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
                    className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl overflow-hidden relative"
                >
                    {/* Glass Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider mb-2">
                                <span className="bg-primary/20 px-2 py-0.5 rounded text-primary-foreground border border-primary/20">Featured</span>
                                <span>•</span>
                                <span>Upcoming Event</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-1">{item.title}</h2>
                            <div className="flex items-center gap-4 text-white/70 text-sm pt-1">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Dec 12, 2025</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Central City</span>
                                </div>
                            </div>
                        </div>

                        <Button className="shrink-0 rounded-xl font-semibold shadow-lg shadow-primary/20 bg-white text-black hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
                            Book Ticket
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Buttons - Hidden by default, show on hover */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 h-10 w-10 hover:scale-110 transition-all"
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 h-10 w-10 hover:scale-110 transition-all"
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Progress/Pagination Indicators */}
            <div className="absolute top-6 right-6 z-20 flex gap-1.5 p-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                {MockImage.map((_, idx) => (
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
