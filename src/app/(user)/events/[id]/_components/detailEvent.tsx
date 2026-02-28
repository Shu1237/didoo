import { eventRequest } from "@/apiRequest/event";

export default async function DetailEventSection({ id }: { id: string }) {
    const res = await eventRequest.getById(id)  
    console.log(res)
    return (
        <div>
            <h1>DetailEventSection</h1>
        </div>
    )
}