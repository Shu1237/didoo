"use client";

import { use } from "react";
import Loading from "@/components/loading";
import { useGetEvent, useGetEvents } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicketType";
import HeroSection from "./_components/HeroSection";
import EventInfor from "./_components/EventInfor";
import EventLocation from "./_components/EventLocation";
import EventsGrid from "../_components/EventsGrid";

export default function DetailEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: detailEventResponse, isLoading: isLoadingDetail } = useGetEvent(id);
  const detailEvent = detailEventResponse?.data;

  const { data: relatedEventsResponse } = useGetEvents({
    categoryId: detailEvent?.category?.id,
    pageSize: 6,
  });

  const eventRelated = (relatedEventsResponse?.data.items || []).filter(
    (event) => event.id !== id,
  );

  const { data: ticketTypesResponse } = useGetTicketTypes({ eventId: id });
  const ticketTypes = ticketTypesResponse?.data.items || [];

  if (isLoadingDetail) return <Loading />;

  if (!detailEvent) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
        <p className="font-bold tracking-widest uppercase">Event Not Found</p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-[-8%] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute top-1/4 right-[-8%] h-[24rem] w-[24rem] rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="relative z-10">
        <HeroSection event={detailEvent} ticketTypes={ticketTypes} />

        <div className="mx-auto w-full px-4 md:px-8 lg:px-12 xl:px-16 pb-20 space-y-16">
          <div className="max-w-7xl mx-auto space-y-16">
            <EventInfor event={detailEvent} />
            <EventLocation event={detailEvent} />
          </div>
          {eventRelated.length > 0 && (
            <div className="border-t border-slate-200/60 pt-16">
              <EventsGrid
                title="Suggested for you"
                description="Explore more events similar to this one."
                eventData={eventRelated}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
