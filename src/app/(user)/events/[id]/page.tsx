
import HeroSection from "./_components/HeroSection";
import EventInfor from "./_components/EventInfor";
import EventLocation from "./_components/EventLocation";
import ListEvent from "@/app/(user)/events/[id]/_components/ListEvent";
import { EVENTS } from "@/utils/mock";
import ImmersiveBackground from "./_components/ImmersiveBackground";

export default async function DetailEventPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const detailEvent = EVENTS.find((event) => event.id.toString() === id);

  const eventRelated = EVENTS.filter((event) =>
    event.id.toString() !== id && event.category === detailEvent?.category
  );

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
        <HeroSection event={detailEvent} />

        <div className="max-w-[1920px] mx-auto px-6 md:px-12 space-y-32 pb-32">
          <EventInfor event={detailEvent} />
          <EventLocation event={detailEvent} />
          <ListEvent title="Có thể bạn sẽ thích" eventData={eventRelated} relatedEvent={true} />
        </div>
      </div>
    </main>
  );
}
