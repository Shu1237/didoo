'use client';


import HeroSection from "./_components/HeroSection";
import { CATEGORIES, EVENTS } from "@/utils/mock";
import { SearchFilter } from "./_components/SearchFilter";
import { AboutSection } from "./_components/AboutSection";
import { ForYouEvents } from "./_components/ForYouEvents";
import { MonthOverview } from "./_components/MonthOverview";
import { SpecialEvents } from "./_components/SpecialEvents";
import { TrendingEvents } from "./_components/TrendingEvents";
import { WeekendEvents } from "./_components/WeekendEvents";


export default function Home() {

  const upcomingEvents = EVENTS;
  const popularEvents = [...EVENTS].reverse();
  const categories = CATEGORIES;

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection />

      <SearchFilter />

      <AboutSection />

      <div className="container mx-auto px-4 space-y-12">
        <SpecialEvents events={upcomingEvents} />
        <TrendingEvents events={popularEvents} />
        <ForYouEvents events={upcomingEvents} categories={categories} />
        <WeekendEvents events={upcomingEvents} />
        <MonthOverview />
      </div>
    </div>
  );
}