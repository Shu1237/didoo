import { Suspense } from "react"
import { BookingLayout } from "./layout"
import TicketTypeListSection from "./_components/ticketTypeSection"
export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params)
  
  return (
    <BookingLayout>
      <Suspense fallback={<div>Loading...</div>}>
      <TicketTypeListSection id={id} />
      </Suspense>
    </BookingLayout>
  )

}
