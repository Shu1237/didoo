// src/components/EventCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';


interface EventCardProps {
  id: number;
  title: string;
  subtitle?: string;
  date: string;     
  time?: string;    
  location: string;  
  priceRange: string;
  imageUrl: string;
}

const EventCard = ({
  id,
  title,
  date,
  location,
  priceRange,
  imageUrl,
}: EventCardProps) => {
  return (
    <Link href={`/events/${id}`} className="block group">
      <Card className="overflow-hidden rounded-xl bg-linear-to-br from-[#3d2463] via-[#2d1850] to-[#1f0d3d] border border-purple-800/30 shadow-xl 
                       transition-all duration-300   group p-0 w-[303px] h-[285px]">
        
        <CardContent className="p-0">
          <div className="flex flex-col">
            {/* Poster Image - Top */}
            <div className="p-3">
              <div className="relative w-full h-40 overflow-hidden rounded-xl border-2 border-purple-500/30">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-fit object-center transition-transform duration-500 "
                />
              </div>
            </div>

            {/* Content - Bottom */}
            <div className="p-3 text-white flex flex-col justify-between bg-linear-to-br from-transparent to-black/10 flex-1">
              <div className="space-y-0.5">
                {/* Tiêu đề chính */}
                <h3 className="text-sm font-bold leading-tight uppercase line-clamp-1">
                  {title}
                </h3>

                {/* Thời gian với icon */}
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3 text-white shrink-0" />
                  <span className="font-normal">{date}</span>
                </div>

                {/* Địa điểm với icon */}
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-white shrink-0" />
                  <span className="font-normal line-clamp-1">{location}</span>
                </div>

                {/* Giá vé */}
                <div className="pt-1 flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-white inline-block mr-1 shrink-0" />
                  <span className="text-xs font-bold text-primary">
                    {priceRange}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;