import EventsLayout from "../layout"
import { Suspense } from "react"
import DetailEventSection from "./_components/detailEvent"


export default async function DetailEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params)
  return (
    <EventsLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <DetailEventSection id={id} />
      </Suspense>

    </EventsLayout>
  )
}