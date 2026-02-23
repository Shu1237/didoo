'use client';

import HeroSection from "@/app/(user)/home/_components/HeroSection";
import { SpecialEvents } from "@/app/(user)/home/_components/SpecialEvents";
import { AboutSection } from "@/app/(user)/home/_components/AboutSection";
import { TrendingEvents } from "@/app/(user)/home/_components/TrendingEvents";
import { MonthOverview } from "@/app/(user)/home/_components/MonthOverview";
import { useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";

export default function Home() {
  const { data: eventsResponse, isLoading, isError } = useGetEvents({
    pageSize: 12,
    isDescending: true,
  });

  if (isLoading) return <Loading />;
  if (isError || !eventsResponse) return <div className="min-h-screen flex items-center justify-center text-slate-500">Failed to load events.</div>;

  const events = eventsResponse.data.items;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#DA4167] selection:text-white">
      <HeroSection events={events.slice(0, 5)} />

      {/* 1. Grid Section: DAYS TO UP LEVEL... */}
      <SpecialEvents events={events} />

      {/* 2. Split Feature: THE EVENT FOR EXPERIENCED... */}
      <AboutSection />

      {/* 3. Keynotes: FEATURING KEYNOTES... */}
      <TrendingEvents events={events} />

      {/* 4. Venue: WHERE CREATIVITY MEETS... */}
      <MonthOverview events={events} />
    </div>
  );
}