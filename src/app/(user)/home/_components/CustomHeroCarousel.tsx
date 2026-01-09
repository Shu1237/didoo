'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MockImage } from '@/utils/mock';

export default function CustomHeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,

        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
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
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const imageIndex = currentIndex;
    const item = MockImage[imageIndex];

    return (
        <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white/20 bg-background group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 100, damping: 20, duration: 2 }, // Softer spring
                        opacity: { duration: 1.5, ease: "easeInOut" },
                        scale: { duration: 1.5, ease: "easeInOut" }
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
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl max-w-xl backdrop-blur-md bg-black/40 border-white/10"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-3xl shrink-0 backdrop-blur-sm shadow-inner overflow-hidden">
                            {/* Placeholder icons based on index logic or data if available */}
                            {currentIndex % 4 === 0 ? '🎵' : currentIndex % 4 === 1 ? '🎨' : currentIndex % 4 === 2 ? '💻' : '🍔'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-2xl text-white truncate drop-shadow-md">{item.title}</h3>
                            <p className="text-white/80 text-sm mt-1 font-medium">Coming soon / Live Event</p>
                        </div>
                        <Button size="sm" className="hidden sm:inline-flex rounded-full bg-white text-black hover:bg-white/90 font-semibold px-6 shadow-lg shadow-white/10">
                            Join
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Custom Navigation */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm h-12 w-12"
                    onClick={() => paginate(-1)}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm h-12 w-12"
                    onClick={() => paginate(1)}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 right-8 z-20 flex gap-2">
                {MockImage.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}
