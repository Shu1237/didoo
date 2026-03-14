"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TradeBookingSuccessPage({
  params,
}: {
  params: Promise<{ id: string; listingId: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Mua vé bán lại thành công</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Giao dịch của bạn đã hoàn tất. Vé sẽ được cập nhật trong khu vực vé của tôi.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button asChild className="rounded-xl">
            <Link href="/user/dashboard/tickets">Xem vé của tôi</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/resale/${id}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Quay lại vé bán lại
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
