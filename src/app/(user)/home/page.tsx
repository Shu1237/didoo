"use client";

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
import BecomeOrganizerSection from "./_components/BecomeOrganizerSection";

export default function Home() {
  const { data: eventsResponse, isLoading: isEventsLoading, isError: isEventsError } = useGetEvents({
    pageSize: 12,
    hasCategory: true,
    hasOrganizer: true,
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories({
    pageSize: 20,
  });
  const { data: organizersResponse, isLoading: isOrganizersLoading } = useGetOrganizers({
    pageSize: 8,
  });

  if (isEventsLoading || isCategoriesLoading || isOrganizersLoading) return <Loading />;
  if (isEventsError || !eventsResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </div>
    );
  }

  const events = eventsResponse.data.items;
  const categories = categoriesResponse?.data.items || [];
  const organizers = organizersResponse?.data.items || [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HeroSection events={events.slice(0, 5)} />

      <CategorySection categories={categories} />

      <SpecialEvents events={events} />
      <AboutSection categories={categories} />
      <TrendingEvents organizers={organizers} />
      <MonthOverview events={events} />
      <BecomeOrganizerSection />
    </div>
  );
}
