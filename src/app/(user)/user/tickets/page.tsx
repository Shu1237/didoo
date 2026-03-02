"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import TicketsList from "./_components/TicketsList";

export default function TicketsPage() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <Suspense fallback={<Loading />}>
        <TicketsList />
      </Suspense>
    </div>
  );
}
