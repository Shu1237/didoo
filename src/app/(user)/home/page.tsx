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

      {/* 1. Discovery Bar: Search & Categories */}
      <SearchFilter categories={categories} />
      <CategorySection categories={categories} />

      {/* 2. Editorial Highlights */}
      <SpecialEvents events={events} />

      {/* 3. The Didoo Experience */}
      <AboutSection categories={categories} />

      {/* 4. Curated Organizers Marquee */}
      <TrendingEvents organizers={organizers} />

      {/* 5. More to Discover */}
      <MonthOverview events={events} />
    </div>
  );
}