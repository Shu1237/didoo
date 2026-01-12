'use client';

import { EVENTS } from "@/utils/mock";
import SearchFilter from "../home/_components/SearchFilter";
import EventsHero from "./_components/EventsHero";
import EventsGrid from "./_components/EventsGrid";
import { motion } from "framer-motion";
import { TrendingUp, Music, CalendarDays, Zap, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
    // categorizing events for display
    const featuredEvents = EVENTS.slice(0, 8); // Show more for grid
    const upcomingEvents = EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 4);
    const musicEvents = EVENTS.filter(e => e.category === 'Music');

    // Demo categories for "Attention Feature"
    const categories = [
        { name: "Tất cả", icon: <LayoutGrid className="w-4 h-4" /> },
        { name: "Âm nhạc", icon: <Music className="w-4 h-4" /> },
        { name: "Workshop", icon: <Zap className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-background pb-20">

            {/* 1. Hero Component */}
            <EventsHero />

            {/* 2. Search Filter (Overlapping Hero) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-20"
            >
                <SearchFilter />
            </motion.div>

            {/* 3. Category Quick Links - Attention Feature */}
            <div className="container mx-auto px-4 mt-12 mb-8">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat, idx) => (
                        <Button
                            key={idx}
                            variant="outline"
                            className="rounded-full h-10 px-6 border-2 hover:border-primary hover:bg-primary/5 transition-all text-base font-medium"
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* 4. Event Grid Sections */}
            <div className="container mx-auto px-4 space-y-20">
                {/* Section: Trending */}
                <EventsGrid
                    title="Nổi bật nhất tuần"
                    icon={<TrendingUp className="w-6 h-6" />}
                    description="Những sự kiện đang được quan tâm nhiều nhất bởi cộng đồng."
                    eventData={featuredEvents}
                />

                {/* Section: Upcoming */}
                <EventsGrid
                    title="Sắp diễn ra"
                    icon={<CalendarDays className="w-6 h-6" />}
                    description="Đừng bỏ lỡ những sự kiện sắp bắt đầu trong vài ngày tới."
                    eventData={upcomingEvents}
                />

                {/* Section: Music */}
                {musicEvents.length > 0 && (
                    <EventsGrid
                        title="Vũ trụ Âm nhạc"
                        icon={<Music className="w-6 h-6" />}
                        eventData={musicEvents}
                    />
                )}
            </div>
        </div>
    )
}
