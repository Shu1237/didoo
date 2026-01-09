'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import CustomHeroCarousel from './CustomHeroCarousel';


export default function HeroSection() {

    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-background pt-20 pb-32">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-2000" />
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col gap-12 items-center pt-10">

                {/* Hero Image/Visuals - Carousel on Top */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full max-w-5xl h-[400px] md:h-[500px] lg:h-[600px]"
                >
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-accent/20 rounded-[3rem] rotate-3 blur-3xl" />
                    <CustomHeroCarousel />
                </motion.div>

                {/* Text Content - Below Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-center space-y-8 max-w-4xl mx-auto"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/20 shadow-sm"
                        >
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm font-semibold text-foreground/80">Discover the extraordinary</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                            Find Your Next <span className="text-gradient">Unforgettable</span> Experience
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Discover concerts, festivals, workshops, and more. Join the community of explorers and make memories that last a lifetime.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1">
                            Explore Events
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-2 hover:bg-accent/5">
                            Create Event <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                    {/* Stats / Review Section */}
                    <div className="pt-8 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-muted-foreground border-t border-border/50 mt-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">500+</p>
                            <p className="text-sm">Events Hosted</p>
                        </div>
                        <div className="w-px h-10 bg-border hidden sm:block" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">10k+</p>
                            <p className="text-sm">Active Users</p>
                        </div>
                        <div className="w-px h-10 bg-border hidden sm:block" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">50+</p>
                            <p className="text-sm">Cities Covered</p>
                        </div>
                        <div className="w-px h-10 bg-border hidden sm:block" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">4.9/5</p>
                            <p className="text-sm">User Reviews</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}