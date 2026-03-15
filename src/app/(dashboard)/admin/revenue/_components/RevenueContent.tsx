"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetBookings } from "@/hooks/useBooking";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BasePagination } from "@/components/base/BasePagination";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, BookingTypeStatus } from "@/utils/enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toQuery(params: Record<string, string | string[] | undefined>) {
  const q: Record<string, string | number | boolean> = {};
  const pageNumber = Number(params.pageNumber ?? params.page ?? 1) || 1;
  const pageSize = Number(params.pageSize) || 20;
  q.pageNumber = pageNumber;
  q.pageSize = pageSize;
  q.status = params.status && params.status !== "" ? Number(params.status) : BookingStatus.PAID;
  if (params.bookingType && params.bookingType !== "all") q.bookingType = Number(params.bookingType);
  if (params.isDescending !== undefined) {
    q.isDescending = params.isDescending === "true";
  } else {
    q.isDescending = true;
  }
  return q;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

function formatDate(s: string | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}

export function RevenueContent({ params }: { params: Record<string, string | string[] | undefined> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = toQuery(params);
  const { data, isLoading } = useGetBookings(query);

  if (isLoading || !data) return null;

  const items = data.data?.items ?? [];
  const totalItems = data.data?.totalItems ?? 0;
  const pageNumber = data.data?.pageNumber ?? 1;
  const pageSize = data.data?.pageSize ?? 20;
  const totalPages = data.data?.totalPages ?? 1;

  const totalRevenue = items.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);
  const avgOrder = items.length > 0 ? totalRevenue / items.length : 0;

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-zinc-500">Tổng doanh thu (trang)</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-900">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-zinc-500">Đơn đã thanh toán</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-900">{totalItems}</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-zinc-500">Trung bình đơn hàng</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-zinc-900">{formatCurrency(avgOrder)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Giao dịch gần đây</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={searchParams.get("status") || String(BookingStatus.PAID)}
              onValueChange={(v) => updateParam("status", v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(BookingStatus.PENDING)}>Chờ thanh toán</SelectItem>
                <SelectItem value={String(BookingStatus.PAID)}>Đã thanh toán</SelectItem>
                <SelectItem value={String(BookingStatus.CANCELLED)}>Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get("bookingType") || "all"}
              onValueChange={(v) => {
                if (v === "all") {
                  const p = new URLSearchParams(searchParams.toString());
                  p.delete("bookingType");
                  p.set("pageNumber", "1");
                  router.push(`${pathname}?${p.toString()}`);
                } else {
                  updateParam("bookingType", v);
                }
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Loại đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại đơn</SelectItem>
                <SelectItem value={String(BookingTypeStatus.NORMAL)}>Mua vé thường</SelectItem>
                <SelectItem value={String(BookingTypeStatus.TRADE_PURCHASE)}>Mua vé Resale</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get("isDescending") !== "false" ? "true" : "false"}
              onValueChange={(v) => updateParam("isDescending", v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Mới nhất</SelectItem>
                <SelectItem value="false">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-200 hover:bg-transparent">
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Ngày thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((b) => (
                  <TableRow key={b.id} className="border-zinc-100">
                    <TableCell className="font-medium">{b.fullname}</TableCell>
                    <TableCell className="text-zinc-600">{b.email}</TableCell>
                    <TableCell className="text-zinc-600">{b.amount}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(b.totalPrice)}</TableCell>
                    <TableCell className="text-zinc-600">{formatDate(b.paidAt ?? b.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="default">{b.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <BasePagination
              currentPage={pageNumber}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={(p) => updateParam("pageNumber", String(p))}
              onPageSizeChange={(s) => updateParam("pageSize", String(s))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
