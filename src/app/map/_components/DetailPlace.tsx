'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import { Event } from "@/utils/type";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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
      className="group relative flex flex-col gap-3 p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Horizontal Layout for Compact View */}
      <div className="flex gap-4">
        {/* Image - Square Standard */}
        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-muted">
          <Image
            src={eventData.image}
            alt={eventData.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/10 font-medium">
            {eventData.category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1.5"> {/* Tăng nhẹ khoảng cách giữa các dòng để dễ đọc */}

            {/* Title - Chỉnh xuống text-sm để gọn hơn */}
            <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors">
              {eventData.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-[11px] md:text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0 text-primary/70" />
              <span className="truncate">{eventData.location}</span>
            </div>

            {/* Date - Gọn gàng hơn không dùng background block */}
            <div className="flex items-center gap-1 text-[11px] md:text-xs font-semibold text-primary/90">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{isValidDate ? format(eventDate, 'dd/MM/yyyy', { locale: vi }) : 'TBA'}</span>
            </div>

          </div>

          <div className="flex items-center justify-between mt-2">


            <div className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {eventData.price}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Overlay (Optional/Hover) */}
      <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl' />
    </div>
  );
};

export default DetailPlace;