"use client";

import React, { useState } from "react";
import { useGetMe } from "@/hooks/useUser";
import { useOrganizerStats } from "@/hooks/useOrganizerStats";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    History,
    Download,
    Plus,
    CircleDollarSign,
    Search,
    Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import WithdrawModal from "./_components/WithdrawModal";
import TransactionsList from "./_components/TransactionsList";

export default function OrganizerEarningsPage() {
    const { data: userData, isLoading: isUserLoading } = useGetMe();
    const user = userData?.data;
    const { stats, isLoading: isStatsLoading } = useOrganizerStats(user?.organizerId || undefined);

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    if (isUserLoading || isStatsLoading) return <Loading />;

    const walletBalance = stats?.find(s => s.title === "Doanh thu ước tính")?.value || "0 VNĐ";

    // Mock transactions
    const allTransactions = [
        { id: "TRX-12345", type: "Payout", amount: "- 5.000.000 VNĐ", status: "Success", date: "24/02/2026", method: "Bank Transfer" },
        { id: "TRX-12346", type: "Ticket Sale", amount: "+ 250.000 VNĐ", status: "Success", date: "23/02/2026", event: "Đêm Nhạc Lofi: Chạm Vào Ký Ức" },
        { id: "TRX-12347", type: "Ticket Sale", amount: "+ 500.000 VNĐ", status: "Success", date: "23/02/2026", event: "Workshop: Art & Mind" },
        { id: "TRX-12348", type: "Payout", amount: "- 2.000.000 VNĐ", status: "Pending", date: "22/02/2026", method: "Momo" },
        { id: "TRX-12349", type: "Ticket Sale", amount: "+ 1.250.000 VNĐ", status: "Success", date: "21/02/2026", event: "Music Festival 2026" },
        { id: "TRX-12350", type: "Ticket Sale", amount: "+ 150.000 VNĐ", status: "Success", date: "20/02/2026", event: "Đêm Nhạc Lofi" },
        { id: "TRX-12351", type: "Payout", amount: "- 1.000.000 VNĐ", status: "Success", date: "19/02/2026", method: "Vietcombank" },
    ];

    // Filter logic
    const filteredTransactions = allTransactions.filter(trx =>
        trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trx.event || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trx.method || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="max-w-[1400px] mx-auto p-4 lg:p-6 lg:pt-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Ví & Doanh thu</h1>
                    <p className="text-xs text-zinc-500">Quản lý dòng tiền và các yêu cầu rút tiền</p>
                </div>
                <div className="flex gap-2.5">
                    <Button variant="outline" className="rounded-xl px-3.5 h-9 border-zinc-200 text-xs font-medium gap-2">
                        <Download className="w-3.5 h-3.5" /> Xuất báo cáo
                    </Button>
                    <Button
                        onClick={() => setIsWithdrawOpen(true)}
                        className="rounded-xl px-4 h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium gap-2"
                    >
                        <Plus className="w-3.5 h-3.5" /> Rút tiền
                    </Button>
                </div>
            </div>

            <WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                balance={walletBalance}
            />

            {/* MAIN UNIFIED CONTAINER */}
            <Card className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
                {/* Stats Section inside the card */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-zinc-100">
                    <div className="p-5 bg-zinc-950 text-white group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] rounded-full -mr-12 -mt-12" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Số dư khả dụng</p>
                            <h3 className="text-2xl font-bold tracking-tight mb-1.5">{walletBalance}</h3>
                            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-medium uppercase">
                                <TrendingUp className="w-3 h-3" /> +12.5% tháng này
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-white">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Tổng doanh thu</p>
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-1">124.500.000 VNĐ</h3>
                        <p className="text-[10px] text-zinc-500">Từ 12 sự kiện đã tổ chức</p>
                    </div>

                    <div className="p-5 bg-white">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Đang chờ xử lý</p>
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-1">2.000.000 VNĐ</h3>
                        <p className="text-[10px] text-zinc-500">1 yêu cầu rút tiền đang duyệt</p>
                    </div>
                </div>

                {/* Transactions Section inside the card */}
                <div className="p-0">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">Lịch sử giao dịch</h3>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400" />
                                <Input
                                    placeholder="Tìm giao dịch..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-8.5 h-8 w-48 rounded-lg border-zinc-200 bg-white text-[11px]"
                                />
                            </div>
                            <Button variant="outline" className="rounded-lg w-8 h-8 border-zinc-200 p-0 text-zinc-500">
                                <Filter className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    <TransactionsList
                        transactions={paginatedTransactions}
                        totalCount={filteredTransactions.length}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size: number) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}





