import { useGetEvents } from "./useEvent";
import { useMemo } from "react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";

type TrendDirection = "up" | "down" | "neutral";

type OrganizerDashboardStat = {
    title: string;
    value: string;
    change: string;
    trend: TrendDirection;
    icon: string;
    description: string;
};

type OrganizerChartPoint = {
    name: string;
    sales: number;
    capacity: number;
    occupancy: number;
};

type EventRevenueFields = Event & {
    revenue?: number;
    totalRevenue?: number;
    grossRevenue?: number;
};

const toNumber = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
const formatCurrency = (value: number) => `${formatNumber(Math.round(value))} VNĐ`;

const getTrend = (current: number, previous: number): { change: string; trend: TrendDirection } => {
    if (current === 0 && previous === 0) return { change: "0%", trend: "neutral" };
    if (previous === 0) return { change: "+100%", trend: "up" };

    const delta = ((current - previous) / Math.abs(previous)) * 100;
    const roundedDelta = Math.abs(delta) < 0.05 ? 0 : Number(delta.toFixed(1));
    if (roundedDelta === 0) return { change: "0%", trend: "neutral" };

    return {
        change: `${roundedDelta > 0 ? "+" : ""}${roundedDelta}%`,
        trend: roundedDelta > 0 ? "up" : "down",
    };
};

const getEventRevenue = (event: Event) => {
    const revenueSource = event as EventRevenueFields;
    return toNumber(revenueSource.revenue ?? revenueSource.totalRevenue ?? revenueSource.grossRevenue ?? 0);
};

const isActiveEvent = (event: Event, now: Date) => {
    if (event.status === EventStatus.CANCELLED || event.status === EventStatus.CLOSED) return false;
    const endTime = new Date(event.endTime || event.startTime);
    return (event.status === EventStatus.OPENED || event.status === EventStatus.PUBLISHED) && endTime >= now;
};

export const useOrganizerStats = (organizerId?: string) => {
    const { data: eventsRes, isLoading } = useGetEvents(
        {
            organizerId,
            pageSize: 200,
        },
        Boolean(organizerId)
    );

    const { stats, chartData, events } = useMemo(() => {
        if (!organizerId) {
            return {
                stats: [] as OrganizerDashboardStat[],
                chartData: [] as OrganizerChartPoint[],
                events: [] as Event[],
            };
        }

        const eventItems = (eventsRes?.data?.items || []) as Event[];
        const now = new Date();

        const currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 29);
        currentPeriodStart.setHours(0, 0, 0, 0);

        const previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(currentPeriodStart.getDate() - 30);
        previousPeriodStart.setHours(0, 0, 0, 0);

        const previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setMilliseconds(-1);

        const totals = {
            sold: 0,
            capacity: 0,
            revenue: 0,
            active: 0,
        };

        const currentPeriod = {
            sold: 0,
            capacity: 0,
            revenue: 0,
            active: 0,
        };

        const previousPeriod = {
            sold: 0,
            capacity: 0,
            revenue: 0,
            active: 0,
        };

        for (const event of eventItems) {
            const sold = toNumber(event.sold);
            const capacity = toNumber(event.total);
            const revenue = getEventRevenue(event);
            const startTime = new Date(event.startTime);

            totals.sold += sold;
            totals.capacity += capacity;
            totals.revenue += revenue;
            if (isActiveEvent(event, now)) totals.active += 1;

            if (startTime >= currentPeriodStart && startTime <= now) {
                currentPeriod.sold += sold;
                currentPeriod.capacity += capacity;
                currentPeriod.revenue += revenue;
                if (isActiveEvent(event, now)) currentPeriod.active += 1;
            } else if (startTime >= previousPeriodStart && startTime <= previousPeriodEnd) {
                previousPeriod.sold += sold;
                previousPeriod.capacity += capacity;
                previousPeriod.revenue += revenue;
                if (isActiveEvent(event, now)) previousPeriod.active += 1;
            }
        }

        const totalOccupancy = totals.capacity > 0 ? (totals.sold / totals.capacity) * 100 : 0;
        const currentOccupancy = currentPeriod.capacity > 0 ? (currentPeriod.sold / currentPeriod.capacity) * 100 : 0;
        const previousOccupancy = previousPeriod.capacity > 0 ? (previousPeriod.sold / previousPeriod.capacity) * 100 : 0;

        const soldTrend = getTrend(currentPeriod.sold, previousPeriod.sold);
        const occupancyTrend = getTrend(currentOccupancy, previousOccupancy);
        const activeTrend = getTrend(currentPeriod.active, previousPeriod.active);
        const revenueTrend = getTrend(currentPeriod.revenue, previousPeriod.revenue);

        const statCards: OrganizerDashboardStat[] = [
            {
                title: "Vé đã bán",
                value: formatNumber(totals.sold),
                change: soldTrend.change,
                trend: soldTrend.trend,
                icon: "Ticket",
                description: "Tổng vé đã bán từ tất cả sự kiện",
            },
            {
                title: "Tỉ lệ lấp đầy",
                value: `${totalOccupancy.toFixed(1)}%`,
                change: occupancyTrend.change,
                trend: occupancyTrend.trend,
                icon: "Users",
                description: `${formatNumber(totals.sold)} / ${formatNumber(totals.capacity)} vé`,
            },
            {
                title: "Sự kiện đang mở",
                value: formatNumber(totals.active),
                change: activeTrend.change,
                trend: activeTrend.trend,
                icon: "Calendar",
                description: `${formatNumber(eventItems.length)} sự kiện trong hệ thống`,
            },
            {
                title: "Doanh thu ước tính",
                value: formatCurrency(totals.revenue),
                change: revenueTrend.change,
                trend: revenueTrend.trend,
                icon: "Wallet",
                description: "Tổng doanh thu nhận từ dữ liệu API",
            },
        ];

        const weekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });
        const sevenDayPoints: OrganizerChartPoint[] = [];
        const chartMap = new Map<string, OrganizerChartPoint>();

        for (let index = 6; index >= 0; index--) {
            const day = new Date(now);
            day.setDate(now.getDate() - index);
            day.setHours(0, 0, 0, 0);

            const point: OrganizerChartPoint = {
                name: weekdayFormatter.format(day).replace(/\./g, ""),
                sales: 0,
                capacity: 0,
                occupancy: 0,
            };

            const key = toDateKey(day);
            chartMap.set(key, point);
            sevenDayPoints.push(point);
        }

        for (const event of eventItems) {
            const eventDate = new Date(event.startTime);
            const dayPoint = chartMap.get(toDateKey(eventDate));
            if (!dayPoint) continue;

            dayPoint.sales += toNumber(event.sold);
            dayPoint.capacity += toNumber(event.total);
        }

        for (const point of sevenDayPoints) {
            point.occupancy = point.capacity > 0 ? Number(((point.sales / point.capacity) * 100).toFixed(1)) : 0;
        }

        return {
            stats: statCards,
            chartData: sevenDayPoints,
            events: eventItems,
        };
    }, [eventsRes, organizerId]);

    return {
        stats,
        chartData,
        events,
        isLoading,
    };
};
