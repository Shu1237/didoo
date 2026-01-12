'use client';

import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "./SectionHeader";
import { Event } from "@/utils/type";
import Autoplay from "embla-carousel-autoplay"
interface SpecialEventsProps {
    events: Event[];
}

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRef } from "react";

export const SpecialEvents = ({ events }: SpecialEventsProps) => {
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )
    return (
        <section className="py-12">
            <SectionHeader
                title="FEATURED EVENTS"
                subtitle="High-profile experiences you can't miss."
                icon={Sparkles}
                variant="warning"
            />
            <Carousel
                plugins={events.length > 2 ? [plugin.current] : []}
                opts={{
                    align: "start",
                    loop: events.length > 2,
                }}

                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {events.slice(0, 3).map((event) => (
                        <CarouselItem key={event.id} className="pl-4 md:basis-1/2">
                            <div className="group relative overflow-hidden rounded-[2rem] h-[400px] md:h-[500px]">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-8 space-y-4 w-full">
                                    <Badge className="bg-primary hover:bg-primary text-white text-sm px-4 py-1">Featured</Badge>
                                    <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">{event.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-white/90 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-secondary" />
                                            {new Date(event.date).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-accent" />
                                            {event.location}
                                        </div>
                                    </div>
                                    <p className="text-white/80 line-clamp-2 md:line-clamp-none max-w-lg">{event.description}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {events.length > 2 && (
                    <>
                        <div className="hidden md:block">
                            <CarouselPrevious className="left-[-1rem] h-12 w-12 border-2 border-primary/20 bg-background/80 hover:bg-background hover:scale-110 transition-all" />
                            <CarouselNext className="right-[-1rem] h-12 w-12 border-2 border-primary/20 bg-background/80 hover:bg-background hover:scale-110 transition-all" />
                        </div>
                    </>
                )}
            </Carousel>
        </section>
    );
};
