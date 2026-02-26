"use client";

import { Suspense } from "react";
import { Ticket } from "lucide-react";
import Loading from "@/components/loading";
import TicketsList from "./_components/TicketsList";

export default function TicketsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-10%] h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8%] h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            <Ticket className="h-4 w-4" />
            My Bookings
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Ve cua toi
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Theo doi cac booking da dat, xem trang thai thanh toan va truy cap nhanh thong tin su kien.
          </p>
        </header>

        <Suspense fallback={<Loading />}>
          <TicketsList />
        </Suspense>
      </div>
    </div>
  );
}
