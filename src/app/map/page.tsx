'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from './_components/Header';
import List from './_components/List';
import Map from './_components/Map';
import { MapPin, Satellite } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS } from '@/utils/mock';
import { Event } from '../../types/base';
import { Button } from '@/components/ui/button';

// 1. Component Mũi tên thuần (Đã sửa hướng và xóa khung)
const AnimatedDoubleArrow = ({ direction, isAnimating }: { direction: 'left' | 'right', isAnimating?: boolean }) => (
  <motion.svg
    width="22"
    height="22"
    viewBox="0 0 511.801 511.801"
    className="text-primary drop-shadow-sm"
    // SVG gốc hướng lên. Trái: -90deg, Phải: 90deg
    animate={{
      rotate: direction === 'left' ? -90 : 90,
      x: isAnimating ? (direction === 'left' ? [0, -4, 0] : [0, 4, 0]) : 0
    }}
    transition={{
      x: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
      rotate: { duration: 0 }
    }}
  >
    <g fill="currentColor">
      <path d="M263.535,248.453c-4.16-4.16-10.88-4.16-15.04,0L3.054,493.787c-4.053,4.267-3.947,10.987,0.213,15.04 c4.16,3.947,10.667,3.947,14.827,0l237.867-237.76l237.76,237.76c4.267,4.053,10.987,3.947,15.04-0.213 c3.947-4.16,3.947-10.667,0-14.827L263.535,248.453z"></path>
      <path d="M18.201,263.493l237.76-237.76l237.76,237.76c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827 L263.535,3.12c-4.16-4.16-10.88-4.16-15.04,0L3.054,248.453c-4.053,4.267-3.947,10.987,0.213,15.04 C7.534,267.547,14.041,267.547,18.201,263.493z"></path>
    </g>
  </motion.svg>
);

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        setTimeout(() => setIsLoading(false), 1000);
      }, () => {
        setCoordinates({ lat: 10.776889, lng: 106.700806 });
        setIsLoading(false);
      });
    }
  }, []);

  const toggleMapStyle = () => {
    setMapStyleType(prev => prev === mapStyle.normalStyle ? mapStyle.satelliteStyle : mapStyle.normalStyle);
  }

  // Filter and sort events using useMemo
  const filteredEvents = useMemo(() => {
    let filtered = EVENTS;

    // Filter by category
    if (category) {
      filtered = filtered.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
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

    return filtered;
  }, [category, searchQuery, sortBy, coordinates?.lat, coordinates?.lng]);

  return (
    <div className="relative w-full h-full overflow-hidden font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <Map coordinates={coordinates} events={EVENTS} isLoading={isLoading} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} mapStyle={mapStyleType} />
      </div>

      {/* Sidebar Panel */}
      <motion.div
        initial={{ x: -460 }}
        animate={{ x: isSidebarOpen ? 0 : -460 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="absolute top-24 left-4 w-[90%] md:w-[420px] bottom-4 z-10 pointer-events-none"
      >
        <div className="relative flex flex-col h-full bg-background/60 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2rem] p-5 pointer-events-auto">
          <div className="flex items-center gap-2 mb-6 px-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Khám phá hoạt động</h1>
          </div>

          <Header
            category={category} setCategory={setCategory}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            sortBy={sortBy} setSortBy={setSortBy}
          />

          <div className="flex-1 min-h-0 relative mt-4">
            <List eventsData={filteredEvents} isLoading={isLoading} setSelectedEvent={setSelectedEvent} />
          </div>

          {/* Nút Đóng: Mũi tên chỉ sang trái, đặt sát cạnh phải của sidebar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-3 cursor-pointer p-2 hover:scale-125 transition-transform"
            onClick={() => setIsSidebarOpen(false)}
          >
            <AnimatedDoubleArrow direction="left" isAnimating={true} />
          </div>
        </div>
      </motion.div>

      {/* Nút Mở: Sát mép màn hình khi sidebar đóng */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="absolute top-1/2 -translate-y-1/2 left-0 z-20 pointer-events-auto flex items-center"
          >
            <div
              className="bg-background/80 backdrop-blur-md p-3 pr-4 rounded-r-2xl border border-l-0 border-white/20 cursor-pointer shadow-lg group"
              onClick={() => setIsSidebarOpen(true)}
            >
              <AnimatedDoubleArrow direction="right" isAnimating={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Style Toggle */}
      <div className="absolute bottom-6 right-6 z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleMapStyle}
          className="rounded-full shadow-xl bg-white/90 dark:bg-card/90 hover:scale-110 transition-transform"
        >
          {mapStyleType === mapStyle.satelliteStyle ? <MapPin className="w-5 h-5 text-primary" /> : <Satellite className="w-5 h-5 text-primary" />}
        </Button>
      </div>
    </div>
  );
}

export default Page;