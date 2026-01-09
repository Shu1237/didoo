'use client';

import { EventCardData } from '@/utils/type';
import React from 'react';
import DetailPlace from './DetailPlace';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ListProps {
  eventsData: EventCardData[];
  isLoading: boolean;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventCardData | null>>;
}

const List = ({ eventsData, isLoading, setSelectedEvent }: ListProps) => {
  return (
    <div className="h-full overflow-y-auto bg-background/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 p-4 space-y-4 no-scrollbar">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card/50 rounded-xl p-4 shadow-sm border border-border/50 space-y-3">
              <Skeleton className="h-40 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : eventsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center">
          <p className="font-medium">Không tìm thấy sự kiện</p>
          <p className="text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      ) : (
        eventsData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group"
          >
            <DetailPlace eventData={event} setSelectedEvent={setSelectedEvent} />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default List;
