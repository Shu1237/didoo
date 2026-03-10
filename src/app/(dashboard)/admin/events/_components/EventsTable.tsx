"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetEvents } from "@/hooks/useEvent";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { EventStatus } from "@/utils/enum";
import type { Event } from "@/types/event";
import Image from "next/image";

function toQuery(params: Record<string, string | string[] | undefined>) {
  const q: Record<string, string | number | boolean> = {};
  const pageNumber = Number(params.pageNumber ?? params.page ?? 1) || 1;
  const pageSize = Number(params.pageSize) || 10;
  q.pageNumber = pageNumber;
  q.pageSize = pageSize;
  q.hasCategory = true;
  q.hasOrganizer = true;
  if (params.isDeleted !== undefined && params.isDeleted !== "") {
    q.isDeleted = params.isDeleted === "true";
  } else {
    q.isDeleted = false;
  }
  if (params.name && typeof params.name === "string") q.name = params.name;
  if (params.categoryId && typeof params.categoryId === "string") q.categoryId = params.categoryId;
  if (params.organizerId && typeof params.organizerId === "string") q.organizerId = params.organizerId;
  if (params.status && params.status !== "") q.status = Number(params.status);
  if (params.isDescending !== undefined) q.isDescending = params.isDescending === "true";
  return q;
}

const statusLabels: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: "Nháp",
  [EventStatus.PUBLISHED]: "Đã xuất bản",
  [EventStatus.CANCELLED]: "Đã hủy",
  [EventStatus.OPENED]: "Đang mở",
  [EventStatus.CLOSED]: "Đã đóng",
  [EventStatus.PENDING_APPROVAL]: "Chờ duyệt",
};

function formatDate(s: string | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return s;
  }
}

interface EventsTableProps {
  params: Record<string, string | string[] | undefined>;
  onDelete?: (event: Event) => void;
  onApprove?: (event: Event) => void;
  onReject?: (event: Event) => void;
  onRestore?: (event: Event) => void;
  isUpdatingStatus?: boolean;
  isRestoring?: boolean;
}

export function EventsTable({ params, onDelete, onApprove, onReject, onRestore, isUpdatingStatus, isRestoring }: EventsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = toQuery(params);
  const showDeleted = query.isDeleted === true;
  const { data, isLoading } = useGetEvents(query);

  if (isLoading || !data) return null;

  const items = data.data?.items ?? [];
  const totalItems = data.data?.totalItems ?? 0;
  const pageNumber = data.data?.pageNumber ?? 1;
  const pageSize = data.data?.pageSize ?? 10;
  const totalPages = data.data?.totalPages ?? 1;

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent">
              <TableHead className="w-20">Ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((e) => (
              <TableRow key={e.id} className="border-zinc-100">
                <TableCell>
                  <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-zinc-100">
                    {e.thumbnailUrl ? (
                      <Image src={e.thumbnailUrl} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">—</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-zinc-600">{e.category?.name ?? "—"}</TableCell>
                <TableCell className="text-zinc-600">{e.organizer?.name ?? "—"}</TableCell>
                <TableCell className="text-zinc-600">{formatDate(e.startTime)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      e.status === EventStatus.OPENED
                        ? "default"
                        : e.status === EventStatus.CANCELLED
                          ? "destructive"
                          : e.status === EventStatus.PENDING_APPROVAL
                            ? "outline"
                            : "secondary"
                    }
                    className={e.status === EventStatus.PENDING_APPROVAL ? "border-amber-500 text-amber-700" : ""}
                  >
                    {statusLabels[e.status as EventStatus] ?? e.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/events/${e.id}`}>Xem chi tiết</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/events/${e.id}/edit`}>Chỉnh sửa</Link>
                      </DropdownMenuItem>
                      {e.status === EventStatus.PENDING_APPROVAL && onApprove && (
                        <DropdownMenuItem
                          onClick={() => onApprove(e)}
                          disabled={isUpdatingStatus}
                          className="text-emerald-600 focus:text-emerald-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Duyệt xuất bản
                        </DropdownMenuItem>
                      )}
                      {e.status === EventStatus.PENDING_APPROVAL && onReject && (
                        <DropdownMenuItem
                          onClick={() => onReject(e)}
                          disabled={isUpdatingStatus}
                          className="text-amber-600 focus:text-amber-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Từ chối
                        </DropdownMenuItem>
                      )}
                      {showDeleted &&
                        e.status === EventStatus.CANCELLED &&
                        onRestore &&
                        new Date(e.startTime) > new Date() && (
                          <DropdownMenuItem
                            onClick={() => onRestore(e)}
                            disabled={isRestoring}
                            className="text-emerald-600 focus:text-emerald-600"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Khôi phục
                          </DropdownMenuItem>
                        )}
                      {onDelete && !showDeleted && (
                        <DropdownMenuItem
                          onClick={() => onDelete(e)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BasePagination
        currentPage={pageNumber}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={(p) => updateParam("pageNumber", String(p))}
        onPageSizeChange={(s) => updateParam("pageSize", String(s))}
      />
    </div>
  );
}
