'use client';

import MapComponent, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Event } from '@/utils/type';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { envconfig } from '../../../../config';

// Beautiful custom map pin icon component
const MapPinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
      fill="currentColor"
    />
  </svg>
);



interface MapProps {
  coordinates: { lat: number; lng: number } | null;
  events: Event[];
  isLoading: boolean;
  selectedEvent: Event | null;
  mapStyle?: string;
}

const Map = ({ coordinates, events, isLoading, selectedEvent,mapStyle  }: MapProps) => {
  
 
  if (isLoading || !coordinates) {
    return (
      <div className="w-full h-full relative">
        <Skeleton className="w-full h-full" />
        <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  }

  return (
    <MapComponent

      mapboxAccessToken={envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
      initialViewState={{
        longitude: selectedEvent ? selectedEvent.lng : coordinates.lng,
        latitude: selectedEvent ? selectedEvent.lat : coordinates.lat,
        zoom: 13,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={mapStyle}
      maxZoom={20}
      minZoom={3}
    >
      <NavigationControl position="top-right" />
      
      {/* User Location Marker - Beautiful Blue Pin */}
      <Marker
        longitude={coordinates.lng}
        latitude={coordinates.lat}
        anchor="bottom"
      >
        <div className="relative animate-bounce">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 w-10 h-10 -left-1 -top-1 bg-blue-400 rounded-full animate-ping opacity-40" />
          
          {/* Main pin */}
          <div className="relative drop-shadow-2xl">
            <MapPinIcon className="w-8 h-8 text-blue-500 drop-shadow-lg" />
          </div>
        </div>
      </Marker>

      {/* Event Markers - Beautiful Gradient Pins */}
      {events.map((event) => {
        const isSelected = selectedEvent?.id === event.id;
        
        return (
          <Marker
            key={event.id}
            longitude={event.lng}
            latitude={event.lat}
            anchor="bottom"
          >
            <div className="relative group cursor-pointer">
              {/* Selected pulsing effect */}
              {isSelected && (
                <div className="absolute inset-0 w-12 h-12 -left-2 -top-2 bg-primary/30 rounded-full animate-ping" />
              )}
              
              {/* Main pin with gradient */}
              <div
                className={`relative transition-all duration-300 ${
                  isSelected 
                    ? 'scale-125 animate-bounce' 
                    : 'hover:scale-110'
                }`}
              >
                <div className="relative drop-shadow-2xl">
                  {/* Gradient overlay for selected state */}
                  {isSelected ? (
                    <MapPinIcon className="w-10 h-10 text-red-500 drop-shadow-lg" />
                  ) : (
                    <MapPinIcon className="w-8 h-8 text-orange-500 drop-shadow-lg hover:text-primary transition-colors" />
                  )}
                </div>
              </div>
              
              {/* Hover tooltip - Beautiful */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shadow-2xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    {event.title}
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </Marker>
        );
      })}
    </MapComponent>
  );
};

export default Map;