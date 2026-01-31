import RevenueStats from "./_components/RevenueStats";
import RevenueChart from "./_components/RevenueChart";
import TransactionsList from "./_components/TransactionsList";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { mockTransactions } from "@/utils/mockAdmin";

export default function AdminRevenuePage() {
  const transactions = mockTransactions;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý doanh thu"
        description="Theo dõi doanh thu và giao dịch trên nền tảng"
      />
      <RevenueStats />
      <RevenueChart />
      <TransactionsList transactions={transactions} />
    </div>
  );
}
