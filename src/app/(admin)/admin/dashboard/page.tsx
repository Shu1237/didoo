import { Suspense } from "react";
import Loading from "@/components/loading";
import AdminStats from "./_components/AdminStats";
import RecentActivity from "./_components/RecentActivity";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan về hoạt động của hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">Updates live</span>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <AdminStats />
        <RecentActivity />
      </Suspense>
    </div>
  );
}
