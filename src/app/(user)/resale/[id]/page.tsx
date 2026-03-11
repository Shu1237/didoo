"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketListings } from "@/hooks/useTicket";
import { TicketListingStatus } from "@/utils/enum";
import { ResaleEventListingsContent } from "./_components/ResaleEventListingsContent";

export default function ResaleEventListingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const listingQuery = useMemo(
    () => ({
      eventId: id,
      pageNumber: 1,
      pageSize: 500,
      status: TicketListingStatus.ACTIVE,
      isDeleted: false,
      isDescending: true,
    }),
    [id]
  );

  const { data: eventRes, isLoading: isEventLoading } = useGetEvent(id);
  const { data: listingsRes, isLoading: isListingsLoading } = useGetTicketListings(
    listingQuery,
    { enabled: !!id }
  );

  const event = eventRes?.data;
  const listings = listingsRes?.data?.items ?? [];

  if (isEventLoading || isListingsLoading) return <Loading />;

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy sự kiện.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/resale">Quay lại vé bán lại</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <ResaleEventListingsContent eventId={id} event={event} listings={listings} />
  );
}
