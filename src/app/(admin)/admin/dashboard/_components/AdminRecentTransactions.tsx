"use client";

import { CheckCircle2, Clock3, Ticket, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type RecentTransactionStatus = "success" | "pending" | "failed";

export interface AdminRecentTransactionItem {
  id: string;
  customerName: string;
  occurredAtLabel: string;
  status: RecentTransactionStatus;
  amount: number;
}

interface AdminRecentTransactionsProps {
  items: AdminRecentTransactionItem[];
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}

const statusMeta: Record<
  RecentTransactionStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  success: {
    label: "Paid",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  failed: {
    label: "Failed",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },
};

export default function AdminRecentTransactions({
  items,
  formatNumber,
  formatCurrency,
}: AdminRecentTransactionsProps) {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Recent Transactions</h3>
          <p className="text-xs text-zinc-500">Giao dich booking gan nhat tren he thong.</p>
        </div>
        <Badge variant="secondary" className="rounded-full bg-zinc-100 text-zinc-700">
          {formatNumber(items.length)} records
        </Badge>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-center">
          <Ticket className="mb-2 h-5 w-5 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700">No booking data</p>
          <p className="text-xs text-zinc-500">Khi co booking moi, danh sach se cap nhat tu API.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const meta = statusMeta[item.status];
            const StatusIcon = meta.icon;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 hover:bg-zinc-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">#{item.id} - {item.customerName}</p>
                  <p className="text-xs text-zinc-500">{item.occurredAtLabel}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {meta.label}
                  </span>

                  <p className="w-[120px] text-right text-sm font-semibold text-zinc-900">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
