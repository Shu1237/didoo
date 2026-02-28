
import { eventRequest } from "@/apiRequest/event";


export default async function EventListSection() {
  const res = await eventRequest.getList({pageNumber: 1, pageSize: 100,isDescending: true})
  console.log(res)
  return (
    <div>
      <h1>EventListSection</h1>
    </div>
  )
}