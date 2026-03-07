import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { OrganizerDashboardContent } from "./_components/OrganizerDashboardContent";

export default function OrganizerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Bảng điều khiển</h1>
        <p className="mt-1 text-sm text-zinc-500">Tổng quan sự kiện và doanh thu</p>
      </div>

      <Suspense fallback={<SectionFallback type="cards" cards={4} />}>
        <OrganizerDashboardContent />
      </Suspense>
    </div>
  );
}
