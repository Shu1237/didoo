import { bookingRequest } from "@/apiRequest/booking"

export default async function StatusBooking({ bookingId }: { bookingId: string }) {
    const res = await bookingRequest.getById(bookingId);
    console.log(res);
    return (
        <div>
            <h1>StatusBooking</h1>
        </div>
    )
}