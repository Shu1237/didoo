"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  ShoppingBag,
  Ticket,
  UserRound,
  XCircle,
} from "lucide-react";
import Loading from "@/components/loading";
import { useGetMe } from "@/hooks/useAuth";
import { useGetResales, useGetResaleTransactions } from "@/hooks/useBooking";
import { useGetTicketListing, useGetTickets, useTicketListing } from "@/hooks/useTicket";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function getListingStatus(status?: string | null) {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("sold")) return { label: "Đã bán", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" };
  if (normalized.includes("cancel")) return { label: "Đã hủy", className: "bg-rose-500/10 text-rose-700 border-rose-200" };
  return { label: "Chưa có người mua", className: "bg-amber-500/10 text-amber-700 border-amber-200" };
}

function ResaleCard({
  resaleId,
  bookingDetailId,
  price,
  description,
  status,
  createdAt,
  sellerUserId,
}: {
  resaleId: string;
  bookingDetailId: string;
  price?: number | null;
  description?: string | null;
  status?: string | null;
  createdAt: string;
  sellerUserId: string;
}) {
  const statusView = getListingStatus(status);
  const { cancel } = useTicketListing();
  const { data: listingRes } = useGetTicketListing(resaleId, { enabled: !!resaleId });
  const listing = listingRes?.data;
  const listingTicketId = (listing as unknown as { ticketId?: string })?.ticketId;
  const { data: ticketRes } = useGetTickets(
    { ticketId: listingTicketId, hasEvent: true, pageNumber: 1, pageSize: 1 },
    { enabled: !!listingTicketId }
  );
  const event = ticketRes?.data?.items?.[0]?.event;

  const canCancelByEventTime = () => {
    if (!event?.startTime || !event?.endTime) return false;
    const now = Date.now();
    const start = new Date(event.startTime).getTime();
    const end = new Date(event.endTime).getTime();
    return now >= start && now <= end;
  };

  const onCancel = async () => {
    if (!listing?.id) return;
    if (!canCancelByEventTime()) {
      toast.error("Chỉ được hủy vé bán lại trong thời gian sự kiện.");
      return;
    }
    try {
      await cancel.mutateAsync({ id: listing.id, body: { SellerUserId: sellerUserId } });
      toast.success("Hủy vé bán lại thành công.");
    } catch {
      toast.error("Không thể hủy vé bán lại.");
    }
  };

  return (
    <Card className="border-zinc-200">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Resale ID</p>
            <p className="font-mono text-sm font-semibold text-zinc-900 break-all">{resaleId}</p>
          </div>
          <Badge variant="outline" className={statusView.className}>
            {statusView.label}
          </Badge>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Booking detail</p>
            <p className="mt-1 text-xs font-mono text-zinc-800 break-all">{bookingDetailId}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Giá đăng</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {Number(price || 0).toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>

        {description ? <p className="text-sm text-zinc-600">{description}</p> : null}

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs text-zinc-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(createdAt).toLocaleString("vi-VN")}
          </p>
          <Button type="button" size="sm" variant="destructive" onClick={onCancel} disabled={cancel.isPending || !listing?.id}>
            <XCircle className="mr-1 h-3.5 w-3.5" />
            {cancel.isPending ? "Đang hủy..." : "Hủy bán"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SellerResalesPage() {
  const { data: meRes, isLoading: isMeLoading } = useGetMe();
  const user = meRes?.data;

  const { data: resalesRes, isLoading: isResalesLoading } = useGetResales(
    { salerUserId: user?.id, pageNumber: 1, pageSize: 200, isDescending: true },
    { enabled: !!user?.id }
  );
  const { data: resaleTransactionsRes, isLoading: isTransactionsLoading } = useGetResaleTransactions(
    { pageNumber: 1, pageSize: 300, isDescending: true } as any,
    { enabled: !!user?.id }
  );

  const resales = resalesRes?.data.items || [];
  const resaleTransactions = resaleTransactionsRes?.data.items || [];
  const myResaleIds = useMemo(() => new Set(resales.map((item) => item.id)), [resales]);
  const pendingResales = useMemo(
    () => resales.filter((item) => !String(item.status || "").toLowerCase().includes("sold")),
    [resales]
  );
  const buyerHistory = useMemo(
    () => resaleTransactions.filter((tx) => myResaleIds.has(tx.resaleId)),
    [resaleTransactions, myResaleIds]
  );

  if (isMeLoading || isResalesLoading || isTransactionsLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Vé bán lại của tôi</h1>
          <p className="mt-1 text-zinc-600">Theo dõi tin chưa có người mua, xem detail và lịch sử người mua vé của bạn.</p>
        </div>
        <Button asChild>
          <Link href="/user/dashboard/resales/create">Đăng vé bán lại</Link>
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            <Ticket className="mr-1 h-4 w-4" />
            Chưa có người mua ({pendingResales.length})
          </TabsTrigger>
          <TabsTrigger value="buyers">
            <ShoppingBag className="mr-1 h-4 w-4" />
            Lịch sử người mua ({buyerHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingResales.length === 0 ? (
            <Card className="border-dashed border-zinc-300">
              <CardContent className="p-10 text-center">
                <CircleDollarSign className="mx-auto h-10 w-10 text-zinc-400" />
                <p className="mt-3 text-zinc-600">Hiện chưa có tin resale nào đang chờ người mua.</p>
                <Button asChild className="mt-4">
                  <Link href="/user/dashboard/tickets">Đi tới vé của tôi</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingResales.map((item) => (
                <ResaleCard
                  key={item.id}
                  resaleId={item.id}
                  bookingDetailId={item.bookingDetailId}
                  price={item.price}
                  description={item.description}
                  status={item.status}
                  createdAt={item.createdAt}
                  sellerUserId={user?.id || ""}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="buyers" className="space-y-3">
          {buyerHistory.length === 0 ? (
            <Card className="border-dashed border-zinc-300">
              <CardContent className="p-10 text-center">
                <UserRound className="mx-auto h-10 w-10 text-zinc-400" />
                <p className="mt-3 text-zinc-600">Chưa có lịch sử người mua cho các tin resale của bạn.</p>
              </CardContent>
            </Card>
          ) : (
            buyerHistory.map((tx) => (
              <Card key={tx.id} className="border-zinc-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-zinc-500">Transaction ID</p>
                      <p className="font-mono text-sm font-semibold text-zinc-900 break-all">{tx.id}</p>
                    </div>
                    <Badge variant="outline">{tx.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-zinc-700">
                  <p className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    Buyer: <span className="font-mono text-xs">{tx.buyerUserId}</span>
                  </p>
                  <p>
                    Resale ID: <span className="font-mono text-xs">{tx.resaleId}</span>
                  </p>
                  <p>
                    Giá trị: <span className="font-semibold text-zinc-900">{Number(tx.cost || 0).toLocaleString("vi-VN")}đ</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    Thời gian: {new Date(tx.transactionDate || tx.createdAt).toLocaleString("vi-VN")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

