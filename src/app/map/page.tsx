'use client';

import { useState, useEffect } from 'react';
import Header from './_components/Header';
import List from './_components/List';
import Map from './_components/Map';
import { mapEvents } from '@/utils/mock';
import { EventCardData } from '@/utils/type';


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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map - Full Screen */}
      <Map coordinates={coordinates} events={filteredEvents} isLoading={isLoading} selectedEvent={selectedEvent} />

      {/* Header - Absolute Top Left */}
      <div className="absolute top-4 left-4 w-full lg:w-[35%] z-20">
        <Header 
          category={category}
          setCategory={setCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {/* List - Absolute Below Header */}
      <div className="absolute top-[180px] left-4 bottom-4 w-full lg:w-[35%] z-10">
        <List eventsData={filteredEvents}  isLoading={isLoading}  setSelectedEvent={setSelectedEvent} />
      </div>
    </div>
  );
}

export default Page;
