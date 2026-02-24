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
    ArrowDownLeft,
    Search,
    Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import WithdrawModal from "./_components/WithdrawModal";
import TransactionsList from "./_components/TransactionsList";
import { cn } from "@/lib/utils";

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
        <div className="h-full flex flex-col space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Ví & Doanh thu</h1>
                    <div className="text-zinc-500 mt-2 font-semibold flex items-center gap-2 text-sm">
                        Quản lý dòng tiền và các yêu cầu rút tiền của bạn
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest px-3">
                            Đang hoạt động
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-full px-6 h-12 border-zinc-200 font-black uppercase tracking-widest text-[10px] gap-2">
                        <Download className="w-4 h-4" /> Xuất báo cáo
                    </Button>
                    <Button
                        onClick={() => setIsWithdrawOpen(true)}
                        className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 gap-2"
                    >
                        <Plus className="w-4 h-4" /> Rút tiền ngay
                    </Button>
                </div>
            </div>

            <WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                balance={walletBalance}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <Card className="p-8 rounded-[40px] border border-zinc-100 bg-zinc-900 text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary mb-6 border border-white/10">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 italic">Số dư khả dụng</p>
                        <h3 className="text-4xl font-black tracking-tighter mb-4">{walletBalance}</h3>
                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            <TrendingUp className="w-3.5 h-3.5" /> +12.5% so với tháng trước
                        </div>
                    </div>
                </Card>

                <Card className="p-8 rounded-[40px] border border-zinc-100 bg-white relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary mb-6 border border-zinc-100">
                            <CircleDollarSign className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 italic">Tổng doanh thu (Lifetime)</p>
                        <h3 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">124.500.000 VNĐ</h3>
                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                            Từ 12 sự kiện đã tổ chức
                        </div>
                    </div>
                </Card>

                <Card className="p-8 rounded-[40px] border border-zinc-100 bg-white relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-rose-500 mb-6 border border-zinc-100">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 italic">Đang chờ xử lý</p>
                        <h3 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">2.000.000 VNĐ</h3>
                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                            1 yêu cầu rút tiền đang duyệt
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transactions Section */}
            <div className="flex-1 min-h-0 flex flex-col space-y-4">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            <History className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black tracking-tighter text-zinc-900 uppercase italic">Lịch sử giao dịch</h3>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Tìm kiếm giao dịch..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-11 h-11 w-64 rounded-full border-zinc-100 bg-white text-xs font-bold"
                            />
                        </div>
                        <Button variant="outline" className="rounded-full w-11 h-11 border-zinc-100 p-0 text-zinc-500">
                            <Filter className="w-4 h-4" />
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
        </div>
    );
}
