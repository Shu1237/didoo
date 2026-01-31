"use client";

import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { EVENTS } from "@/utils/mock";
import Link from "next/link";

// Reusing avatars from api/dicebear or local images
const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark"
];

export const MonthOverview = () => {
    // Select specific events for the grid (avoiding the first one if it's used in Hero)
    // We'll use index 1, 2, 3, 4 for the 4 small cards
    const highlightEvents = EVENTS.slice(1, 5);

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        Discover Events <br />
                        <span className="text-slate-500">Beyond Expectations</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[380px]">

                    {/* 1. Explore Events (Large Blue Card) - Span 2 Cols */}
                    <div className="md:col-span-2 bg-[#bfdbfe] rounded-[2.5rem] p-10 relative overflow-hidden group flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                        {/* Abstract BG Decoration */}
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-3xl font-bold text-slate-900 leading-tight max-w-[80%]">
                                    Explore Events <br /> Around the World
                                </h3>
                                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-transform shadow-sm">
                                    <ArrowUpRight className="w-5 h-5 text-slate-900" />
                                </button>
                            </div>
                            <p className="text-slate-700 font-medium max-w-xs leading-relaxed">
                                Global adventure and explore a diverse array of events happening around the world.
                            </p>
                        </div>

                        {/* Avatars */}
                        <div className="flex -space-x-3 mt-auto">
                            {AVATARS.map((avatar, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#bfdbfe] overflow-hidden bg-white shadow-sm">
                                    <Image src={avatar} alt="User" width={48} height={48} className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Small Cards Mapped from Data */}
                    {highlightEvents.map((event) => (
                        <Link href={`/events/${event.id}`} key={event.id} className="bg-white rounded-[2.5rem] p-4 flex flex-col hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                            <div className="relative h-48 w-full rounded-[2rem] overflow-hidden mb-4">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase text-slate-900 shadow-sm">
                                    {event.category}
                                </div>
                            </div>
                            <div className="px-2 flex-1 flex flex-col">
                                <h4 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1" title={event.title}>
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-4 line-clamp-1">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {event.location}
                                </div>
                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="text-xs font-semibold text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[10px] opacity-70">
                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">{event.price}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* 6. Local Events (Large Peach Card) - Span 2 Cols */}
                    <div className="md:col-span-2 bg-[#ffedd5] rounded-[2.5rem] p-10 relative overflow-hidden group flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                        {/* Abstract BG Decoration */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200/50 rounded-full blur-3xl pointer-events-none" />

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-3xl font-bold text-slate-900 leading-tight max-w-[80%]">
                                    Local Events Taking <br /> Place Near You
                                </h3>
                                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-transform shadow-sm">
                                    <ArrowUpRight className="w-5 h-5 text-slate-900" />
                                </button>
                            </div>
                            <p className="text-slate-700 font-medium max-w-xs leading-relaxed">
                                Stay connected to the buzz around you with our curated list of nearby events.
                            </p>
                        </div>

                        {/* Avatars */}
                        <div className="flex -space-x-3 mt-auto justify-end">
                            {AVATARS.map((avatar, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#ffedd5] overflow-hidden bg-white shadow-sm">
                                    <Image src={avatar} alt="User" width={48} height={48} className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
