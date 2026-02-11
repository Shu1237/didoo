'use client';

import TicketCard from "@/components/ui/TicketCard";
import { Event } from "@/utils/type";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface EventsGridProps {
    title: string;
    icon?: React.ReactNode;
    eventData: Event[];
    description?: string;
    viewAllLink?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

export default function EventsGrid({ title, icon, eventData, description, viewAllLink = "#" }: EventsGridProps) {
    if (!eventData || eventData.length === 0) return null;

    return (
        <section className="w-full py-32 relative bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 border-b border-white/10 pb-16">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                                    Curated Selection
                                </span>
                            </div>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85]">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? "text-primary block" : "block"}>
                                    {word}
                                </span>
                            ))}
                        </h2>
                        {description && (
                            <p className="text-white/40 max-w-xl font-medium text-xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <Button variant="outline" className="h-20 px-10 rounded-full border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-500 group text-sm font-bold uppercase tracking-widest" asChild>
                        <a href={viewAllLink}>
                            Full Archive <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </a>
                    </Button>
                </div>

                {/* Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {eventData.map((event, index) => (
                        <motion.div
                            key={event.id}
                            variants={itemVariants}
                            className="relative h-full"
                        >
                            <TicketCard {...event} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
