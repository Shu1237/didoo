"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BaseFilter, { FilterConfig } from "@/components/base/BaseFilter";
import { BasePagination } from "@/components/base/BasePagination";
import type { Event } from "@/types/event";
import type { TicketListing } from "@/types/ticket";

interface ResaleEventListingsContentProps {
  eventId: string;
  event: Event;
  listings: TicketListing[];
}

export function ResaleEventListingsContent({
  eventId,
  event,
  listings,
}: ResaleEventListingsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageNumber = Math.max(
    1,
    Number(searchParams.get("pageNumber") ?? searchParams.get("page") ?? 1)
  );
  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const search = searchParams.get("search") ?? "";
  const quantityParam = searchParams.get("quantity") ?? "";
  const fromPriceParam = searchParams.get("fromPrice") ?? "";
  const toPriceParam = searchParams.get("toPrice") ?? "";

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const quantity = quantityParam !== "" ? Number(quantityParam) : null;
    const fromPrice = fromPriceParam !== "" ? Number(fromPriceParam) : null;
    const toPrice = toPriceParam !== "" ? Number(toPriceParam) : null;

    return listings.filter((listing) => {
      const rawListing = listing as unknown as {
        quantity?: number;
        totalQuantity?: number;
        availableQuantity?: number;
      };
      const listingQuantity = Number(
        rawListing.quantity ?? rawListing.totalQuantity ?? rawListing.availableQuantity ?? 0
      );

      const matchSearch =
        normalizedSearch === "" ||
        listing.id.toLowerCase().includes(normalizedSearch) ||
        String(listing.ticketId || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(listing.description || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchQuantity = quantity === null || listingQuantity === quantity;
      const listingPrice = Number(listing.askingPrice || 0);
      const matchFromPrice = fromPrice === null || listingPrice >= fromPrice;
      const matchToPrice = toPrice === null || listingPrice <= toPrice;
      return matchSearch && matchQuantity && matchFromPrice && matchToPrice;
    });
  }, [listings, search, quantityParam, fromPriceParam, toPriceParam]);

  const totalItems = filteredListings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(pageNumber, totalPages);
  const itemsPerPage = pageSize;
  const pagedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tìm theo listing id, ticket id, mô tả",
    },
    {
      key: "quantity",
      label: "Số lượng",
      type: "number",
      placeholder: "Nhập số lượng",
    },
    {
      key: "fromPrice",
      label: "Giá tối thiểu",
      type: "number",
      placeholder: "Giá tối thiểu",
    },
    {
      key: "toPrice",
      label: "Giá tối đa",
      type: "number",
      placeholder: "Giá tối đa",
    },
  ];

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/resale"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách sự kiện resale
        </Link>

        <Card className="mb-6 border-zinc-200">
          <CardHeader>
            <h1 className="text-2xl font-bold text-zinc-900">{event.name}</h1>
            <p className="text-sm text-zinc-600">
              Danh sách vé resale cho sự kiện này. Chọn listing để tiếp tục trade-booking.
            </p>
          </CardHeader>
        </Card>

        <BaseFilter filters={filters} />

        {pagedListings.length === 0 ? (
          <Card className="border-zinc-200">
            <CardContent className="p-8 text-center text-zinc-600">
              Không có listing phù hợp với bộ lọc hiện tại.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pagedListings.map((listing) => (
              <Card key={listing.id} className="border-zinc-200">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Listing ID: {listing.id}</p>
                    <p className="mt-1 text-lg font-bold text-zinc-900">
                      {Number(listing.askingPrice || 0).toLocaleString("vi-VN")}đ
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                      {listing.description || "Không có mô tả"}
                    </p>
                  </div>

                  <Button asChild className="h-11 rounded-xl">
                    <Link href={`/resale/${eventId}/trade-booking/${listing.id}/confirm`}>
                      <Ticket className="mr-2 h-4 w-4" />
                      Xem vé & mua ngay
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalItems > 0 && (
          <div className="mt-6">
            <BasePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => updateParam("pageNumber", String(p))}
              onPageSizeChange={(s) => updateParam("pageSize", String(s))}
            />
          </div>
        )}
      </div>
    </main>
  );
}
