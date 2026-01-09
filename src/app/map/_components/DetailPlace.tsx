'use client';

import { EventCardData } from '@/utils/type';
import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface DetailPlaceProps {
  eventData: EventCardData;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventCardData | null>>;
}

const DetailPlace = ({ eventData ,setSelectedEvent}: DetailPlaceProps) => {
  return (

    <div onClick={()=> setSelectedEvent(eventData)} className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-primary/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer group">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={eventData.imageUrl}
          alt={eventData.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          {eventData.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 bg-card/50 backdrop-blur-sm">
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {eventData.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{eventData.date}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="line-clamp-1">{eventData.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-primary/20">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {eventData.priceRange}
            </span>
          </div>
          <Link href={`/events/${eventData.id}`}>
            <button className="text-sm text-primary font-semibold hover:text-accent transition-colors">
              Xem chi tiết →
            </button>
          </Link>
        </div>
      </div>
    </div>

  );
};

export default DetailPlace;
