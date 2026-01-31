import { adminStats, recentActivities } from "@/utils/mockAdmin";
import TotalBalanceCard from "./_components/TotalBalanceCard";
import PendingApprovalsWidget from "./_components/PendingApprovalsWidget";
import RecentContactsCard from "./_components/RecentContactsCard";
import StatWithChartCard from "./_components/StatWithChartCard";

export default function AdminDashboardPage() {
  const totalRevenue = adminStats.find((s) => s.title === "Tổng doanh thu");

  return (
    <div className="h-full w-full max-w-[1800px] mx-auto flex flex-col overflow-hidden">
      {/* Grid container phải là h-full và min-h-0 */}
      <div className="grid grid-cols-12 gap-6 h-full min-h-0">

        {/* CỘT TRÁI */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
          <div className="shrink-0 h-[280px]">
            <TotalBalanceCard
              value={totalRevenue?.value || "0"}
              label="Tổng số dư"
              sublabel="Số dư khả dụng"
            />
          </div>
          <div className="flex-1 min-h-0">
            <RecentContactsCard activities={recentActivities} />
          </div>
        </div>

        {/* CỘT GIỮA - Widget Phê Duyệt */}
        <div className="col-span-12 lg:col-span-6 h-full min-h-0">
          <PendingApprovalsWidget />
        </div>

        {/* CỘT PHẢI */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full min-h-0 pb-2">
          <div className="flex-1 min-h-0">
            <StatWithChartCard title="Tổng vé bán ra" value="89.2k" change="+14%" trend="up" data={[]} />
          </div>
          <div className="flex-1 min-h-0">
            <StatWithChartCard title="Tổng chi trả" value="1.8 tỷ" change="-8%" trend="down" data={[]} barColor="gold" />
          </div>
        </div>

      </div>
    </div>
  );
}