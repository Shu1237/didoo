
import { organizerStats, upcomingEvents } from "@/utils/mockOrganizer";
import DashboardStats from "./_components/DashboardStats";
import RecentEvents from "./_components/RecentEvents";
import SalesChart from "./_components/SalesChart";

export default function OrganizerDashboardPage() {
   const events = upcomingEvents;
   const reportData = organizerStats;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan về sự kiện và doanh thu của bạn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">Dữ liệu thời gian thực</span>
        </div>
      </div>

      <DashboardStats reportData={reportData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SalesChart />
        <RecentEvents upcomingEvents={events} />
      </div>
    </div>
  );
}
