'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

import { Event } from "@/utils/type";
import { SectionHeader } from "./SectionHeader";

interface WeekendEventsProps {
    events: Event[];
}

export const WeekendEvents = ({ events }: WeekendEventsProps) => {

    const weekendEvents = events.slice(0, 5);

    return (
        <section className="py-12">
            <SectionHeader
                title="THIS WEEKEND"
                icon={Calendar}
                variant="primary"
            />
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-border">
                    {weekendEvents.map((event, idx) => (
                        <div key={event.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center hover:bg-muted/50 transition-colors group cursor-pointer">
                            {/* Time Column */}
                            <div className="flex flex-col items-center justify-center w-24 shrink-0 text-center scale-100 group-hover:scale-110 transition-transform">
                                <span className="text-sm font-bold text-muted-foreground uppercase">
                                    {idx % 2 === 0 ? 'Thứ 7' : 'Chủ Nhật'}
                                </span>
                                <span className="text-2xl font-black text-foreground">
                                    {new Date(event.date).getDate()}
                                </span>
                                <span className="text-xs text-primary font-bold">
                                    {new Date(event.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    width={200}
                                    height={150}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
                                <h4 className="text-xl font-bold truncate group-hover:text-primary transition-colors">{event.title}</h4>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                                    <Badge variant="outline" className="border-primary/20 text-primary">{event.category}</Badge>
                                </div>
                            </div>

                            {/* Action */}
                            <Button className="shrink-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" variant="secondary">Chi tiết</Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
