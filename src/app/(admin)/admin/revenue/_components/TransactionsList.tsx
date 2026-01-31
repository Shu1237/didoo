"use client";

import { Card } from "@/components/ui/card";

interface TransactionsListProps {
  transactions:{
    id: string;
    description: string;
    date: string;
    amount: number
  }[]
 }
export default function TransactionsList({transactions}:TransactionsListProps) {

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-zinc-200 shadow-sm">
        <p className="text-zinc-500 mb-4">Không có giao dịch nào</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-zinc-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900">Lịch sử giao dịch</h3>
      <div className="space-y-2">
        {transactions.map((transaction: any) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <div>
              <p className="font-medium text-zinc-900">{transaction.description}</p>
              <p className="text-sm text-zinc-500">{transaction.date}</p>
            </div>
            <p
              className={`font-medium ${
                transaction.amount >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {transaction.amount >= 0 ? "+" : ""}
              {transaction.amount.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
