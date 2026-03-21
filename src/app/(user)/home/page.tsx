"use client";

import { useGetEvents, useGetCategories, useGetOrganizers } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { EventStatus, OrganizerStatus } from "@/utils/enum";

import HeroTextSection from "./_components/HeroTextSection";
import GroupsSection from "./_components/GroupsSection";
import BannerTextSection from "./_components/BannerTextSection";
import ScheduleSection from "./_components/ScheduleSection";
import CtaSection from "./_components/CtaSection";

export default function Home() {
  const { data: openedEventsResponse, isLoading: isOpenedLoading, isError: isOpenedError } = useGetEvents({
    pageSize: 12,
    hasCategory: true,
    hasOrganizer: true,
    isDeleted: false,
    status: EventStatus.OPENED,
  });
  const { data: publishedEventsResponse, isLoading: isPublishedLoading, isError: isPublishedError } = useGetEvents({
    pageSize: 12,
    hasCategory: true,
    hasOrganizer: true,
    isDeleted: false,
    status: EventStatus.PUBLISHED,
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories({
    pageSize: 20,
  });
  const { data: organizersResponse, isLoading: isOrganizersLoading } = useGetOrganizers({
    pageSize: 8,status: OrganizerStatus.VERIFIED
  });

  if (isOpenedLoading || isPublishedLoading || isCategoriesLoading || isOrganizersLoading) return <Loading />;
  if ((isOpenedError && isPublishedError) || (!openedEventsResponse && !publishedEventsResponse)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </div>
    );
  }

  const openedEvents = openedEventsResponse?.data.items || [];
  const publishedEvents = publishedEventsResponse?.data.items || [];
  const organizers = organizersResponse?.data.items || [];
  
  const heroEvents = openedEvents.length > 0 ? openedEvents : publishedEvents;
  const heroEvent = heroEvents[0] || null;

  return (
    <div 
      className="bg-[#0a0a0a] text-zinc-100 min-h-screen selection:bg-white selection:text-black"
      style={{ fontFamily: "var(--font-playfair), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
    >
      <HeroTextSection event={heroEvent} />
      <GroupsSection events={openedEvents.slice(0, 3)} />
      <BannerTextSection />
      <ScheduleSection events={publishedEvents} />
      <CtaSection />
    </div>
  );
}
