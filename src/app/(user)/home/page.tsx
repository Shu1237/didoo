'use client';

import HeroSection from "./_components/HeroSection";
import { EVENTS } from "@/utils/mock";
import { SpecialEvents } from "./_components/SpecialEvents";
import { AboutSection } from "./_components/AboutSection";
import { TrendingEvents } from "./_components/TrendingEvents";
import { MonthOverview } from "./_components/MonthOverview";

export default function Home() {
  const upcomingEvents = EVENTS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#DA4167] selection:text-white">
      <HeroSection events={upcomingEvents.slice(0, 5)} />

      {/* 1. Grid Section: DAYS TO UP LEVEL... */}
      <SpecialEvents events={upcomingEvents} />

      {/* 2. Split Feature: THE EVENT FOR EXPERIENCED... */}
      <AboutSection />

      {/* 3. Keynotes: FEATURING KEYNOTES... */}
      <TrendingEvents events={upcomingEvents} />

      {/* 4. Venue: WHERE CREATIVITY MEETS... */}
      <MonthOverview />
    </div>
  );
}