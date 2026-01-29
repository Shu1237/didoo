'use client';

import { useEffect, useState, useMemo } from 'react';
import MapComponent, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation } from 'lucide-react';
import { Event } from '@/utils/type';
import { getDistanceKm } from '@/utils/helper';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import envconfig from '../../../../../../config';

interface EventLocationProps {
    event: Event;
}

export default function EventLocation({ event }: EventLocationProps) {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            // Default fallback if no geolocation support
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                setIsLoading(false);
            }
        );
    }, []);

    const distance = useMemo(() => {
        if (!userLocation) return null;
        return getDistanceKm(userLocation.lat, userLocation.lng, event.lat, event.lng);
    }, [userLocation, event]);

    return (
        <section className="container mx-auto px-4 max-w-7xl -mt-12 relative z-20 mb-20">
            <div className="bg-white/60 dark:bg-card/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-xl overflow-hidden">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            <MapPin className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Địa điểm tổ chức
                        </h2>
                        <p className="text-muted-foreground mt-2 text-lg">
                            {event.location}
                        </p>
                    </div>

                    {/* Distance Badge */}
                    {distance !== null && (
                        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-5 py-3 rounded-2xl">
                            <Navigation className="w-6 h-6 text-primary animate-pulse" />
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Khoảng cách từ bạn</p>
                                <p className="text-xl md:text-2xl font-bold text-primary">
                                    {distance.toFixed(1)} km
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Map Container */}
                <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border/50 shadow-inner relative">
                    {isLoading ? (
                        <Skeleton className="w-full h-full" />
                    ) : (
                        <MapComponent
                            mapboxAccessToken={envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                            initialViewState={{
                                longitude: event.lng,
                                latitude: event.lat,
                                zoom: 14,
                            }}
                            style={{ width: '100%', height: '100%' }}
                            mapStyle="mapbox://styles/mapbox/streets-v12"
                        >
                            <NavigationControl position="top-right" />

                            {/* Event Marker */}
                            <Marker longitude={event.lng} latitude={event.lat} anchor="bottom">
                                <div className="relative group">
                                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border-2 border-white transform transition-transform group-hover:scale-110">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 border-r-2 border-b-2 border-white -z-10"></div>
                                </div>
                            </Marker>

                            {/* User Marker */}
                            {userLocation && (
                                <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                                        <div className="text-xs font-bold bg-white px-2 py-0.5 rounded-full shadow-sm mt-1">
                                            Bạn
                                        </div>
                                    </div>
                                </Marker>
                            )}
                        </MapComponent>
                    )}

                    {/* Location Overlay Details (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-background/90 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg">
                        <h3 className="font-semibold text-foreground truncate">{event.location}</h3>
                        <div className="mt-2 flex gap-2">
                            <Button
                                size="sm"
                                className="w-full"
                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`, '_blank')}
                            >
                                Chỉ đường
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
