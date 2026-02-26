"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, ReceiptText } from "lucide-react";
import { BasePagination } from "@/components/base/BasePagination";

interface Transaction {
    id: string;
    type: string;
    amount: string;
    status: string;
    date: string;
    method?: string;
    event?: string;
}

interface TransactionsListProps {
    transactions: Transaction[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function TransactionsList({
    transactions,
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange
}: TransactionsListProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white italic text-zinc-400">
                <ReceiptText className="w-10 h-10 mb-4 opacity-20" />
                <p className="font-medium text-sm">Không tìm thấy giao dịch nào</p>
            </div>
        );
    }

    return (
        <div className="bg-white flex flex-col">
            <div className="overflow-auto scrollbar-thin max-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="bg-zinc-50/50 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 border-y border-zinc-100">
                            <th className="px-5 py-3">Mã giao dịch</th>
                            <th className="px-5 py-3">Nội dung</th>
                            <th className="px-5 py-3">Ngày</th>
                            <th className="px-5 py-3">Trạng thái</th>
                            <th className="px-5 py-3 text-right">Số tiền</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {transactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-5 py-3">
                                    <span className="text-xs font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{trx.id}</span>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-zinc-800">{trx.type === "Payout" ? "Rút tiền" : "Bán vé"}</span>
                                        <span className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[200px]">{trx.event || trx.method}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-xs text-zinc-500">
                                    {trx.date}
                                </td>
                                <td className="px-5 py-3">
                                    <Badge className={cn(
                                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium border-none shadow-sm",
                                        trx.status === "Success" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {trx.status === "Success" ? "Thành công" : "Đang xử lý"}
                                    </Badge>
                                </td>
                                <td className={cn(
                                    "px-5 py-3 text-sm font-semibold text-right tracking-tight",
                                    trx.amount.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    <div className="flex items-center justify-end gap-1">
                                        {trx.amount.startsWith("+") ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                                        {trx.amount}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            <div className="px-6 py-4 bg-zinc-50/30 flex items-center justify-between shrink-0">
                <p className="text-[11px] font-medium text-zinc-500">
                    Hiển thị <span className="text-zinc-900 font-semibold">{transactions.length}</span> trên <span className="text-zinc-900 font-semibold">{totalCount}</span> giao dịch
                </p>
                <BasePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / pageSize)}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    showInfo={false}
                    showSizeSelector={true}
                    pageSizeOptions={[5, 10, 20, 50]}
                />
            </div>
        </div>
    );
}

