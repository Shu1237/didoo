"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingRequest } from "@/apiRequest/booking";
import { useGetMe } from "@/hooks/useUser";
import { useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WithdrawModal from "./_components/WithdrawModal";
import TransactionsList, { type EarningsTransaction, type TransactionStatus } from "./_components/TransactionsList";
import { Download, Plus, Search, Wallet, Clock3, BadgeDollarSign } from "lucide-react";
import type { Booking } from "@/types/booking";
import type { Event } from "@/types/event";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

const formatCurrency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(value)))} VNĐ`;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStatus = (value?: string): TransactionStatus => {
  const status = (value || "").toLowerCase();
  if (status.includes("paid") || status.includes("success")) return "success";
  if (status.includes("pending")) return "pending";
  return "failed";
};

const toIsoDate = (value?: string | null) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return new Date(0).toISOString();
  return date.toISOString();
};

const exportTransactionsCsv = (transactions: EarningsTransaction[]) => {
  if (!transactions.length) return;

  const headers = ["transaction_id", "type", "title", "subtitle", "status", "created_at", "amount"];
  const rows = transactions.map((transaction) => [
    transaction.id,
    transaction.type,
    transaction.title,
    transaction.subtitle || "",
    transaction.status,
    transaction.createdAt,
    transaction.amount,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "earnings-transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const fetchBookingsByEvent = async (eventId: string) => {
  const collected: Booking[] = [];
  let pageNumber = 1;
  let totalPages = 1;
  const pageSize = 100;
  const maxPages = 20;

  while (pageNumber <= totalPages && pageNumber <= maxPages) {
    const response = await bookingRequest.getList({ eventId, pageNumber, pageSize });
    const page = response.data;

    collected.push(...(page.items || []));
    totalPages = page.totalPages || 1;
    pageNumber += 1;
  }

  return collected;
};

export default function OrganizerEarningsPage() {
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const organizerId = userData?.data?.organizerId;

  const { data: eventsRes, isLoading: isEventsLoading } = useGetEvents(
    {
      organizerId: organizerId || undefined,
      pageSize: 100,
      hasCategory: true,
    },
    Boolean(organizerId)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const events = useMemo(() => (eventsRes?.data?.items || []) as Event[], [eventsRes]);
  const eventIds = useMemo(() => events.map((event) => event.id), [events]);

  const eventNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const event of events) {
      map.set(event.id, event.name);
    }
    return map;
  }, [events]);

  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ["organizer-earnings-bookings", organizerId, eventIds.join("|")],
    enabled: Boolean(organizerId && eventIds.length > 0),
    queryFn: async () => {
      const bookingGroups = await Promise.all(eventIds.map((eventId) => fetchBookingsByEvent(eventId)));
      return bookingGroups.flat();
    },
  });

  const allTransactions = useMemo<EarningsTransaction[]>(() => {
    const uniqueBookings = new Map<string, Booking>();

    for (const booking of bookings) {
      if (!uniqueBookings.has(booking.id)) {
        uniqueBookings.set(booking.id, booking);
      }
    }

    return Array.from(uniqueBookings.values())
      .map((booking) => ({
        id: booking.id,
        type: "income" as const,
        title: "Bán vé sự kiện",
        subtitle: eventNameMap.get(booking.eventId) || booking.fullname || booking.email || "Không rõ sự kiện",
        createdAt: toIsoDate(booking.paidAt || booking.createdAt),
        status: normalizeStatus(booking.status),
        amount: toNumber(booking.totalPrice || booking.amount),
      }))
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  }, [bookings, eventNameMap]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allTransactions;

    return allTransactions.filter((transaction) =>
      [transaction.id, transaction.title, transaction.subtitle || "", transaction.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [allTransactions, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const successfulTransactions = allTransactions.filter((transaction) => transaction.status === "success");
  const pendingTransactions = allTransactions.filter((transaction) => transaction.status === "pending");

  const totalRevenue = successfulTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const pendingAmount = pendingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const averageOrderValue =
    successfulTransactions.length > 0 ? totalRevenue / successfulTransactions.length : 0;

  if (isUserLoading || isEventsLoading) return <Loading />;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <section className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm lg:px-6 lg:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Ví và doanh thu</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Tổng hợp doanh thu từ các booking theo sự kiện và theo dõi lịch sử giao dịch từ API.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-zinc-200 px-4"
              disabled={filteredTransactions.length === 0}
              onClick={() => exportTransactionsCsv(filteredTransactions)}
            >
              <Download className="mr-2 h-4 w-4" />
              Xuất CSV
            </Button>

            <Button className="h-10 rounded-xl px-4" onClick={() => setIsWithdrawOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Rút tiền
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Wallet className="h-3.5 w-3.5" />
              Số dư khả dụng
            </p>
            <p className="text-lg font-semibold text-zinc-900">{formatCurrency(totalRevenue)}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Clock3 className="h-3.5 w-3.5" />
              Chờ xử lý
            </p>
            <p className="text-lg font-semibold text-zinc-900">{formatCurrency(pendingAmount)}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <BadgeDollarSign className="h-3.5 w-3.5" />
              Giá trị đơn trung bình
            </p>
            <p className="text-lg font-semibold text-zinc-900">{formatCurrency(averageOrderValue)}</p>
          </div>
        </div>
      </section>

      <Card className="min-h-0 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-4 py-3 lg:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Lịch sử giao dịch</h2>
              <p className="text-xs text-zinc-500">{events.length} sự kiện • {allTransactions.length} giao dịch</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm mã giao dịch, sự kiện..."
                className="h-10 rounded-xl border-zinc-200 pl-9"
              />
            </div>
          </div>
        </div>

        <TransactionsList
          transactions={paginatedTransactions}
          totalCount={filteredTransactions.length}
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          isLoading={isBookingsLoading && allTransactions.length === 0}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </Card>

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={totalRevenue}
      />
    </div>
  );
}
