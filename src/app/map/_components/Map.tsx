'use client';


import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';

import { EventCardData } from '@/utils/type';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { envconfig } from '../../../../config';
interface MapProps {
  coordinates: { lat: number; lng: number } | null;
  events: EventCardData[];
  isLoading: boolean;
  selectedEvent: EventCardData | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const Map = ({ coordinates, events, isLoading, selectedEvent }: MapProps) => {
  if (isLoading || !coordinates) {
    return (
      <div className="w-full h-full relative">
        <Skeleton className="w-full h-full" />
        <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={envconfig.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}                                     // user location
        center={selectedEvent ? { lat: selectedEvent.lat, lng: selectedEvent.lng } : coordinates}
        zoom={13}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: 'greedy',
        }}
      >
        {/* User Location Marker */}
        <Marker
          position={coordinates}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
          title="Vị trí của bạn"
        />

      

        {/* Event Markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={{ lat: event.lat, lng: event.lng }}
            title={event.title}
            animation={selectedEvent?.id === event.id ? window.google.maps.Animation.BOUNCE : undefined}
            icon={
              selectedEvent?.id === event.id
                ? {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(48, 48),
                  }
                : undefined
            }
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
