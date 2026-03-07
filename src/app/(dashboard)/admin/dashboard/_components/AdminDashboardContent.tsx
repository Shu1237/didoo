"use client";

import { useQuery } from "@tanstack/react-query";
import { useGetUsers } from "@/hooks/useUser";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetOrganizers } from "@/hooks/useOrganizer";
import { useGetEvents } from "@/hooks/useEvent";
import { bookingRequest } from "@/apiRequest/booking";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventStatus, OrganizerStatus, BookingStatus } from "@/utils/enum";

const formatNumber = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
const formatCurrency = (n: number) => `${formatNumber(n)} VNĐ`;

export function AdminDashboardContent() {
  const { data: usersRes } = useGetUsers({ pageSize: 1 });
  const { data: categoriesRes } = useGetCategories({ pageSize: 1 });
  const { data: organizersRes } = useGetOrganizers({ pageSize: 1 });
  const { data: pendingOrgRes } = useGetOrganizers({ pageSize: 1, status: OrganizerStatus.PENDING });
  const { data: eventsRes } = useGetEvents({ pageSize: 1 });
  const { data: openedRes } = useGetEvents({ pageSize: 1, status: EventStatus.OPENED });
  const { data: publishedRes } = useGetEvents({ pageSize: 1, status: EventStatus.PUBLISHED });
  const { data: recentEventsRes } = useGetEvents({ pageSize: 8, hasOrganizer: true, hasCategory: true, isDescending: true });
  const { data: bookingsRes } = useQuery({
    queryKey: ["admin-dashboard-bookings"],
    queryFn: async () => {
      const [all, paid] = await Promise.all([
        bookingRequest.getList({ pageNumber: 1, pageSize: 100 }),
        bookingRequest.getList({ pageNumber: 1, pageSize: 100, status: BookingStatus.PAID }),
      ]);
      return { all: all.data.items, paid: paid.data.items };
    },
  });

  const totalUsers = usersRes?.data?.totalItems ?? 0;
  const totalCategories = categoriesRes?.data?.totalItems ?? 0;
  const totalOrganizers = organizersRes?.data?.totalItems ?? 0;
  const pendingOrganizers = pendingOrgRes?.data?.totalItems ?? 0;
  const totalEvents = eventsRes?.data?.totalItems ?? 0;
  const activeEvents = (openedRes?.data?.totalItems ?? 0) + (publishedRes?.data?.totalItems ?? 0);
  const paidBookings = bookingsRes?.paid ?? [];
  const totalRevenue = paidBookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0);
  const avgOrder = paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;
  const recentEvents = recentEventsRes?.data?.items ?? [];

  const stats = [
    { label: "Người dùng", value: formatNumber(totalUsers) },
    { label: "Organizer", value: formatNumber(totalOrganizers), sub: `${pendingOrganizers} chờ duyệt` },
    { label: "Sự kiện", value: formatNumber(totalEvents), sub: `${activeEvents} đang mở` },
    { label: "Danh mục", value: formatNumber(totalCategories) },
    { label: "Đơn đã thanh toán", value: formatNumber(paidBookings.length) },
    { label: "Doanh thu", value: formatCurrency(totalRevenue), sub: `TB: ${formatCurrency(avgOrder)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-zinc-200">
            <CardHeader className="pb-2">
              <p className="text-xs font-medium text-zinc-500">{s.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-zinc-900">{s.value}</p>
              {s.sub && <p className="mt-1 text-xs text-zinc-500">{s.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">Sự kiện gần đây</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.slice(0, 6).map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl border border-zinc-100 p-3">
                <div>
                  <p className="font-medium text-zinc-900">{e.name}</p>
                  <p className="text-xs text-zinc-500">{e.organizer?.name ?? "—"} · {e.category?.name ?? "—"}</p>
                </div>
                <Badge variant={e.status === EventStatus.OPENED || e.status === EventStatus.PUBLISHED ? "default" : "secondary"}>
                  {e.status === EventStatus.DRAFT && "Bản nháp"}
                  {e.status === EventStatus.PUBLISHED && "Đã xuất bản"}
                  {e.status === EventStatus.OPENED && "Đang mở"}
                  {e.status === EventStatus.CLOSED && "Đã đóng"}
                  {e.status === EventStatus.CANCELLED && "Đã hủy"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
