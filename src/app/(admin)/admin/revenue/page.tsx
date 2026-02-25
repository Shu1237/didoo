import RevenueStats from "./_components/RevenueStats";
import RevenueChart from "./_components/RevenueChart";
import TransactionsList from "./_components/TransactionsList";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { mockTransactions } from "@/utils/mockAdmin";

export default function AdminRevenuePage() {
  const transactions = mockTransactions;
  return (
    <div className="flex-1 flex flex-col min-h-0 w-full h-full">
      <div className="flex-none pb-6">
        <AdminPageHeader
          title="Quản lý doanh thu"
          description="Theo dõi doanh thu và giao dịch trên nền tảng"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent space-y-6">
        <RevenueStats />
        <RevenueChart />
        <TransactionsList transactions={transactions} />
      </div>
    </div>
  );
}
