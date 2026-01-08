'use client';

import { EventCardData } from "@/utils/type";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { useEffect, useRef, useState, useMemo } from "react";
import envconfig from "../../../../../config";
import { getDistanceKm } from "@/utils/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface MapEventProps {
  eventData: EventCardData[];
}

const mapContainerStyle = {
  width: "100%",
  height: "520px",
};

// ================== DISTANCE UTILS ==================

const RADIUS_KM =5;

// ================== COMPONENT ==================
export default function MapEvent({ eventData }: MapEventProps) {
  const [userLocation, setUserLocation] =
    useState<{ lat: number; lng: number } | null>(null);

  const [selectedEvent, setSelectedEvent] =
    useState<EventCardData | null>(null);

  const [mapVisible, setMapVisible] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // ================== 1️⃣ GET USER GPS ==================
  useEffect(() => {
    //  default to HCMC if geolocation not available
    if (!navigator.geolocation) {
      setUserLocation({ lat: 10.776889, lng: 106.700806 });
      setTimeout(() => setIsLoading(false), 800);
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setTimeout(() => setIsLoading(false), 800);
    });
  }, []);

  // ================== 2️⃣ INTERSECTION ==================
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // ================== 3️⃣ FILTER EVENT <= 5KM ==================
  const nearbyEvents = useMemo(() => {
    if (!userLocation) return [];

    return eventData
      .map((event) => ({
        ...event,
        distance: getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          event.lat,
          event.lng
        ),
      }))
      .filter((e) => e.distance <= RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [eventData, userLocation]);

  // ================== 4️⃣ STAGGER ANIMATION ==================
  useEffect(() => {
    
    if (!isExpanded || !mapVisible) {
      setVisibleEvents([]);
      return;
    }
    console.log(nearbyEvents);

    const timers = nearbyEvents.map((_, idx) =>
      setTimeout(() => {
        setVisibleEvents((prev) =>
          prev.includes(idx) ? prev : [...prev, idx]
        );
      }, 200 * (idx + 1))
    );

    return () => timers.forEach(clearTimeout);
  }, [isExpanded, mapVisible, nearbyEvents]);

 
  return (
    <>
      {/* TITLE */}
      <div className="mt-[300px] mb-12 px-4 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold">Khám phá sự kiện quanh bạn</h1>
        <p className="mt-2">
          Các sự kiện trong bán kính {RADIUS_KM}km từ vị trí hiện tại
        </p>
      </div>

      <section ref={sectionRef} className="pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative min-h-[520px]">

            {/* MAP */}
            <div
              className={`
                relative h-[520px] rounded-2xl overflow-hidden shadow-xl
                transition-all duration-700
                ${mapVisible ? "opacity-100" : "opacity-0 translate-y-6"}
                ${isExpanded && nearbyEvents.length > 0 ? "lg:w-[70%]" : "w-full"}
              `}
              onClick={() => setIsExpanded(true)}
            >
              {isLoading ? (
                <div className="w-full h-full relative">
                        <Skeleton className="w-full h-full" />
                       <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
              ) : (
              <LoadScript
                googleMapsApiKey={envconfig.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              >
                {userLocation && (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      selectedEvent
                        ? { lat: selectedEvent.lat, lng: selectedEvent.lng }
                        : userLocation
                    }
                    zoom={13}
                    options={{
                      fullscreenControl: false,
                      streetViewControl: false,
                      mapTypeControl: false,
                      gestureHandling: isExpanded ? "greedy" : "cooperative",
                    }}
                  >
                    {/* USER */}
                    <Marker
                      position={userLocation}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      }}
                    />

                    {/* RADIUS 5KM */}
                    {/* <Circle
                      center={userLocation}
                      radius={RADIUS_KM * 1000}
                      options={{
                        fillColor: "#7030EF",
                        fillOpacity: 0.12,
                        strokeOpacity: 0,
                      }}
                    /> */}

                    {/* EVENTS */}
                    {nearbyEvents.map((event) => (
                      <Marker
                        key={event.id}
                        position={{ lat: event.lat, lng: event.lng }}
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsExpanded(true);
                        }}
                      />
                    ))}
                  </GoogleMap>
                )}
              </LoadScript>
              )}
            </div>

            {/* EVENT LIST */}
            <div
              className={`
                absolute top-0 right-0 h-full flex flex-col justify-center gap-4
                lg:w-[450px] -ml-[15px] z-20
                transition-all duration-700
                ${isExpanded && nearbyEvents.length >0
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10 pointer-events-none"}
              `}
            >
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <div className="flex gap-3">
                        <Skeleton className="w-24 h-20 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
              nearbyEvents.map((event, idx) => {
                const show = visibleEvents.includes(idx);

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`
                      flex gap-3 rounded-2xl p-4 cursor-pointer
                      bg-linear-to-br from-primary/90 to-accent/90
                      shadow-lg hover:shadow-xl
                      transition-all duration-500
                      ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
                    `}
                  >
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="text-white flex-1">
                      <h3 className="text-sm font-bold uppercase line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs mt-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>

                      <div className="text-xs mt-1 opacity-80">
                        Cách bạn {event.distance.toFixed(1)} km
                      </div>

                      <div className="mt-1 text-xs font-bold text-white">
                        {event.priceRange}
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
