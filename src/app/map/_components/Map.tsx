'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import envconfig from '../../../../config';
import { EventCardData } from '@/utils/type';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

interface MapProps {
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  events: EventCardData[];
  isLoading: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const Map = ({ coordinates, setCoordinates, events, isLoading }: MapProps) => {
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
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={13}
        options={{
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
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

        {/* Radius Circle */}
        <Circle
          center={coordinates}
          radius={5000} // 5km
          options={{
            fillColor: '#7030EF',
            fillOpacity: 0.12,
            strokeColor: '#7030EF',
            strokeOpacity: 0.3,
            strokeWeight: 1,
          }}
        />

        {/* Event Markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={{ lat: event.lat, lng: event.lng }}
            onClick={() => setCoordinates({ lat: event.lat, lng: event.lng })}
            title={event.title}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
