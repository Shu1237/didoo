'use client';

import HeroSection from "@/app/(user)/home/_components/HeroSection";
import { SpecialEvents } from "@/app/(user)/home/_components/SpecialEvents";
import { AboutSection } from "@/app/(user)/home/_components/AboutSection";
import { TrendingEvents } from "@/app/(user)/home/_components/TrendingEvents";
import { MonthOverview } from "@/app/(user)/home/_components/MonthOverview";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetOrganizers } from "@/hooks/useOrganizer";
import Loading from "@/components/loading";
import CategorySection from "./_components/CategorySection";
import SearchFilter from "./_components/SearchFilter";

export default function Home() {
  const { data: eventsResponse, isLoading: isEventsLoading, isError: isEventsError } = useGetEvents({
    pageSize: 12,
    isDescending: true,
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
  const { data: organizersResponse, isLoading: isOrganizersLoading } = useGetOrganizers({
    pageSize: 8,
    isDescending: true,
  });

  if (isEventsLoading || isCategoriesLoading || isOrganizersLoading) return <Loading />;
  if (isEventsError || !eventsResponse) return <div className="min-h-screen flex items-center justify-center text-slate-500">Failed to load events.</div>;

  const events = eventsResponse.data.items;
  const categories = categoriesResponse?.data.items || [];
  const organizers = organizersResponse?.data.items || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#DA4167] selection:text-white">
      <HeroSection events={events.slice(0, 5)} />

      <SearchFilter categories={categories} />

      {/* Category Selection */}
      <CategorySection categories={categories} />

      {/* 1. Grid Section: DAYS TO UP LEVEL... */}
      <SpecialEvents events={events} />

      {/* 2. Split Feature: THE EVENT FOR EXPERIENCED... */}
      <AboutSection categories={categories} />

      {/* 3. Keynotes: FEATURING KEYNOTES... */}
      <TrendingEvents organizers={organizers} />

      {/* 4. Venue: WHERE CREATIVITY MEETS... */}
      <MonthOverview events={events} />
    </div>
  );
}