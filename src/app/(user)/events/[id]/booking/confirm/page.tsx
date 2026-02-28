import { Suspense } from "react"
import StatusBooking from "./_components/statusbooking"


export default async function ConfirmBookingPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = (await params)
  return (
   <Suspense fallback={<div>Loading...</div>}>
    <StatusBooking bookingId={bookingId} />
   </Suspense>
  )
}
