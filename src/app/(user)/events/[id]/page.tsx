// import { DetailEventMock, nowShowingEvents } from "@/utils/mock";
import HeroSection from "./_components/HeroSection";
import EventInfor from "./_components/EventInfor";
import ListEvent from "../_components/ListEvent";
import { EVENTS } from "@/utils/mock";





export default async function DetailEventPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  // console.log("Event ID:", id);
  const eventNowShowing = EVENTS;
  const detailEvent = EVENTS.find((event) => event.id.toString() === id);
  if (!detailEvent) {
    return <div className="flex items-center justify-center h-screen text-gray-500">
      <p>Sự kiện không tồn tại</p>
    </div>
  }
  return (
    <>
      <HeroSection event={detailEvent} />

      <EventInfor />

      <ListEvent title="Bạn có thể thích" eventData={eventNowShowing} />
    </>
  )
}
