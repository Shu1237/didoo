"use client";

import { cn } from "@/lib/utils";
import { BasePagination } from "@/components/base/BasePagination";
import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";

export type TransactionStatus = "success" | "pending" | "failed";

export interface EarningsTransaction {
  id: string;
  type: "income" | "withdraw";
  title: string;
  subtitle?: string;
  createdAt: string;
  status: TransactionStatus;
  amount: number;
}

interface TransactionsListProps {
  transactions: EarningsTransaction[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const statusStyle: Record<TransactionStatus, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusLabel: Record<TransactionStatus, string> = {
  success: "Thành công",
  pending: "Đang xử lý",
  failed: "Thất bại",
};

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatCurrency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(Math.abs(value))} VNĐ`;

export default function TransactionsList({
  transactions,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: TransactionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4 lg:p-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`transaction-loading-${index}`} className="h-12 animate-pulse rounded-lg bg-zinc-100" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center text-zinc-500">
        <ReceiptText className="mb-3 h-9 w-9 text-zinc-300" />
        <p className="text-sm">Không có giao dịch phù hợp.</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-zinc-50">
            <tr className="border-y border-zinc-100 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 lg:px-5">Mã giao dịch</th>
              <th className="px-4 py-3 lg:px-5">Nội dung</th>
              <th className="px-4 py-3 lg:px-5">Thời gian</th>
              <th className="px-4 py-3 lg:px-5">Trạng thái</th>
              <th className="px-4 py-3 text-right lg:px-5">Số tiền</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";
              const amountClass = isIncome ? "text-emerald-600" : "text-rose-600";

              return (
                <tr key={transaction.id} className="transition-colors hover:bg-zinc-50/60">
                  <td className="px-4 py-3 lg:px-5">
                    <p className="text-sm font-medium text-zinc-900">{transaction.id}</p>
                  </td>

                  <td className="px-4 py-3 lg:px-5">
                    <p className="text-sm font-medium text-zinc-800">{transaction.title}</p>
                    {transaction.subtitle && <p className="text-xs text-zinc-500">{transaction.subtitle}</p>}
                  </td>

                  <td className="px-4 py-3 text-sm text-zinc-600 lg:px-5">
                    {dateTimeFormatter.format(new Date(transaction.createdAt))}
                  </td>

                  <td className="px-4 py-3 lg:px-5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        statusStyle[transaction.status]
                      )}
                    >
                      {statusLabel[transaction.status]}
                    </span>
                  </td>

                  <td className={cn("px-4 py-3 text-right text-sm font-semibold lg:px-5", amountClass)}>
                    <span className="inline-flex items-center justify-end gap-1.5">
                      {isIncome ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 lg:px-5">
        <BasePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showInfo={true}
          showSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}
