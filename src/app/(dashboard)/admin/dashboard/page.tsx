import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { AdminDashboardContent } from "./_components/AdminDashboardContent";

export default async function AdminDashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Dashboard Tổng Quan</h1>
        <p className="mt-1 text-sm text-zinc-500">Thống kê hệ thống và hiệu suất thời gian thực</p>
      </div>

      <Suspense fallback={<SectionFallback type="cards" cards={6} />}>
        <AdminDashboardContent />
      </Suspense>
    </div>
  );
}
