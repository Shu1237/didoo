"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { mockTransactions } from "@/utils/mockAdmin";

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
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Không có giao dịch nào</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Lịch sử giao dịch</h3>
      {!transactions || transactions.length === 0 ? (
        <p className="text-muted-foreground">Chưa có giao dịch nào</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction: any) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <p className="font-medium">{transaction.amount} VNĐ</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
