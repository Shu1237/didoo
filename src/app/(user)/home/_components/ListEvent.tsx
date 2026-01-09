

'use client';

import { Event } from "@/data/mock-data";
import EventCard from "@/components/ui/CardEvent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ListEventProps {
  title: string;
  eventData: Event[];
}

export default function ListEvent({ title, eventData }: ListEventProps) {
  return (
    <div className="w-full py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-20 bg-primary mt-2 rounded-full" />
        </div>
        <a href="#" className="text-primary font-semibold hover:underline hidden md:block">View all</a>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent className="-ml-4 pb-4">
          {eventData.map((event) => (
            <CarouselItem key={event.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-auto">
              <div className="h-full p-1">
                <EventCard
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  priceRange={event.price}
                  imageUrl={event.image}
                  category={event.category}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 lg:-left-12 h-12 w-12 border-2" />
        <CarouselNext className="-right-4 lg:-right-12 h-12 w-12 border-2" />
      </Carousel>
    </div>
  );
}
