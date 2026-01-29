
import { adminStats, recentActivities } from "@/utils/mockAdmin";
import AdminStats from "./_components/AdminStats";
import RecentActivity from "./_components/RecentActivity";

export default function AdminDashboardPage() {
  const reports = adminStats;
  const activities = recentActivities;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tổng quan</h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng trở lại! Dưới đây là báo cáo của bạn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Trực tuyến</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AdminStats adminStats={reports} />
        <RecentActivity recentActivities={activities} />
      </div>
    </div>
  );
}
