"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, LayoutDashboard, Wallet } from "lucide-react";
import Link from "next/link";

interface TotalBalanceCardProps {
  value: string;
  label?: string;
  sublabel?: string;
}

export default function TotalBalanceCard({
  value,
  label = "Tổng số dư",
  sublabel = "Số dư khả dụng trên toàn sàn",
}: TotalBalanceCardProps) {
  return (
    <Card className="p-6 bg-[#18181b] border-none shadow-xl rounded-[32px] text-white relative overflow-hidden h-full flex flex-col min-h-0">
      {/* Background decoration - Thu nhỏ lại để không chiếm không gian */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Header Section: Giảm margin-bottom */}
      <div className="flex items-start justify-between mb-auto relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-zinc-500" />
            <p className="text-zinc-400 text-sm font-medium">{label}</p>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{sublabel}</p>
        </div>

        {/* Currency Switcher: Gọn gàng hơn */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-800/50 rounded-full border border-white/5 cursor-pointer hover:bg-zinc-800 transition-colors">
          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
          </div>
          <span className="text-xs font-bold">VND</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </div>
      </div>

      {/* Value Section: Dùng text-4xl thay vì 5xl để tránh tràn khi số tiền quá lớn */}
      <div className="my-6 relative z-10">
        <p className="text-4xl font-bold tracking-tight break-words">
          {value}
        </p>
      </div>

      {/* Action Buttons: Chuyển hướng đến các trang Quản lý cho Admin */}
      <div className="flex gap-3 relative z-10 shrink-0">
        <Button
          className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-2xl h-11 text-xs font-bold shadow-lg shadow-white/5"
          asChild
        >
          <Link href="/admin/finance">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />
            Đối soát
          </Link>
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5 rounded-2xl h-11 text-xs font-bold"
          asChild
        >
          <Link href="/admin/events">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
            Sự kiện
          </Link>
        </Button>
      </div>
    </Card>
  );
}