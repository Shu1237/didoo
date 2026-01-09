'use client';

import { EventCardData } from "@/utils/type";
import EventCard from "../../../../components/ui/CardEvent";

interface ListEventProps {
  title: string;
  eventData: EventCardData[];
}

export default function ListEvent({ title, eventData }: ListEventProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-8 bg-primary rounded-full inline-block" />
          {title}
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {eventData.map((event) => (
          <div key={event.id} className="flex justify-center">
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
}