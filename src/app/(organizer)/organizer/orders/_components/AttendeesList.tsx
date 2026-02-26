"use client";

import React from "react";
import { Ticket } from "@/types/ticket";
import { TicketStatus } from "@/utils/enum";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface AttendeesListProps {
    tickets: Ticket[];
    isLoading?: boolean;
}

export default function AttendeesList({
    tickets,
    isLoading,
}: AttendeesListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10 text-sm text-zinc-500">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="flex justify-center py-16 text-sm text-zinc-500">
                Chưa có người tham gia
            </div>
        );
    }

    return (
        <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 text-xs">
                <tr>
                    <th className="px-5 py-3 text-left">Khách hàng</th>
                    <th className="px-5 py-3 text-left">Loại vé</th>
                    <th className="px-5 py-3 text-left">Ngày đặt</th>
                    <th className="px-5 py-3 text-left">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Mã</th>
                </tr>
            </thead>

            <tbody className="divide-y">
                {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-zinc-50 transition">
                        <td className="px-5 py-4">
                            <div className="font-medium">Nguyễn Văn A</div>
                            <div className="text-xs text-zinc-400">
                                user@example.com
                            </div>
                        </td>

                        <td className="px-5 py-4">
                            {ticket.ticketType?.name}
                        </td>

                        <td className="px-5 py-4 text-xs text-zinc-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                24/02/2026
                            </div>
                        </td>

                        <td className="px-5 py-4">
                            <Badge
                                className={cn(
                                    "text-xs",
                                    ticket.status === TicketStatus.FULL
                                        ? "bg-emerald-500 text-white"
                                        : "bg-zinc-400 text-white"
                                )}
                            >
                                {ticket.status === TicketStatus.FULL
                                    ? "Đã thanh toán"
                                    : "Chờ xử lý"}
                            </Badge>
                        </td>

                        <td className="px-5 py-4 text-right text-xs font-mono text-primary">
                            {ticket.id.split("-")[0]}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}