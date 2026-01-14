'use client';

import { Event } from '@/utils/type';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Trophy, Users, Globe, Star } from 'lucide-react';
import CustomHeroCarousel from './CustomHeroCarousel';

interface HeroSectionProps {
    events: Event[];
}

export default function HeroSection({ events }: HeroSectionProps) {

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-32">


            <div className="container mx-auto px-4 relative z-10 flex flex-col gap-12 items-center">

                {/* Main Visual - Custom Carousel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    className="relative w-full max-w-[1400px] h-[450px] md:h-[600px] lg:h-[650px]"
                >
                    {/* Glow behind the carousel */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2.5rem] blur-2xl opacity-50 -z-10" />
                    <CustomHeroCarousel events={events} />
                </motion.div>

                {/* Text Content */}

            </div>
        </section>
    );
}