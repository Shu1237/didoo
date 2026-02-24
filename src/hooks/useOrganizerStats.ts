import { useGetEvents } from "./useEvent";
import { useMemo } from "react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";

export const useOrganizerStats = (organizerId?: string) => {
    const { data: eventsRes, isLoading } = useGetEvents({
        organizerId: organizerId,
        pageSize: 100, // Fetch a reasonable amount for stats
    });

    const stats = useMemo(() => {
        if (!eventsRes?.data?.items) return null;

        const events = eventsRes.data.items as Event[];
        const totalSold = events.reduce((acc, event) => acc + (event.sold || 0), 0);
        const totalCapacity = events.reduce((acc, event) => acc + (event.total || 0), 0);

        // Mock revenue for now as it's not directly in the Event model
        // In a real app, this would come from a dedicated report API or calculated from tickets
        const estimatedRevenue = totalSold * 50000; // Average ticket price mock

        return [
            {
                title: "Tổng vé bán ra",
                value: totalSold.toLocaleString(),
                change: "+12%", // Mock trend
                trend: "up" as const,
                icon: "Ticket",
                description: "Tất cả sự kiện"
            },
            {
                title: "Tổng sức chứa",
                value: totalCapacity.toLocaleString(),
                change: "+5%",
                trend: "up" as const,
                icon: "Users",
                description: "Tất cả sự kiện"
            },
            {
                title: "Sự kiện đang hoạt động",
                value: events.filter(e => e.status === EventStatus.PUBLISHED).length.toString(),
                change: "0%",
                trend: "neutral" as const,
                icon: "Calendar",
                description: "Hiện tại"
            },
            {
                title: "Doanh thu ước tính",
                value: estimatedRevenue.toLocaleString() + " VNĐ",
                change: "+8%",
                trend: "up" as const,
                icon: "Wallet",
                description: "Dựa trên vé đã bán"
            }
        ];
    }, [eventsRes]);

    return {
        stats,
        events: eventsRes?.data?.items || [],
        isLoading
    };
};
