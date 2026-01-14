'use client';

import EventCard from "@/components/ui/CardEvent";
import { Event } from "@/utils/type";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface EventsGridProps {
    title: string;
    icon?: React.ReactNode;
    eventData: Event[];
    description?: string;
    viewAllLink?: string;
}

export default function EventsGrid({ title, icon, eventData, description, viewAllLink = "#" }: EventsGridProps) {
    if (!eventData || eventData.length === 0) return null;

    return (
        <section className="w-full py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {icon && <div className="text-primary">{icon}</div>}
                        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            {title}
                        </h2>
                    </div>
                    {description && (
                        <p className="text-muted-foreground max-w-2xl">{description}</p>
                    )}
                </div>

                <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/10 group" asChild>
                    <a href={viewAllLink}>
                        Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </Button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                {eventData.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="h-full">
                            <EventCard {...event} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-8 flex md:hidden justify-center">
                <Button variant="outline" className="w-full max-w-xs gap-2" asChild>
                    <a href={viewAllLink}>
                        Xem tất cả {title}
                    </a>
                </Button>
            </div>
        </section>
    );
}
