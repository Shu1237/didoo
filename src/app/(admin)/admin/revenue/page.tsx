import { Suspense } from "react";
import Loading from "@/components/loading";
import RevenueStats from "./_components/RevenueStats";
import RevenueChart from "./_components/RevenueChart";
import TransactionsList from "./_components/TransactionsList";

export default function AdminRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý doanh thu</h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi doanh thu và giao dịch trên nền tảng
        </p>
      </div>

      <Suspense fallback={<Loading />}>
        <RevenueStats />
        <RevenueChart />
        <TransactionsList />
      </Suspense>
    </div>
  );
}
