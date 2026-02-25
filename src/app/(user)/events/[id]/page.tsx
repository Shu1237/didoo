'use client';

import { useGetEvent, useGetEvents } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicketType";
import HeroSection from "./_components/HeroSection";
import EventInfor from "./_components/EventInfor";
import EventLocation from "./_components/EventLocation";
import ListEvent from "@/app/(user)/events/[id]/_components/ListEvent";
import ImmersiveBackground from "./_components/ImmersiveBackground";
import Loading from "@/components/loading";
import { use } from "react";

export default function DetailEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: detailEventResponse, isLoading: isLoadingDetail } = useGetEvent(id);
  const detailEvent = detailEventResponse?.data;

  const { data: relatedEventsResponse } = useGetEvents({
    categoryId: detailEvent?.category?.id,
    pageSize: 4,
  });
  const eventRelated = (relatedEventsResponse?.data.items || []).filter(e => e.id !== id);

  const { data: ticketTypesResponse } = useGetTicketTypes({ eventId: id });
  const ticketTypes = ticketTypesResponse?.data.items || [];

  if (isLoadingDetail) return <Loading />;

  if (!detailEvent) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 bg-[#050505]">
        <p>Sự kiện không tồn tại</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      <ImmersiveBackground />

      <div className="relative z-10">
        <HeroSection event={detailEvent} ticketTypes={ticketTypes} />

        <div className="max-w-[1920px] mx-auto px-6 md:px-12 space-y-32 pb-32">
          <EventInfor event={detailEvent} />
          <EventLocation event={detailEvent} />
          <ListEvent title="Có thể bạn sẽ thích" eventData={eventRelated} relatedEvent={true} />
        </div>
      </div>
    </main>
  );
}
