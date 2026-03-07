"use client";

import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicketType";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EventStatus } from "@/utils/enum";
import type { TicketType } from "@/types/ticketType";

const statusLabels: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: "Nháp",
  [EventStatus.PUBLISHED]: "Đã xuất bản",
  [EventStatus.CANCELLED]: "Đã hủy",
  [EventStatus.OPENED]: "Đang mở",
  [EventStatus.CLOSED]: "Đã đóng",
};

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

function formatCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export function AdminEventDetailContent({ eventId }: { eventId: string }) {
  const { data: eventRes, isLoading } = useGetEvent(eventId);
  const { data: ticketTypesRes } = useGetTicketTypes({ eventId });
  const event = eventRes?.data;
  const ticketTypes: TicketType[] = ticketTypesRes?.data?.items ?? [];

  if (isLoading || !event) {
    return (
      <Card className="border-zinc-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h2 className="text-lg font-semibold">Thông tin sự kiện</h2>
          <Button size="sm" variant="outline" className="rounded-xl" asChild>
            <Link href={`/admin/events/${eventId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-6">
            <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
              {event.thumbnailUrl ? (
                <Image
                  src={event.thumbnailUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400">—</div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-zinc-900">{event.name}</h3>
              {event.subtitle && (
                <p className="text-sm text-zinc-600">{event.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    event.status === EventStatus.OPENED
                      ? "default"
                      : event.status === EventStatus.CANCELLED
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {statusLabels[event.status as EventStatus] ?? event.status}
                </Badge>
                {event.category && (
                  <Badge variant="outline">{event.category.name}</Badge>
                )}
                {event.organizer && (
                  <Badge variant="outline">{event.organizer.name}</Badge>
                )}
              </div>
              <dl className="grid gap-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-zinc-500">Bắt đầu:</dt>
                  <dd>{formatDate(event.startTime)}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-zinc-500">Kết thúc:</dt>
                  <dd>{formatDate(event.endTime)}</dd>
                </div>
                {event.description && (
                  <div className="mt-2">
                    <dt className="text-zinc-500 mb-1">Mô tả:</dt>
                    <dd className="text-zinc-700 whitespace-pre-wrap">{event.description}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {ticketTypes.length > 0 && (
        <Card className="border-zinc-200">
          <CardHeader>
            <h2 className="text-lg font-semibold">Loại vé</h2>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent">
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Tổng số</TableHead>
                    <TableHead>Còn lại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketTypes.map((tt) => (
                    <TableRow key={tt.id} className="border-zinc-100">
                      <TableCell className="font-medium">{tt.name}</TableCell>
                      <TableCell>{formatCurrency(tt.price)}</TableCell>
                      <TableCell>{tt.totalQuantity}</TableCell>
                      <TableCell>{tt.availableQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
