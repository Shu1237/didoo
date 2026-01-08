'use client';

import { EventCardData } from "@/utils/type";
import EventCard from "../../../../components/ui/CardEvent";

interface ListEventProps {
  title: string;
  eventData: EventCardData[];
}

export default function ListEvent({ title, eventData }: ListEventProps) {
  return (
    <div className="w-full py-12 ">
      {/* Header */}
     <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {title}
        </h2>
      </div>


      {/* Grid Layout */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {eventData.map((event) => (
            <div key={event.id} className="flex justify-center">
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}