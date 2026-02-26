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
    Users,
    SearchX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AttendeesList from "./_components/AttendeesList";
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
        <div className="h-full flex flex-col space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Theo dõi danh sách người tham gia sự kiện
                    </p>
                </div>

                <Button variant="outline" className="h-9 px-4 gap-2">
                    <Download className="w-4 h-4" />
                    Xuất CSV
                </Button>
            </div>

            <div className="flex-1 min-h-0 flex gap-6">

                {/* Sidebar */}
                <div className="w-72 flex flex-col shrink-0">

                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Tìm sự kiện..."
                                className="pl-9 h-9"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto space-y-2 pr-1">
                        {events.map((event: any) => (
                            <button
                                key={event.id}
                                onClick={() => setSelectedEventId(event.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-xl border transition-all",
                                    selectedEventId === event.id
                                        ? "bg-zinc-900 text-white border-zinc-900"
                                        : "bg-white hover:bg-zinc-50"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-zinc-400">
                                        {event.category?.name}
                                    </span>
                                    <ChevronRight
                                        className={cn(
                                            "w-4 h-4",
                                            selectedEventId === event.id
                                                ? "text-primary"
                                                : "text-zinc-300"
                                        )}
                                    />
                                </div>

                                <div className="mt-1 text-sm font-medium line-clamp-2">
                                    {event.name}
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                                    <Users className="w-3 h-3" />
                                    {event.sold}/{event.total}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <Card className="flex-1 rounded-2xl border flex flex-col overflow-hidden">

                    {selectedEventId ? (
                        <>
                            <div className="p-5 border-b flex items-center justify-between bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Danh sách người tham dự
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            {selectedEvent?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <Input
                                            placeholder="Tìm kiếm..."
                                            className="pl-9 h-9 w-64"
                                        />
                                    </div>

                                    <Button variant="outline" size="icon">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <AttendeesList
                                    tickets={tickets}
                                    isLoading={isTicketsLoading}
                                />
                            </div>

                            <div className="p-4 border-t text-xs text-zinc-500">
                                Hiển thị {tickets.length} lượt mua
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                            <SearchX className="w-10 h-10 text-zinc-300 mb-3" />
                            <h3 className="text-lg font-semibold text-zinc-800">
                                Chưa chọn sự kiện
                            </h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                Chọn một sự kiện để xem danh sách người tham dự
                            </p>
                        </div>
                    )}

                </Card>
            </div>
        </div>
    );
}