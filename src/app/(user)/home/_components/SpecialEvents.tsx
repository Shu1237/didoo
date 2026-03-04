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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6"
            >
                <div>
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-sm">Curated Selection</span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase leading-[0.9] tracking-tighter mt-4">
                        Upcoming <br />
                        <span className="text-slate-400">Highlights</span>
                    </h2>
                </div>
                <Link href="/events" className="group flex items-center gap-2 font-bold uppercase text-sm border-b-2 border-slate-900 pb-1 hover:text-primary hover:border-primary transition-colors">
                    View All Schedule <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>

            {/* Editorial Layout: 1 Featured Left, List on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
                {/* Featured Large Item (Left) */}
                {gridEvents.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 relative group rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-slate-900 cursor-pointer"
                    >
                        <Link href={`/events/${gridEvents[0].id}`} className="block h-full w-full">
                            <Image
                                src={gridEvents[0].thumbnailUrl || gridEvents[0].bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070'}
                                alt={gridEvents[0].name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="px-4 py-2 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full">
                                        Featured
                                    </span>
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-4">
                                        {gridEvents[0].name}
                                    </h3>
                                    <div className="flex items-center gap-6 text-white/80 font-bold uppercase text-sm tracking-widest">
                                        <span>{new Date(gridEvents[0].startTime).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>{gridEvents[0].category?.name || "Event"}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* Stacked List (Right) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {gridEvents.slice(1).map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="flex-1 group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex items-center gap-6 cursor-pointer"
                        >
                            <Link href={`/events/${event.id}`} className="flex items-center gap-6 w-full h-full">
                                {/* Date Square */}
                                <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <span className="text-sm font-bold uppercase tracking-widest text-primary group-hover:text-primary/80">
                                        {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span className="text-3xl font-black leading-none mt-1">
                                        {new Date(event.startTime).toLocaleDateString('en-US', { day: '2-digit' })}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                        {event.category?.name || "Event"}
                                    </span>
                                    <h4 className="text-xl font-black text-slate-900 uppercase leading-none truncate group-hover:text-primary transition-colors">
                                        {event.name}
                                    </h4>
                                    <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed">
                                        {event.description || "Join us for an incredible experience."}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
