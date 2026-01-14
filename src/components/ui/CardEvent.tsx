
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Event } from '@/utils/type';


const EventCard = ({
  id,
  title,
  date,
  location,
  price,
  image,
  category,
}: Event) => {
  return (
    <Link href={`/events/${id}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
      >
        <div className='w-[303px] h-[265px] rounded-[10px] shadow-lg hover:shadow-xl transition-shadow bg-card'>
          <div className='h-[156px] relative '>
          <div className='w-[95%] mx-auto absolute top-2.5 left-0 right-0 h-[146px] overflow-hidden rounded-xl border border-white/10'>
              <Image src={image} alt={title} fill className="rounded-xl object-cover" />
          </div>

            {/* Category Badge */}
            {category && (
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                {category}
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute bottom-[7px] left-3.5 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
              <Ticket className="w-3 h-3" />
              {price}
            </div>
          </div>

            <div className="p-4 flex flex-col flex-1 gap-3">
              <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>

              <div className="mt-auto space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-secondary shrink-0" />
                  <span className="truncate">{new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>
        </div>
      </motion.div>
    </Link >
  );
};

export default EventCard;