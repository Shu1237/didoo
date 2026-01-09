
import EventsList from "./_components/EventsList";
import EventsFilters from "./_components/EventsFilters";
import { EVENTS } from "@/utils/mock";

export default function AdminEventsPage() {
  const events = EVENTS;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
        <p className="text-muted-foreground mt-2">
          Xem và phê duyệt các sự kiện trên nền tảng
        </p>
      </div>

      <EventsFilters />
      
      <EventsList events={events} />
    </div>
  );
}
