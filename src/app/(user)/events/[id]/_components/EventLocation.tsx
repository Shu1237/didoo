"use client";

import { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { getDistanceKm } from "@/utils/helper";
import envconfig from "../../../../../../config";

interface EventLocationProps {
  event: Event;
}

const DEFAULT_CENTER = {
  latitude: 10.7769,
  longitude: 106.7009,
};

export default function EventLocation({ event }: EventLocationProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const locations = event.locations || [];
  const firstLocation = locations[0];

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {},
    );
  }, []);

  const mapCenter = {
    latitude: firstLocation?.latitude || DEFAULT_CENTER.latitude,
    longitude: firstLocation?.longitude || DEFAULT_CENTER.longitude,
  };

  const distance =
    userLocation && firstLocation?.latitude && firstLocation?.longitude
      ? getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          firstLocation.latitude,
          firstLocation.longitude,
        )
      : null;

  return (
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Dia diem su kien
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Xem vi tri tren ban do va mo chi dan Google Maps chi voi 1 cham.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {locations.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center px-6 text-center text-slate-500">
              Dia diem dang duoc cap nhat boi ban to chuc.
            </div>
          ) : (
            <div className="relative min-h-[320px]">
              <Map
                mapboxAccessToken={envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                  latitude: mapCenter.latitude,
                  longitude: mapCenter.longitude,
                  zoom: 13,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                style={{ width: "100%", height: "100%" }}
              >
                <NavigationControl position="top-right" />

                {locations.map((location) => {
                  if (!location.latitude || !location.longitude) return null;

                  return (
                    <Marker
                      key={`${location.name}-${location.latitude}-${location.longitude}`}
                      latitude={location.latitude}
                      longitude={location.longitude}
                      anchor="bottom"
                    >
                      <div className="rounded-full border-2 border-white bg-sky-600 p-2 text-white shadow-lg">
                        <MapPin className="h-4 w-4" />
                      </div>
                    </Marker>
                  );
                })}

                {userLocation && (
                  <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="center">
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow" />
                  </Marker>
                )}
              </Map>
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-4 lg:col-span-4">
        {locations.length > 0 ? (
          locations.map((location) => (
            <article
              key={`${location.name}-${location.address}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{location.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{location.address || "Dang cap nhat dia chi"}</p>
                </div>
                <span className="rounded-full bg-sky-100 p-2 text-sky-700">
                  <MapPin className="h-4 w-4" />
                </span>
              </div>
              <Button
                onClick={() => {
                  if (!location.latitude || !location.longitude) return;
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
                    "_blank",
                  );
                }}
                disabled={!location.latitude || !location.longitude}
                variant="outline"
                className="mt-4 h-10 w-full rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              >
                Chi duong
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </article>
          ))
        ) : (
          <article className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
            Chua co thong tin dia diem.
          </article>
        )}

        {distance !== null && firstLocation && (
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white p-2 text-emerald-600 shadow-sm">
                <Navigation className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Khoang cach uoc tinh
                </p>
                <p className="text-lg font-bold text-emerald-900">{distance.toFixed(1)} km</p>
              </div>
            </div>
          </article>
        )}

        {!userLocation && (
          <p className="text-xs text-slate-500">Bat vi tri de xem khoang cach tu ban den su kien.</p>
        )}
      </aside>
    </section>
  );
}
