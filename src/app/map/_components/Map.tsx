'use client';

import MapComponent, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Event } from '@/utils/type';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { envconfig } from '../../../../config';



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
      
      {/* User Location Marker */}
      <Marker
        longitude={coordinates.lng}
        latitude={coordinates.lat}
        anchor="bottom"
      >
        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg" title="Vị trí của bạn" />
      </Marker>

      {/* Event Markers */}
      {events.map((event) => (
        <Marker
          key={event.id}
          longitude={event.lng}
          latitude={event.lat}
          anchor="bottom"
        >
          <div
            className={`w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all ${
              selectedEvent?.id === event.id
                ? 'bg-red-500 scale-125 animate-bounce'
                : 'bg-orange-500'
            }`}
            title={event.title}
          />
        </Marker>
      ))}
    </MapComponent>
  );
};

export default Map;
