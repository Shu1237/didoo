'use client';

import { useState, useEffect } from 'react';
import Header from './_components/Header';
import List from './_components/List';
import Map from './_components/Map';
import { mapEvents } from '@/utils/mock';
import { EventCardData } from '@/utils/type';
import { motion } from 'framer-motion';


const Page = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredEvents, setFilteredEvents] = useState(mapEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'distance' | 'price'>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventCardData | null>(null);
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

  // Filter and sort events
  useEffect(() => {
    let filtered = mapEvents;

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
  console.log(selectedEvent)
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Map - Full Screen */}
      <div className="absolute inset-0 z-0">
        <Map coordinates={coordinates} events={filteredEvents} isLoading={isLoading} selectedEvent={selectedEvent} />
      </div>

      {/* Sidebar Panel - Unified */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-4 left-4 h-[calc(100vh-2rem)] w-full lg:w-[30%] min-w-[320px] flex flex-col gap-4 z-10 pointer-events-none"
      >
        {/* Header Section - Pointer events enabled for interaction */}
        <div className="pointer-events-auto">
          <Header
            category={category}
            setCategory={setCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* List Section - Pointer events enabled for interaction */}
        <div className="flex-1 min-h-0 pointer-events-auto">
          <List eventsData={filteredEvents} isLoading={isLoading} setSelectedEvent={setSelectedEvent} />
        </div>

      </motion.div>
    </div>
  );
}

export default Page;
