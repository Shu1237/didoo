
import { organizerStats, upcomingEvents } from "@/utils/mockOrganizer";
import DashboardStats from "./_components/DashboardStats";
import RecentEvents from "./_components/RecentEvents";
import SalesChart from "./_components/SalesChart";

export default function OrganizerDashboardPage() {
  const events = upcomingEvents;
  const reportData = organizerStats;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tổng quan sự kiện</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý sự kiện và theo dõi doanh thu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium">Cập nhật realtime</span>
          </div>
        </div>
      </div>

      <DashboardStats reportData={reportData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <SalesChart />
        </div>
        <div className="lg:col-span-1 h-full">
          <RecentEvents upcomingEvents={events} />
        </div>
      </div>
    </div>
  );
}
