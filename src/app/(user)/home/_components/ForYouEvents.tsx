'use client';

import { Category, Event } from "@/utils/type";
import EventCard from "@/components/ui/CardEvent";
import { Trophy } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ForYouEventsProps {
    events: Event[];
    categories: Category[];
}

export const ForYouEvents = ({ events, categories }: ForYouEventsProps) => {
    return (
        <section className="py-12">
            <SectionHeader
                title="PICKED FOR YOU"
                subtitle="Based on your interests."
                icon={Trophy}
                variant="purple"
            />

            <Tabs defaultValue="Art" className="w-full">
                <TabsList className="bg-background/50 border border-white/10 p-1 rounded-full h-auto mb-8 flex flex-wrap justify-start">
                    {categories.map(cat => (
                        <TabsTrigger
                            key={cat.id}
                            value={cat.name}
                            className="rounded-full px-6 py-2.5 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
                        >
                            {cat.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {categories.map(cat => (
                    <TabsContent key={cat.id} value={cat.name} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        {/* Using Carousel for tabs content as well */}
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 pb-4">
                                {events.filter(e => e.category === cat.name).map(event => (
                                    <CarouselItem key={event.id} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-auto">
                                        <div className="h-full">
                                            <EventCard {...event} />
                                        </div>
                                    </CarouselItem>
                                ))}
                                {events.filter(e => e.category === cat.name).length === 0 && (
                                    <CarouselItem className="pl-4 basis-full">
                                        <div className="h-40 flex items-center justify-center text-muted-foreground border border-dashed rounded-xl w-full">
                                            No events found in this category.
                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            {
                                events.filter(e => e.category === cat.name).length > 0 && (
                                    <div className="hidden md:block">
                                        <CarouselPrevious className="-left-4 h-10 w-10 border-2" />
                                        <CarouselNext className="-right-4 h-10 w-10 border-2" />
                                    </div>
                                )
                            }
                        </Carousel>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
};
