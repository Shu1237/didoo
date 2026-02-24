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
            <Card className="flex-1 min-h-[400px] flex flex-col items-center justify-center bg-white border border-zinc-100 rounded-[40px] shadow-sm italic text-zinc-400">
                <ReceiptText className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">Không tìm thấy giao dịch nào</p>
            </Card>
        );
    }

    return (
        <Card className="flex-1 min-h-0 bg-white border border-zinc-100 rounded-[40px] overflow-hidden flex flex-col shadow-sm">
            <div className="flex-1 overflow-auto scrollbar-thin">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                            <th className="px-8 py-5">Mã giao dịch</th>
                            <th className="px-8 py-5">Nội dung</th>
                            <th className="px-8 py-5">Ngày</th>
                            <th className="px-8 py-5">Trạng thái</th>
                            <th className="px-8 py-5 text-right">Số tiền</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {transactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-zinc-50 transition-colors group">
                                <td className="px-8 py-6">
                                    <span className="text-xs font-black text-zinc-900 group-hover:text-primary transition-colors">{trx.id}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-zinc-800">{trx.type === "Payout" ? "Rút tiền" : "Bán vé"}</span>
                                        <span className="text-[10px] text-zinc-400 font-bold mt-1 truncate max-w-[200px]">{trx.event || trx.method}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-xs text-zinc-500 font-bold">
                                    {trx.date}
                                </td>
                                <td className="px-8 py-6">
                                    <Badge className={cn(
                                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-sm",
                                        trx.status === "Success" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                                    )}>
                                        {trx.status === "Success" ? "Thành công" : "Đang xử lý"}
                                    </Badge>
                                </td>
                                <td className={cn(
                                    "px-8 py-6 text-sm font-black text-right tracking-tight",
                                    trx.amount.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    <div className="flex items-center justify-end gap-1">
                                        {trx.amount.startsWith("+") ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                        {trx.amount}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/30 flex items-center justify-between shrink-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Hiển thị <span className="text-zinc-900">{transactions.length}</span> trên <span className="text-zinc-900">{totalCount}</span> giao dịch
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
        </Card>
    );
}
