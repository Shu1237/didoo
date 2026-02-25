"use client";

import React, { useState } from "react";
import { useGetMe } from "@/hooks/useUser";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetTickets } from "@/hooks/useTicket";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    Search,
    Filter,
    Download,
    ChevronRight,
    Ticket as TicketIcon,
    Users,
    SearchX
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AttendeesList from "./_components/AttendeesList";
import { Event } from "@/types/event";
import { cn } from "@/lib/utils";

export default function OrganizerOrdersPage() {
    const { data: userData, isLoading: isUserLoading } = useGetMe();
    const user = userData?.data;
    const { data: eventsRes, isLoading: isEventsLoading } = useGetEvents({
        organizerId: user?.organizerId || "",
        pageSize: 50,
    });

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const { data: ticketsRes, isLoading: isTicketsLoading } = useGetTickets({
        eventId: selectedEventId || undefined,
        pageSize: 100,
    });

    if (isUserLoading || isEventsLoading) return <Loading />;

    const events = eventsRes?.data?.items || [];
    const selectedEvent = events.find((e: any) => e.id === selectedEventId);
    const tickets = ticketsRes?.data?.items || [];

    return (
        <div className="h-full flex flex-col space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Quản lý Đơn hàng</h1>
                    <p className="text-zinc-500 mt-2 font-semibold">
                        Theo dõi danh sách khách hàng và tình trạng tham gia sự kiện
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-full px-6 h-12 border-zinc-200 font-black uppercase tracking-widest text-[10px] gap-2">
                        <Download className="w-4 h-4" /> Xuất danh sách (CSV)
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex gap-8">
                {/* Left Sidebar - Event Selection */}
                <div className="w-80 flex flex-col shrink-0">
                    <div className="bg-zinc-50/50 p-4 rounded-[32px] border border-zinc-100 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input placeholder="Tìm sự kiện..." className="pl-10 h-10 rounded-2xl border-none bg-white font-bold text-xs" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto pr-2 scrollbar-thin space-y-3">
                        {events.map((event: any) => (
                            <button
                                key={event.id}
                                onClick={() => setSelectedEventId(event.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-[28px] border transition-all duration-300 group relative overflow-hidden",
                                    selectedEventId === event.id
                                        ? "bg-zinc-900 border-zinc-900 shadow-xl"
                                        : "bg-white border-zinc-100 hover:border-primary/30"
                                )}
                            >
                                {selectedEventId === event.id && (
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-[30px] rounded-full -mr-10 -mt-10" />
                                )}
                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                            selectedEventId === event.id ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-400"
                                        )}>
                                            {event.category?.name || "Sự kiện"}
                                        </div>
                                        <ChevronRight className={cn(
                                            "w-4 h-4 transition-transform",
                                            selectedEventId === event.id ? "text-primary translate-x-1" : "text-zinc-300 group-hover:translate-x-1"
                                        )} />
                                    </div>
                                    <h4 className={cn(
                                        "text-xs font-black leading-tight tracking-tight uppercase line-clamp-2",
                                        selectedEventId === event.id ? "text-white" : "text-zinc-900"
                                    )}>
                                        {event.name}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase">
                                            <Users className="w-3 h-3" /> {event.sold}/{event.total}
                                        </div>
                                        {event.sold > 0 && (
                                            <div className="flex-1 h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(event.sold / event.total) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content - Attendee List */}
                <Card className="flex-1 bg-white border border-zinc-100 rounded-[40px] overflow-hidden flex flex-col shadow-sm">
                    {selectedEventId ? (
                        <>
                            <div className="p-8 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/30">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                        <ShoppingBag className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tighter text-zinc-900 uppercase italic">Danh sách người tham dự</h3>
                                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                                            Sự kiện: <span className="text-zinc-600 font-black">{selectedEvent?.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <Input placeholder="Tìm tên, email hoặc mã vé..." className="pl-11 h-12 w-80 rounded-full border-zinc-100 bg-white text-xs font-bold" />
                                    </div>
                                    <Button variant="outline" className="rounded-full w-12 h-12 border-zinc-100 p-0 text-zinc-500">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto scrollbar-thin">
                                <AttendeesList
                                    tickets={tickets}
                                    isLoading={isTicketsLoading}
                                />
                            </div>

                            <div className="p-6 border-t border-zinc-100 bg-zinc-50/30 flex items-center justify-between shrink-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    Hiển thị <b>{tickets.length}</b> lượt mua
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400" disabled>Trước</Button>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black tracking-widest shadow-lg">1</div>
                                    <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400" disabled>Sau</Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-in fade-in duration-700">
                            <div className="w-24 h-24 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary mb-8 border border-primary/10 animate-bounce-subtle">
                                <SearchX className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic mb-3">Chưa chọn sự kiện</h3>
                            <p className="text-zinc-400 text-sm font-medium max-w-[320px] leading-relaxed">
                                Vui lòng chọn một sự kiện từ danh sách bên trái để xem chi tiết danh sách người mua vé.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
