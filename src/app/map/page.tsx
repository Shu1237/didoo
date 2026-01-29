'use client';

import { useState, useEffect } from 'react';
import Header from './_components/Header';
import List from './_components/List';
import Map from './_components/Map';
import { MapPin, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';
import { EVENTS } from '@/utils/mock';
import { Event } from '@/utils/type';
import { Button } from '@/components/ui/button';

const mapStyle = {
  normalStyle: "mapbox://styles/mapbox/streets-v12",
  satelliteStyle: "mapbox://styles/mapbox/standard-satellite"
}
const Page = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'distance' | 'price'>('date');
  const [mapStyleType, setMapStyleType] = useState<string>(mapStyle.normalStyle);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setTimeout(() => setIsLoading(false), 1000);
      });
    } else {
      // Default to HCMC
      setCoordinates({ lat: 10.776889, lng: 106.700806 });
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);
  const toggleMapStyle = () => {
    setMapStyleType((prevStyle) =>
      prevStyle === mapStyle.normalStyle ? mapStyle.satelliteStyle : mapStyle.normalStyle
    );
  }
  // Filter and sort events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(EVENTS);

  useEffect(() => {
    let filtered = EVENTS;

    // Filter by category
    if (category) {
      filtered = filtered.filter(event =>
        event.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'distance' && coordinates) {
        const distA = Math.sqrt(Math.pow(a.lat - coordinates.lat, 2) + Math.pow(a.lng - coordinates.lng, 2));
        const distB = Math.sqrt(Math.pow(b.lat - coordinates.lat, 2) + Math.pow(b.lng - coordinates.lng, 2));
        return distA - distB;
      }
      return 0;
    });

    setFilteredEvents(filtered);
  }, [category, searchQuery, sortBy, coordinates]);



  return (
    <div className="relative w-full h-full overflow-hidden bg-muted/20">
      {/* Map - Full Screen */}
      <div className="absolute inset-0 z-0">
        <Map coordinates={coordinates} events={EVENTS} isLoading={isLoading} selectedEvent={selectedEvent} mapStyle={mapStyleType} />
      </div>

      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleMapStyle}
          className="rounded-full shadow-2xl bg-white dark:bg-card hover:scale-110 transition-transform border-2 border-white/20"
        >
          {mapStyleType === mapStyle.satelliteStyle ? <MapPin className="w-5 h-5 text-primary" /> : <Satellite className="w-5 h-5 text-primary" />}
        </Button>
      </div>

      {/* Sidebar Panel - Premium Floating Glass */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute top-4 left-4 w-full md:w-[440px] bottom-[5px] z-10 flex flex-col gap-4 pointer-events-none"
      >
        {/* Main Floating Container */}
        <div className="flex flex-col h-full bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-[2rem] p-4 pointer-events-auto">

          {/* Top: Header Filter */}
          <div className="shrink-0 mb-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-lg tracking-tight">Khám phá hoạt động</h1>
            </div>

            <Header
              category={category}
              setCategory={setCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          {/* Middle: List */}
          <div className="flex-1 min-h-0 relative">
            <List 
              eventsData={filteredEvents} 
              isLoading={isLoading} 
              setSelectedEvent={setSelectedEvent}
            />
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default Page;
