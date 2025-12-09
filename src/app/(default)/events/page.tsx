import { nowShowingEvents } from "@/utils/mock";
import SearchFilter from "../home/_components/SearchFilter";
import ListEvent from "./_components/ListEvent";





export default function EventsPage() {

    const eventNowShowing = nowShowingEvents;
    return (
        <>
           <div className="bg-[#E3E3E3] p-4 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto mb-8">
             <SearchFilter />
           </div>

            <ListEvent title="Đang Diễn Ra" eventData={eventNowShowing} />
        </>
    )
}
