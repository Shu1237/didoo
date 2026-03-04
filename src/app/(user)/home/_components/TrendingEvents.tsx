'use client';

import { Organizer } from "@/types/organizer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface TrendingEventsProps {
    organizers: Organizer[];
}

export const TrendingEvents = ({ organizers }: TrendingEventsProps) => {
    // If no organizers, don't show the section
    if (!organizers || organizers.length === 0) return null;

    // Duplicate organizers array to ensure seamless infinite scrolling
    const duplicatedOrganizers = [...organizers, ...organizers, ...organizers, ...organizers];

    return (
        <section className="py-24 bg-white overflow-hidden border-t border-slate-100">
            <div className="container mx-auto px-4 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm block mb-4">Curated Network</span>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase leading-[0.9] tracking-tighter">
                            Featured <br />
                            <span className="text-slate-400">Organizers</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-6 md:mt-0 max-w-sm"
                    >
                        <p className="text-slate-500 font-medium">
                            Meet the visionaries behind the most talked-about events in the industry.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Infinite CSS Marquee */}
            <div className="relative w-full flex overflow-x-hidden group">
                {/* Fade edges */}
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee flex gap-8 py-8 items-center w-max group-hover:[animation-play-state:paused] transition-all duration-300">
                    {duplicatedOrganizers.map((organizer, idx) => (
                        <div
                            key={`${organizer.id}-${idx}`}
                            className="relative w-[300px] shrink-0 group/card cursor-pointer"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:border-primary/20 group-hover/card:-translate-y-2">
                                <Image
                                    src={organizer.logoUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop'}
                                    alt={organizer.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover/card:scale-110 filter grayscale group-hover/card:grayscale-0"
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-black uppercase text-2xl tracking-tight leading-none mb-1">
                                        {organizer.name}
                                    </h3>
                                    <p className="text-slate-300 text-xs font-bold uppercase tracking-widest line-clamp-1 mb-4">
                                        {organizer.description || "Leading event curator"}
                                    </p>

                                    <Link href={`/organizers/${organizer.id}`}>
                                        <Button variant="outline" className="w-full bg-white text-black hover:bg-primary hover:text-white hover:border-primary border-none uppercase text-xs font-black tracking-widest rounded-xl transition-colors">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Duplicate for seamless loop if needed, but animate-marquee handles it by moving to -100% and repeating */}
            </div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>

        </section>
    );
};
