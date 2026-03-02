"use client";

import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/event";
import Link from "next/link";
import { motion } from "framer-motion";

// Reusing avatars from api/dicebear or local images
const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark"
];

interface MonthOverviewProps {
    events: Event[];
}

export const MonthOverview = ({ events }: MonthOverviewProps) => {
    // Select specific events for the grid (avoiding the first one if it's used in Hero)
    // We'll use index 1, 2, 3, 4 for the 4 small cards
    const highlightEvents = events.slice(1, 5);

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] uppercase">
                        More to <br />
                        <span className="text-slate-400">Discover</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.15 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {highlightEvents.map((event) => (
                        <motion.div
                            key={event.id}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95, y: 40 },
                                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="h-[450px] lg:h-[550px] w-full"
                        >
                            <Link href={`/events/${event.id}`} className="block relative w-full h-full rounded-[2.5rem] overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                                <Image
                                    src={event.thumbnailUrl || event.bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070'}
                                    alt={event.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                                            {event.category?.name || "Event"}
                                        </span>
                                        <h3 className="text-2xl lg:text-3xl font-black text-white mb-2 leading-[1.1] line-clamp-3">
                                            {event.name}
                                        </h3>

                                        {/* Reveal on hover details */}
                                        <div className="flex flex-col gap-3 mt-6 text-slate-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                    <Clock className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="line-clamp-1">{event.locations?.[0]?.name || "Online / TBA"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
