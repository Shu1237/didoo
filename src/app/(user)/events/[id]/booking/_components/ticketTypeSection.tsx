import { ticketTypeRequest } from "@/apiRequest/ticketType";


export default async function TicketTypeSection({ id }: { id: string }) {
  const res = await ticketTypeRequest.getList({ eventId: id, pageNumber: 1, pageSize: 100, isDescending: true });
  console.log(res);
  return (
    <div>
      <h1>TicketTypeSection</h1>
    </div>
  );
}