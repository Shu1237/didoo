import { Suspense } from "react";
import Loading from "@/components/loading";
import EventsList from "./_components/EventsList";
import CreateEventButton from "./_components/CreateEventButton";

export default function OrganizerEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
          <p className="text-muted-foreground mt-2">
            Tạo và quản lý các sự kiện của bạn
          </p>
        </div>
        <CreateEventButton />
      </div>

      <Suspense fallback={<Loading />}>
        <EventsList />
      </Suspense>
    </div>
  );
}
