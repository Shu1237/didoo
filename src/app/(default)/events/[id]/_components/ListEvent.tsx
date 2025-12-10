'use client';

import EventCard from "@/components/ui/CardEvent";
import { EventCardData } from "@/utils/type";


interface ListEventProps {
  title: string;
  eventData: EventCardData[];
}

export default function ListEvent({ title, eventData }: ListEventProps) {
  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Header */}
      <div className='p-10 text-center'>
        <h1 className='font-semibold text-4xl'> {title}</h1>
      </div>


      {/* Grid Layout */}
      <div className="  px-4 mt-4">
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