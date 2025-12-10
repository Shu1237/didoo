import { DetailEventMock, nowShowingEvents } from "@/utils/mock";
import HeroSection from "./_components/HeroSection";
import EventInfor from "./_components/EventInfor";
import ListEvent from "../_components/ListEvent";



export default async function DetailEventPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  console.log("Event ID:", id);
  const eventNowShowing = nowShowingEvents;
  const detailEvent = DetailEventMock;
  return (
    <>
      <HeroSection data={detailEvent} />

      <EventInfor />

      <ListEvent title="Bạn có thể thích" eventData={eventNowShowing} />
    </>
  )
}
