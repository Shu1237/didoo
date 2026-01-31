import EventsList from "./_components/EventsList";
import EventsFilters from "./_components/EventsFilters";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { EVENTS } from "@/utils/mock";

export default function AdminEventsPage() {
  const events = EVENTS;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý sự kiện"
        description="Xem và phê duyệt các sự kiện trên nền tảng"
      />
      <EventsFilters />
      <EventsList events={events} />
    </div>
  );
}
