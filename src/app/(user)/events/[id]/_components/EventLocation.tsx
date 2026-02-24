'use client';

import React, { useEffect, useState, useMemo } from 'react';
import MapComponent, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { Event } from "@/types/event";
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

    const locations = event.locations || [];
    const firstLocation = locations[0];
    const eventLat = firstLocation?.latitude || 0;
    const eventLng = firstLocation?.longitude || 0;

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
        if (!userLocation || !eventLat || !eventLng) return null;
        return getDistanceKm(userLocation.lat, userLocation.lng, eventLat, eventLng);
    }, [userLocation, eventLat, eventLng]);

    return (
        <section className="relative py-24 bg-[#0a0a0a] overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-primary/5 blur-[180px] rounded-full" />
            </div>

            <div className="max-w-[1700px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">

                {/* LEFT: Mapping Display */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="lg:col-span-8 relative aspect-video md:aspect-[21/9] rounded-[60px] overflow-hidden border border-white/10 bg-white/5 shadow-3xl"
                >
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : (
                        <MapComponent
                            mapboxAccessToken={envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                            initialViewState={{
                                longitude: eventLng,
                                latitude: eventLat,
                                zoom: 14,
                            }}
                            style={{ width: '100%', height: '100%' }}
                            mapStyle="mapbox://styles/mapbox/dark-v11"
                        >
                            <NavigationControl position="top-right" />

                            {/* Minimal Event Markers */}
                            {locations.map((loc, idx) => (
                                <Marker key={idx} longitude={loc.longitude || 0} latitude={loc.latitude || 0} anchor="bottom">
                                    <div className="relative group flex items-center justify-center">
                                        <div className="w-8 h-8 bg-primary rounded-full shadow-[0_0_30px_rgba(var(--primary),0.8)] border-4 border-white transition-transform group-hover:scale-125" />
                                        <div className="absolute -top-14 bg-white text-black px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
                                            {loc.name}
                                        </div>
                                    </div>
                                </Marker>
                            ))}

                            {/* User Marker */}
                            {userLocation && (
                                <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
                                    <div className="w-5 h-5 bg-white rounded-full border-4 border-primary shadow-2xl animate-pulse" />
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
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-primary block">Bản đồ & Vị trí</span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] uppercase">
                                Không gian <br /> <span className="text-primary">Sự kiện.</span>
                            </h2>
                        </div>

                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide py-2">
                            {locations.length > 0 ? locations.map((loc, idx) => (
                                <div key={idx} className="group p-8 rounded-[40px] bg-white/[0.08] border border-white/20 hover:bg-white/[0.12] hover:border-primary transition-all duration-500">
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div className="space-y-2">
                                            <p className="text-white font-black text-2xl tracking-tight uppercase leading-none">{loc.name}</p>
                                            <p className="text-sm text-white/60 font-bold leading-relaxed">{loc.address}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/20 group-hover:bg-primary group-hover:text-black transition-all">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <Button
                                        className="h-14 w-full rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-500 font-black uppercase text-[10px] tracking-[0.2em]"
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`, '_blank')}
                                        disabled={!loc.latitude || !loc.longitude}
                                    >
                                        Chỉ đường <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            )) : (
                                <div className="p-10 rounded-[40px] bg-white/[0.08] border border-white/20 text-center">
                                    <p className="text-white/60 text-lg font-bold">
                                        Địa điểm sắp được cập nhật
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Proximity Card (Premium Dribbble Style) */}
                    {distance !== null && firstLocation && (
                        <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-10 rounded-[48px] flex items-center gap-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-20 h-20 rounded-[28px] bg-white text-black flex items-center justify-center shadow-2xl relative z-10 scale-90 group-hover:scale-100 transition-transform duration-500">
                                <Navigation className="w-10 h-10" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 leading-none">Khoảng cách</p>
                                <div className="text-4xl font-black text-white tracking-widest">
                                    {distance.toFixed(1)} <span className="text-primary tracking-tighter ml-1 text-2xl">KM</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
