"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Receipt,
  ShoppingBag,
  Ticket,
  UserRound,
  XCircle,
} from "lucide-react";
import Loading from "@/components/loading";
import { useGetMe } from "@/hooks/useAuth";
import { useGetResaleTransactions } from "@/hooks/useBooking";
import { useGetTicketListings, useTicketListing } from "@/hooks/useTicket";
import { useGetEvent } from "@/hooks/useEvent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TicketListing } from "@/types/ticket";
import type { ResaleTransaction } from "@/types/booking";
import { TicketListingStatus } from "@/utils/enum";

function getListingStatusLabel(status?: number | string | null) {
  const s = Number(status ?? 0);
  if (s === TicketListingStatus.ACTIVE) return { label: "Đang bán", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" };
  if (s === TicketListingStatus.SOLD) return { label: "Đã bán", className: "bg-blue-500/10 text-blue-700 border-blue-200" };
  if (s === TicketListingStatus.CANCELLED) return { label: "Đã hủy", className: "bg-rose-500/10 text-rose-700 border-rose-200" };
  return { label: "Chờ duyệt", className: "bg-amber-500/10 text-amber-700 border-amber-200" };
}

function ListingCard({
  listing,
  sellerUserId,
}: {
  listing: TicketListing;
  sellerUserId: string;
}) {
  const statusView = getListingStatusLabel(listing.status);
  const { cancel } = useTicketListing();
  const eventId = (listing as { event?: { id?: string }; eventId?: string })?.event?.id
    || (listing as { eventId?: string })?.eventId
    || "";
  const { data: eventRes } = useGetEvent(eventId);

  const event = eventRes?.data;

  const canCancel = () => {
    if (!event?.startTime || !event?.endTime) return true;
    const now = Date.now();
    const end = new Date(event.endTime).getTime();
    return now < end;
  };

  const onCancel = async () => {
    if (!listing?.id) return;
    if (!canCancel()) {
      toast.error("Không thể hủy vé sau khi sự kiện kết thúc.");
      return;
    }
    try {
      await cancel.mutateAsync({ id: listing.id, body: { SellerUserId: sellerUserId } });
      toast.success("Hủy bán vé thành công.");
    } catch {
      toast.error("Không thể hủy vé bán lại.");
    }
  };

  const isActive = listing.status === TicketListingStatus.ACTIVE;

  return (
    <Card className="border-zinc-200">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Listing ID</p>
            <p className="font-mono text-sm font-semibold text-zinc-900 break-all">{listing.id}</p>
          </div>
          <Badge variant="outline" className={statusView.className}>
            {statusView.label}
          </Badge>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Sự kiện</p>
            <p className="mt-1 text-sm font-medium text-zinc-900 line-clamp-1">
              {event?.name || "Đang tải..."}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Giá đăng</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {Number(listing.askingPrice || 0).toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>

        {listing.description ? (
          <p className="text-sm text-zinc-600 line-clamp-2">{listing.description}</p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs text-zinc-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(listing.createdAt).toLocaleString("vi-VN")}
          </p>
          <div className="flex items-center gap-2">
            {eventId && (
              <Button asChild size="sm" variant="outline" className="rounded-lg">
                <Link href={`/resale/${eventId}/trade-booking/${listing.id}`}>
                  Xem chi tiết
                </Link>
              </Button>
            )}
            {isActive && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onCancel}
                disabled={cancel.isPending}
                className="rounded-lg"
              >
                <XCircle className="mr-1 h-3.5 w-3.5" />
                {cancel.isPending ? "Đang hủy..." : "Hủy bán"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionCard({ tx }: { tx: ResaleTransaction }) {
  return (
    <Card className="border-zinc-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Giao dịch</p>
            <p className="font-mono text-sm font-semibold text-zinc-900 break-all">{tx.id}</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-200">
            {tx.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-zinc-700">
        <p className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-primary" />
          Người mua: <span className="font-mono text-xs">{tx.buyerUserId}</span>
        </p>
        <p>
          Listing ID: <span className="font-mono text-xs">{tx.resaleId}</span>
        </p>
        <p>
          Giá trị: <span className="font-semibold text-zinc-900">{Number(tx.cost || 0).toLocaleString("vi-VN")}đ</span>
        </p>
        <p className="text-xs text-zinc-500">
          Thời gian: {new Date(tx.transactionDate || tx.createdAt).toLocaleString("vi-VN")}
        </p>
      </CardContent>
    </Card>
  );
}

export default function SellerResalesPage() {
  const { data: meRes, isLoading: isMeLoading } = useGetMe();
  const user = meRes?.data;

  const { data: listingsRes, isLoading: isListingsLoading } = useGetTicketListings(
    { sellerUserId: user?.id, pageNumber: 1, pageSize: 200, isDescending: true },
    { enabled: !!user?.id }
  );
  const { data: transactionsRes, isLoading: isTransactionsLoading } = useGetResaleTransactions(
    { pageNumber: 1, pageSize: 500, isDescending: true },
    { enabled: !!user?.id }
  );

  const listings = listingsRes?.data?.items ?? [];
  const allTransactions = transactionsRes?.data?.items ?? [];

  const myListingIds = useMemo(() => new Set(listings.map((l) => l.id)), [listings]);
  const myTransactions = useMemo(
    () => allTransactions.filter((tx) => myListingIds.has(tx.resaleId)),
    [allTransactions, myListingIds]
  );

  if (isMeLoading || isListingsLoading || isTransactionsLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Vé bán lại của tôi</h1>
          <p className="mt-1 text-zinc-600">
            Quản lý vé đang bán, xem lịch sử giao dịch và người mua vé của bạn.
          </p>
        </div>
        <Button asChild>
          <Link href="/user/dashboard/resales/create">Đăng vé bán lại</Link>
        </Button>
      </div>

      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">
            <Ticket className="mr-1 h-4 w-4" />
            Tất cả vé ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Receipt className="mr-1 h-4 w-4" />
            Giao dịch ({myTransactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          {listings.length === 0 ? (
            <Card className="border-dashed border-zinc-300">
              <CardContent className="p-10 text-center">
                <CircleDollarSign className="mx-auto h-10 w-10 text-zinc-400" />
                <p className="mt-3 text-zinc-600">Bạn chưa đăng vé bán lại nào.</p>
                <Button asChild className="mt-4">
                  <Link href="/user/dashboard/tickets">Đi tới vé của tôi</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  sellerUserId={user?.id || ""}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-3">
          {myTransactions.length === 0 ? (
            <Card className="border-dashed border-zinc-300">
              <CardContent className="p-10 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-zinc-400" />
                <p className="mt-3 text-zinc-600">Chưa có giao dịch bán vé nào.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myTransactions.map((tx) => (
                <TransactionCard key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
