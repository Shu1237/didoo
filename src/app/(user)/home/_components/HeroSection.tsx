'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Trophy, Users, Globe, Star } from 'lucide-react';
import CustomHeroCarousel from './CustomHeroCarousel';

export default function HeroSection() {

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-32">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Vivid Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[140px] animate-pulse delay-1000" />
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-2000" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

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
                    <CustomHeroCarousel />
                </motion.div>

                {/* Text Content */}

            </div>
        </section>
    );
}