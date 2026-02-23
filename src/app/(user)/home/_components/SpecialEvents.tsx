'use client';

import { Event } from "@/types/event";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SpecialEventsProps {
    events: Event[];
}

export const SpecialEvents = ({ events }: SpecialEventsProps) => {
    // Take first 4 events for the grid
    const gridEvents = events.slice(0, 4);

    return (
        <section className="py-20 container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase leading-tight mb-4">
                    DAYS TO UP LEVEL & FALL BACK <br />
                    IN LOVE WITH DESIGN
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gridEvents.map((event, idx) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                    >
                        <Link href={`/events/${event.id}`} className="block h-full w-full">
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase leading-none mb-2 drop-shadow-md">
                                        {event.name.split(' ').slice(0, 3).join(' ')} <br />
                                        <span className="text-white">{event.name.split(' ').slice(3).join(' ')}</span>
                                    </h3>
                                    <p className="text-white/80 text-xs line-clamp-2 mt-2 font-medium drop-shadow">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/20 pt-4">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                                        {new Date(event.startTime).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                    </p>
                                    <ArrowUpRight className="w-5 h-5 text-white group-hover:rotate-45 transition-transform drop-shadow" />
                                </div>
                            </div>

                            {/* Background Image - Clean */}
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                                <Image
                                    src={event.thumbnailUrl || event.bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop'}
                                    alt={event.name}
                                    fill
                                    className="object-cover"
                                />
                                {/* Gradient to ensure text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                {/* Optional Button if needed */}
            </div>
        </section>
    );
};
