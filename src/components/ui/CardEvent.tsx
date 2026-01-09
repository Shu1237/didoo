// src/components/ui/CardEvent.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface EventCardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  location: string;
  priceRange: string;
  imageUrl: string;
  category?: string;
}

const EventCard = ({
  id,
  title,
  date,
  location,
  priceRange,
  imageUrl,
  category
}: EventCardProps) => {
  return (
    <Link href={`/events/${id}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card dark:bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Image Section */}
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

              {/* Category Badge */}
              {category && (
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                  {category}
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                {priceRange}
              </div>
            </div>

            {/* Content Section */}
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
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default EventCard;