"use client";

import { useState } from "react";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketTypes, useTicketType } from "@/hooks/useTicketType";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Loader2, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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

export function EventDetailContent({ eventId }: { eventId: string }) {
  const [ticketTypeToDelete, setTicketTypeToDelete] = useState<{ id: string; name: string } | null>(null);
  const { data: eventRes, isLoading } = useGetEvent(eventId);
  const { data: ticketTypesRes } = useGetTicketTypes({ eventId });
  const { deleteTicketType } = useTicketType();
  const event = eventRes?.data;
  const ticketTypes: TicketType[] = ticketTypesRes?.data?.items ?? [];

  const handleDeleteTicketType = async () => {
    if (!ticketTypeToDelete) return;
    await deleteTicketType.mutateAsync(ticketTypeToDelete.id);
    setTicketTypeToDelete(null);
  };

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
      {/* Event info */}
      <Card className="border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h2 className="text-lg font-semibold">Thông tin sự kiện</h2>
          <Button size="sm" variant="outline" className="rounded-xl" asChild>
            <Link href={`/organizer/events/${eventId}/edit`}>
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

      {/* Ticket types */}
      <Card className="border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h2 className="text-lg font-semibold">Loại vé</h2>
          <Button size="sm" className="rounded-xl" asChild>
            <Link href={`/organizer/events/${eventId}/ticket-types/create`}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm loại vé
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ticketTypes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center">
              <p className="text-sm text-zinc-500">Chưa có loại vé nào</p>
              <Button variant="outline" size="sm" className="mt-3 rounded-xl" asChild>
                <Link href={`/organizer/events/${eventId}/ticket-types/create`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm loại vé đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent">
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Tổng số</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketTypes.map((tt) => (
                    <TableRow key={tt.id} className="border-zinc-100">
                      <TableCell className="font-medium">{tt.name}</TableCell>
                      <TableCell>{formatCurrency(tt.price)}</TableCell>
                      <TableCell>{tt.totalQuantity}</TableCell>
                      <TableCell>{tt.availableQuantity}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem asChild>
                              <Link href={`/organizer/events/${eventId}/ticket-types/${tt.id}/edit`}>
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTicketTypeToDelete({ id: tt.id, name: tt.name })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        open={!!ticketTypeToDelete}
        onOpenChange={(o) => !o && setTicketTypeToDelete(null)}
        title="Xóa loại vé"
        description={`Bạn có chắc muốn xóa "${ticketTypeToDelete?.name}"?`}
        confirmLabel="Xóa"
        onConfirm={handleDeleteTicketType}
        isLoading={deleteTicketType.isPending}
        variant="danger"
      />
    </div>
  );
}
