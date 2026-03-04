"use client";

import { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { getDistanceKm } from "@/utils/helper";
import envconfig from "../../../../../../config";

interface EventLocationProps {
  event: Event;
}

interface ResolvedLocation {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

const DEFAULT_CENTER = {
  latitude: 10.7769,
  longitude: 106.7009,
};

export default function EventLocation({ event }: EventLocationProps) {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [resolvedLocations, setResolvedLocations] = useState<ResolvedLocation[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(true);

  const rawLocations = event.locations || [];
  const categoryIcon = event.category?.iconUrl;

  // 1. Get User Location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => { },
    );
  }, []);

  // 2. Geocode missing coordinates
  useEffect(() => {
    async function resolveCoordinates() {
      setIsGeocoding(true);
      const token = envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      const updatedLocations: ResolvedLocation[] = [];

      for (const loc of rawLocations) {
        let lat = (loc as any).Latitude || loc.latitude;
        let lng = (loc as any).Longitude || loc.longitude;

        // If coordinates are missing/zero but we have an address, geocode it
        if ((!lat || !lng || (lat === 0 && lng === 0)) && loc.address && token) {
          try {
            const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(loc.address)}&access_token=${token}&limit=1`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
              const [resolvedLng, resolvedLat] = data.features[0].geometry.coordinates;
              lat = resolvedLat;
              lng = resolvedLng;
            }
          } catch (error) {
            console.error("Geocoding failed for address:", loc.address, error);
          }
        }

        updatedLocations.push({
          name: loc.name,
          address: loc.address,
          latitude: lat || null,
          longitude: lng || null
        });
      }

      setResolvedLocations(updatedLocations);
      setIsGeocoding(false);
    }

    if (rawLocations.length > 0) {
      resolveCoordinates();
    } else {
      setIsGeocoding(false);
    }
  }, [rawLocations]);

  const firstLocation = resolvedLocations[0];
  const firstLat = firstLocation?.latitude;
  const firstLng = firstLocation?.longitude;

  const mapCenter = {
    latitude: firstLat || DEFAULT_CENTER.latitude,
    longitude: firstLng || DEFAULT_CENTER.longitude,
  };

  const distance =
    userLocation && firstLat && firstLng
      ? getDistanceKm(
        userLocation.lat,
        userLocation.lng,
        firstLat,
        firstLng,
      )
      : null;

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Event Location
        </h2>
        <p className="max-w-xl text-base text-slate-600 font-medium">
          View the venue location on the map and get Google Maps directions.
        </p>
      </div>

      <div className="relative w-full group mb-8 md:mb-12">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 shadow-inner h-[500px] md:h-[600px] w-full">
          {isGeocoding ? (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Locating Venue...</span>
              </div>
            </div>
          ) : resolvedLocations.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center p-6 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
              Location details are updating.
            </div>
          ) : (
            <>
              {/* The Full Width Map Background */}
              <Map
                mapboxAccessToken={envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                  latitude: mapCenter.latitude,
                  longitude: mapCenter.longitude,
                  zoom: 14,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                style={{ width: "100%", height: "100%" }}
              >
                <NavigationControl position="top-right" />

                {resolvedLocations.map((loc) => {
                  const lat = loc.latitude;
                  const lng = loc.longitude;

                  if (!lat || !lng) return null;

                  return (
                    <Marker
                      key={`${loc.name}-${lat}-${lng}`}
                      latitude={lat}
                      longitude={lng}
                      anchor="bottom"
                    >
                      <div className="relative rounded-full border-2 border-white bg-sky-600 p-1 text-white shadow-lg motion-safe:animate-bounce flex items-center justify-center w-10 h-10 overflow-hidden">
                        {categoryIcon ? (
                          <img src={categoryIcon} alt="Marker Icon" className="w-full h-full object-cover" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </div>
                    </Marker>
                  );
                })}

                {userLocation && (
                  <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="center">
                    <div className="h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  </Marker>
                )}
              </Map>

              {/* Clickable Overlay for Map integration */}
              {firstLat && firstLng && (
                <div
                  className="absolute inset-0 z-10 bg-sky-900/0 hover:bg-sky-900/20 transition-colors duration-300 cursor-pointer"
                  onClick={() => {
                    router.push(`/map?eventId=${event.id}&lat=${firstLat}&lng=${firstLng}`);
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md text-sky-700 px-6 py-3 rounded-full font-bold shadow-xl shadow-sky-900/20 flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    Open Map
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Right Floating Info Card - Breaking out of map */}
        {!isGeocoding && resolvedLocations.length > 0 && firstLocation && (
          <div className="absolute -bottom-6 right-4 md:-bottom-8 md:-right-8 z-20 w-[calc(100%-2rem)] max-w-[320px] pointer-events-none">
            <article className="rounded-[2rem] border border-white/40 bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] pointer-events-auto transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 line-clamp-1">{firstLocation.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 font-semibold line-clamp-2">{firstLocation.address || "Address TBA"}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100/80 text-sky-600 shadow-inner">
                  <MapPin className="h-4 w-4" />
                </span>
              </div>

              {distance !== null && (
                <div className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-100/50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-emerald-600">
                    <Navigation className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Est. Distance
                    </p>
                    <p className="text-sm font-black text-slate-900">{distance.toFixed(1)} km</p>
                  </div>
                </div>
              )}

              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the background map click
                  if (!firstLat || !firstLng) return;
                  router.push(`/map?eventId=${event.id}&lat=${firstLat}&lng=${firstLng}`);
                }}
                disabled={!firstLat || !firstLng}
                className="h-12 w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black tracking-widest uppercase text-[10px] shadow-lg shadow-slate-900/20 transition-all"
              >
                Get Directions
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </article>
          </div>
        )}
      </div>

      {!userLocation && (
        <p className="text-xs font-medium text-slate-500 text-center md:text-left mt-2 pl-4">Enable location precision tracking to see distance to event.</p>
      )}
    </section>
  );
}
