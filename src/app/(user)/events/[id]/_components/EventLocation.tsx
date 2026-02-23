'use client';

import React, { useEffect, useState, useMemo } from 'react';
import MapComponent, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { Event } from "../../../../../types/base";
import { getDistanceKm } from '@/utils/helper';
import envconfig from '../../../../../../config';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface EventLocationProps {
    event: Event;
}

export default function EventLocation({ event }: EventLocationProps) {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
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
        <section className="relative py-24 bg-[#0a0a0a]">
            <div className="max-w-[1700px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* LEFT: Mapping Display */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-8 relative aspect-video md:aspect-[21/9] rounded-[48px] overflow-hidden border border-white/5 bg-white/5 shadow-2xl"
                >
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : (
                        <MapComponent
                            mapboxAccessToken={envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                            initialViewState={{
                                longitude: event.lng,
                                latitude: event.lat,
                                zoom: 14,
                            }}
                            style={{ width: '100%', height: '100%' }}
                            mapStyle="mapbox://styles/mapbox/dark-v11"
                        >
                            <NavigationControl position="top-right" />

                            {/* Minimal Event Marker */}
                            <Marker longitude={event.lng} latitude={event.lat} anchor="bottom">
                                <div className="relative group flex items-center justify-center">
                                    <div className="w-6 h-6 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),1)] border-2 border-white" />
                                    <div className="absolute -top-12 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        EVENT SITE
                                    </div>
                                </div>
                            </Marker>

                            {/* User Marker */}
                            {userLocation && (
                                <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
                                    <div className="w-4 h-4 bg-white rounded-full border-2 border-primary shadow-lg animate-pulse" />
                                </Marker>
                            )}
                        </MapComponent>
                    )}
                </motion.div>

                {/* RIGHT: Location Details (Premium Integration) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-4 space-y-12"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-primary/40" />
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Spatial Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            The Venue <br /> Intersection
                        </h2>
                        <div className="space-y-4">
                            <p className="text-white/40 text-xl font-medium leading-relaxed">
                                {event.location}
                            </p>
                            <Button
                                variant="link"
                                className="p-0 h-auto text-primary text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`, '_blank')}
                            >
                                Get Directions <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Proximity Card (Premium Dribbble Style) */}
                    {distance !== null && (
                        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[24px] bg-white text-black flex items-center justify-center">
                                <Navigation className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Proximity</div>
                                <div className="text-3xl font-black text-white tracking-widest">
                                    {distance.toFixed(1)} <span className="text-primary tracking-tighter ml-1">KM</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
