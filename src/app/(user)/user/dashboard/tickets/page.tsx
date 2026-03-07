"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import TicketsList from "@/app/(user)/user/dashboard/tickets/_components/TicketsList";

export default function DashboardTicketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Vé của tôi</h1>
        <p className="mt-1 text-zinc-600">Quản lý vé đã đặt</p>
      </div>

      <Suspense fallback={<Loading />}>
        <TicketsList />
      </Suspense>
    </div>
  );
}
