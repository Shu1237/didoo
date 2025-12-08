import { comingSoonEvents, mapEvents, MockImage, nowShowingEvents } from "@/utils/mock";
import HeroSection from "./_components/Hero Section";
import SearchFilter from "./_components/SearchFilter";
import ListEvent from "./_components/ListEvent";
import MapEvent from "./_components/MapEvent";


export default function Home() {
  const image = MockImage;
  const eventNowShowing = nowShowingEvents;
  const eventComingSoon = comingSoonEvents;
  const eventMapData = mapEvents;
  return (
    <div>
      <div className="relative">
        <HeroSection ImageData={image} />
        <div className=" mt-18 absolute top-[600px] bottom-[-200px] left-0 right-0 bg-white p-4 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto ">
          <SearchFilter />
        </div>

      </div>
     
      <MapEvent eventData={eventMapData} />

      <ListEvent title="Đang Diễn Ra" eventData={eventNowShowing} />
      <ListEvent title="Sắp Diễn Ra" eventData={eventComingSoon} />
    </div>

  );
}
