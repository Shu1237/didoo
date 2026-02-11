
import { organizerStats, upcomingEvents } from "@/utils/mockOrganizer";
import DashboardStats from "./_components/DashboardStats";
import RecentEvents from "./_components/RecentEvents";
import SalesChart from "./_components/SalesChart";

export default function OrganizerDashboardPage() {
  const events = upcomingEvents;
  const reportData = organizerStats;
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">Dashboard</h1>
          <p className="text-zinc-500 text-sm font-semibold">
            Track your events performance and revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Realtime</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <DashboardStats reportData={reportData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full min-h-0">
          <SalesChart />
        </div>
        <div className="lg:col-span-1 h-full min-h-0">
          <RecentEvents upcomingEvents={events} />
        </div>
      </div>
    </div>
  );
}
