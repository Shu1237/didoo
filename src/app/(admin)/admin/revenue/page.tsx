
import RevenueStats from "./_components/RevenueStats";
import RevenueChart from "./_components/RevenueChart";
import TransactionsList from "./_components/TransactionsList";
import { mockTransactions } from "@/utils/mockAdmin";

export default function AdminRevenuePage() {
    const transactions = mockTransactions;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý doanh thu</h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi doanh thu và giao dịch trên nền tảng
        </p>
      </div>

      <RevenueStats />
      <RevenueChart />
      <TransactionsList transactions={transactions}  />
    </div>
  );
}
