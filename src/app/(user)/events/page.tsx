import { Suspense } from "react";
import EventsLoading from "./loading";
import EventsLayout from "./layout";
import EventListSection from "./_components/eventListSection";
import CategoryListSection from "./_components/categoryListSection";






export default async function EventsPage() {
   
  

  return (
    <EventsLayout>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoryListSection />
      </Suspense>
      <Suspense fallback={<div>Loading events...</div>}>
        <EventListSection />
      </Suspense>
    </EventsLayout>
  );
}
