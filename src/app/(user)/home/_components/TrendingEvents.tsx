'use client';

import EventCard from "@/components/ui/CardEvent";
import { Flame } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Event } from "@/utils/type";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface TrendingEventsProps {
    events: Event[];
}

export const TrendingEvents = ({ events }: TrendingEventsProps) => {
    // Mock sort by date or "popularity" - using passed props
    const trending = events.slice(0, 10);
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    return (
        <section className="py-12">
            <SectionHeader
                title="TRENDING TOP 10"
                subtitle="The most popular activities right now."
                icon={Flame}
                variant="danger"
            />
            {/* Using Shadcn Carousel */}
            <Carousel
                plugins={events.length > 4 ? [plugin.current] : []}
                opts={{
                    align: "start",
                    loop: events.length > 4,
                }}
                className="w-full"
            >
                <CarouselContent className="ml-4 pb-8">
                    {trending.map((event, idx) => (
                        <CarouselItem key={event.id} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <div className="relative h-full pt-8 pl-6">
                                {/* Rank Number */}
                                <span
                                    className="absolute -top-1 -left-0 text-[8rem] font-black z-20 leading-none select-none pointer-events-none opacity-50 dark:opacity-100"
                                    style={{
                                        WebkitTextStroke: '2px currentColor',
                                        color: 'transparent',
                                        fontFamily: 'Impact, sans-serif'
                                    }}
                                >
                                    <span className="text-foreground/20 dark:text-white/50">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </span>
                                <div className="relative z-10 h-full">
                                    <EventCard {...event} />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {
                    trending.length > 4 && (
                        <>
                            <CarouselPrevious className="left-[-1rem] h-12 w-12 border-2 border-primary/20 bg-background/80 hover:bg-background hover:scale-110 transition-all" />
                            <CarouselNext className="right-[-1rem] h-12 w-12 border-2 border-primary/20 bg-background/80 hover:bg-background hover:scale-110 transition-all" />
                        </>
                    )
                }

            </Carousel>
        </section>
    );
};
