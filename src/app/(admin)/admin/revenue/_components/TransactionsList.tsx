"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AdminRevenueTransaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  status: "success" | "pending" | "failed";
}

interface TransactionsListProps {
  transactions: AdminRevenueTransaction[];
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(Math.abs(value))} VNĐ`;

const statusStyles: Record<AdminRevenueTransaction["status"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusLabels: Record<AdminRevenueTransaction["status"], string> = {
  success: "Thành công",
  pending: "Đang xử lý",
  failed: "Thất bại",
};

export default function TransactionsList({ transactions }: TransactionsListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="rounded-2xl border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-zinc-500">Không có giao dịch nào.</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <h3 className="mb-3 text-base font-semibold text-zinc-900">Lịch sử giao dịch gần đây</h3>

      <div className="divide-y divide-zinc-100">
        {transactions.map((transaction) => {
          const isPositive = transaction.amount >= 0;

          return (
            <div key={transaction.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-medium text-zinc-900">{transaction.description}</p>
                <p className="text-xs text-zinc-500">{transaction.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    statusStyles[transaction.status]
                  )}
                >
                  {statusLabels[transaction.status]}
                </span>

                <p className={cn("text-sm font-semibold", isPositive ? "text-emerald-600" : "text-rose-600")}>
                  {isPositive ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
