import { Suspense } from "react";
import Loading from "@/components/loading";
import EventsList from "./_components/EventsList";
import EventsFilters from "./_components/EventsFilters";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
        <p className="text-muted-foreground mt-2">
          Xem và phê duyệt các sự kiện trên nền tảng
        </p>
      </div>

      <EventsFilters />
      
      <Suspense fallback={<Loading />}>
        <EventsList />
      </Suspense>
    </div>
  );
}
