"use client";

import { recentActivities } from "@/utils/mockAdmin";
import TotalBalanceCard from "./_components/TotalBalanceCard";
import PendingApprovalsWidget from "./_components/PendingApprovalsWidget";
import RecentContactsCard from "./_components/RecentContactsCard";
import StatWithChartCard from "./_components/StatWithChartCard";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetUsers } from "@/hooks/useUser";
import { EventStatus } from "@/utils/enum";
import Loading from "@/components/loading";

export default function AdminDashboardPage() {
  const { data: usersRes, isLoading: isUsersLoading } = useGetUsers({ pageSize: 1 });
  const { data: eventsRes, isLoading: isEventsLoading } = useGetEvents({
    status: EventStatus.PUBLISHED,
    pageSize: 1
  });

  if (isUsersLoading || isEventsLoading) return <Loading />;

  const totalUsers = usersRes?.data?.totalItems || 0;
  const activeEvents = eventsRes?.data?.totalItems || 0;

  return (
    <div className="h-full w-full max-w-[1800px] mx-auto flex flex-col overflow-hidden">
      <div className="grid grid-cols-12 gap-6 h-full min-h-0">

        {/* CỘT TRÁI */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
          <div className="shrink-0 h-[280px]">
            <TotalBalanceCard
              value="2.4 tỷ"
              label="Tổng doanh thu"
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
            <StatWithChartCard
              title="Người dùng hệ thống"
              value={totalUsers.toLocaleString()}
              change="+12%"
              trend="up"
              data={[
                { name: 'T1', value: 400 },
                { name: 'T2', value: 300 },
                { name: 'T3', value: 500 },
                { name: 'T4', value: 200 },
                { name: 'T5', value: 600 },
              ]}
            />
          </div>
          <div className="flex-1 min-h-0">
            <StatWithChartCard
              title="Sự kiện đang Active"
              value={activeEvents.toLocaleString()}
              change="+24%"
              trend="up"
              data={[
                { name: 'W1', value: 20 },
                { name: 'W2', value: 35 },
                { name: 'W3', value: 25 },
                { name: 'W4', value: 45 },
                { name: 'W5', value: 30 },
              ]}
              barColor="gold"
            />
          </div>
        </div>

      </div>
    </div>
  );
}