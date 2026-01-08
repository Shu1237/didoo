'use client';

import { EventCardData } from '@/utils/type';
import React from 'react';
import DetailPlace from './DetailPlace';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ListProps {
  eventsData: EventCardData[];
  onSelectEvent: (coords: { lat: number; lng: number }) => void;
  isLoading: boolean;
}

const List = ({ eventsData, onSelectEvent, isLoading }: ListProps) => {
  return (
   <div className="h-full overflow-y-auto bg-gradient-to-br from-card/95 via-primary/5 to-card/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary/20 p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-sm rounded-xl p-4 shadow-md border border-primary/20">
              <Skeleton className="h-48 w-full mb-4 rounded-lg" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : eventsData.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Không tìm thấy sự kiện nào</p>
        </div>
      ) : (
        eventsData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => onSelectEvent({ lat: event.lat, lng: event.lng })}
          >
            <DetailPlace eventData={event} />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default List;
