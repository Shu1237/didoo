


'use client';

import { EventCardData } from "@/utils/type";
import EventCard from "../../../../components/ui/CardEvent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ListEventProps {
  title: string;
  eventData: EventCardData[];
}

export default function ListEvent({ title, eventData }: ListEventProps) {
  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent className="-ml-1 md:-ml-2">
          {eventData.map((event) => (
            <CarouselItem key={event.id} className="pl-1 md:pl-2 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <EventCard {...event} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 md:-left-12" />
        <CarouselNext className="-right-4 md:-right-12" />
      </Carousel>
    </div>
  );
}
