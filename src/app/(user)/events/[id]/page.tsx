// import { DetailEventMock, nowShowingEvents } from "@/utils/mock";
import HeroSection from "./_components/HeroSection";
import EventInfor from "./_components/EventInfor";
import ListEvent from "@/app/(user)/events/[id]/_components/ListEvent";
import { EVENTS } from "@/utils/mock";

export default async function DetailEventPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  const eventNowShowing = EVENTS;
  const detailEvent = EVENTS.find((event) => event.id.toString() === id);
  // event lien quan 
  const eventRelated = EVENTS.filter((event) => event.id.toString() !== id && event.category === detailEvent?.category);
  if (!detailEvent) {
    return <div className="flex items-center justify-center h-screen text-gray-500">
      <p>Sự kiện không tồn tại</p>
    </div>
  }
  return (
    <>
      <HeroSection event={detailEvent} />

      <EventInfor />

      <ListEvent title="Có thể bạn sẽ thích" eventData={eventRelated} relatedEvent={true} />
    </>
  )
}
