"use client";

import React from "react";
import { Ticket } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    User,
    Mail,
    Calendar,
    Ticket as TicketIcon,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react";

interface AttendeesListProps {
    tickets: Ticket[];
    isLoading?: boolean;
}

export default function AttendeesList({ tickets, isLoading }: AttendeesListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl mb-4" />
                <div className="h-4 w-32 bg-zinc-100 rounded-full" />
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-[32px] bg-zinc-50 flex items-center justify-center text-zinc-300 mb-6">
                    <TicketIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black tracking-tighter text-zinc-900 uppercase italic">Chưa có người tham gia</h3>
                <p className="text-zinc-400 text-sm font-medium mt-2 max-w-[280px]">
                    Khi có người mua vé cho sự kiện này, danh sách sẽ được hiển thị tại đây.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        <th className="px-8 py-5">Người tham gia</th>
                        <th className="px-8 py-5">Loại vé</th>
                        <th className="px-8 py-5">Ngày đặt</th>
                        <th className="px-8 py-5">Trạng thái</th>
                        <th className="px-8 py-5 text-right">Mã vé</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-zinc-50 transition-colors group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 overflow-hidden border border-zinc-200">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-zinc-900 tracking-tight">Nguyễn Văn A</span>
                                        <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> user@example.com
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <Badge variant="outline" className="rounded-full px-3 py-1 bg-zinc-50 text-zinc-600 border-zinc-200 text-[9px] font-black uppercase tracking-widest">
                                    {ticket.ticketType?.name || "Standard"}
                                </Badge>
                            </td>
                            <td className="px-8 py-6 text-[11px] text-zinc-500 font-bold">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 uppercase tracking-tighter">
                                        <Calendar className="w-3 h-3" /> 24/02/2026
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-400">
                                        <Clock className="w-3 h-3" /> 14:30
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <Badge className={cn(
                                    "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-sm",
                                    ticket.status === "Sold" ? "bg-emerald-500 text-white" : "bg-zinc-400 text-white"
                                )}>
                                    {ticket.status === "Sold" ? "Đã thanh toán" : "Chờ xử lý"}
                                </Badge>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <code className="text-[11px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 tracking-widest">
                                    {ticket.id.split('-')[0].toUpperCase()}
                                </code>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
