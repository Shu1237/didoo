"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TradeBookingNotFoundProps {
  eventId: string;
}

export function TradeBookingNotFound({ eventId }: TradeBookingNotFoundProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-zinc-600">Không tìm thấy thông tin vé.</p>
        <Button asChild className="mt-4 rounded-xl">
          <Link href={`/resale/${eventId}`}>Quay lại danh sách vé</Link>
        </Button>
      </div>
    </main>
  );
}
