'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Event } from "../../../types/base";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface DetailPlaceProps {
  eventData: Event;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}

const DetailPlace = ({ eventData, setSelectedEvent }: DetailPlaceProps) => {
  // Safe date parsing
  const eventDate = new Date(eventData.date);
  const isValidDate = !isNaN(eventDate.getTime());

  return (
    <div
      onClick={() => setSelectedEvent(eventData)}
      className="group relative flex gap-4 p-4 rounded-[1.5rem] bg-card/30 dark:bg-card/20 border border-white/40 dark:border-white/15 hover:border-primary/60 hover:bg-card/50 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-lg shadow-sm hover:shadow-xl hover:-translate-y-1 w-full max-w-full"
    >
      {/* Left: Image & Action */}
      <div className="flex flex-col gap-3 shrink-0 w-28">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={eventData.image}
            alt={eventData.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{eventData.category}</span>
          </div>
        </div>

        {/* Button below image */}
        <div className="w-full">
          <Button className="w-full h-8 text-xs rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 shadow-none">
            Xem thêm
          </Button>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col min-w-0 py-0.5 gap-2">

        {/* Top: Title */}
        <div className="flex justify-between items-start">
          <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {eventData.title}
          </h3>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-muted overflow-hidden relative border border-border">
            {eventData.organizer?.avatar ? (
              <Image src={eventData.organizer.avatar} alt={eventData.organizer.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/20" />
            )}
          </div>
          <span className="text-xs font-medium text-foreground/80 truncate">
            {eventData.organizer?.name || 'Unknown Organizer'}
          </span>
        </div>

        {/* Price - Full Row */}
        <div className="w-full py-1">
          <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {eventData.price}
          </span>
        </div>

        {/* Bottom: Date & Location */}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-dashed border-border/50">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{isValidDate ? format(eventDate, 'dd MMM, yyyy', { locale: vi }) : 'TBA'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span className="truncate max-w-[180px]">{eventData.location}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Status Indicator (Dot) */}
      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${eventData.status === 'completed' ? 'bg-red-500' : 'bg-green-500'} ring-4 ring-background/50`} />

    </div>
  );
};

export default DetailPlace;