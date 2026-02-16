'use client';

import { Event } from "../../../../types/base";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Instagram } from "lucide-react";

import Autoplay from "embla-carousel-autoplay";

interface TrendingEventsProps {
    events: Event[];
}

export const TrendingEvents = ({ events }: TrendingEventsProps) => {
    // Treat events as "Speakers" or "Keynotes" for this layout
    // In a real app, this would receive a `speakers` prop. 
    // We will use `event.organizer` and event images proxying as speakers.

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase leading-tight max-w-xl">
                        Featuring Keynotes From <br />
                        Top Design Leaders & Makers
                    </h2>
                    <div className="hidden md:flex gap-4">
                        {/* Arrows will be custom placed or just use carousel default */}
                    </div>
                </div>

                <div className="w-full">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 2000,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {events.map((event, idx) => (
                                <CarouselItem key={event.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                                    <div className="relative group">
                                        {/* Image Container */}
                                        <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-gray-200 mb-4 shadow-sm group-hover:shadow-md transition-all">
                                            <Image
                                                src={event.organizer?.avatar || event.image} // Use organizer avatar if possible, else event image
                                                alt={event.organizer?.name || "Speaker"}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            {/* Social Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                                <Button size="icon" variant="ghost" className="text-white hover:bg-white hover:text-black rounded-full bg-white/20 backdrop-blur-sm">
                                                    <Twitter className="w-5 h-5" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-white hover:bg-white hover:text-black rounded-full bg-white/20 backdrop-blur-sm">
                                                    <Linkedin className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="pt-2">
                                            <h3 className="text-slate-900 font-bold uppercase text-xl truncate">
                                                {event.organizer?.name || "Speaker Name"}
                                            </h3>
                                            <p className="text-slate-500 text-sm font-bold uppercase truncate mb-3">
                                                {event.category} Leader
                                            </p>

                                            <Button variant="outline" className="h-10 px-6 rounded-full border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors">
                                                View Bio
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex justify-end gap-2 mt-8">
                            <CarouselPrevious className="static translate-y-0 h-12 w-12 border-slate-200 bg-white text-slate-900 hover:bg-slate-900 hover:text-white rounded-full transition-colors" />
                            <CarouselNext className="static translate-y-0 h-12 w-12 border-slate-200 bg-white text-slate-900 hover:bg-slate-900 hover:text-white rounded-full transition-colors" />
                        </div>
                    </Carousel>
                </div>

            </div>
        </section>
    );
};
