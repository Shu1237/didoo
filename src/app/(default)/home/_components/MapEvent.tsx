



'use client';

import { EventCardData } from "@/utils/type";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";

interface MapEventProps {
  eventData: EventCardData[];
}

export default function MapEvent({ eventData }: MapEventProps) {
  return (
  <>
     <div className="mt-[300px]  space-y-4 px-4 md:px-0 max-w-3xl mx-auto mb-20">
        <h1 className="font-bold text-5xl text-center">Khám phá sự kiện quanh bạn</h1>
        <p className="text-center">Tìm kiếm và khám phá những sự kiện tuyệt vời đang diễn ra tại Thành phố Hồ Chí Minh</p>
      </div>
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Map Section - Background */}
          <div className="relative w-[655px] h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gray-200 relative">
                <Image
                    src="/event1.jpg"
                    alt="Map Placeholder"
                    fill
                    className="object-cover"
                />
            </div>
          </div>

          {/* Event List - Overlapping on the right */}
          <div className="absolute top-4 -right-8 max-w-md flex flex-col gap-4  overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {eventData.map((event) => (
              <div
                key={event.id}
                className="mt-3  w-full flex gap-3 bg-linear-to-br from-[#6b7d3f] to-[#4a5a2c] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Event Image */}
                <div className="relative w-32 h-24 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Event Info */}
                <div className="flex-1 flex flex-col justify-between text-white">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm uppercase line-clamp-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-[#4ECCA3] mt-1">
                    {event.priceRange}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  
  </>
  );
}
