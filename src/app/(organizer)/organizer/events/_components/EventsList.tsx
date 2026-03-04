"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Tag,
  MoreVertical,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";
import { useEvent } from "@/hooks/useEvent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface EventsListProps {
  events: any[];
  onViewDetail: (event: any) => void;
  onEdit: (event: any) => void;
}

export default function EventsList({
  events,
  onViewDetail,
  onEdit,
}: EventsListProps) {
  const { deleteEvent, restore } = useEvent();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (event: Event) => {
    if (!window.confirm(`Xóa sự kiện "${event.name}"?`)) return;
    setDeletingId(event.id);
    await deleteEvent.mutateAsync(event.id);
    setDeletingId(null);
  };

  const handleRestore = async (event: Event) => {
    await restore.mutateAsync(event.id);
  };

  if (!events || events.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 border border-dashed border-zinc-200 bg-zinc-50 rounded-2xl">
        <p className="text-zinc-400 font-semibold text-sm mb-6">
          Bạn chưa có sự kiện nào
        </p>
        <Button
          size="sm"
          onClick={() => router.push("/organizer/events/create")}
          className="rounded-full px-6"
        >
          Tạo sự kiện
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-1">
      {events.map((event: Event) => (
        <Card
          key={event.id}
          className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white hover:shadow-lg hover:border-primary/40 transition-all p-4"
        >
          {/* TOP */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-600">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {new Date(event.startTime).toLocaleDateString("vi-VN")}
              </div>

              <Badge
                className={`text-[10px] font-semibold px-2 py-1 rounded-full ${event.status === EventStatus.PUBLISHED
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
                  }`}
              >
                {event.status === EventStatus.PUBLISHED
                  ? "Published"
                  : "Draft"}
              </Badge>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-2">
              {event.name}
            </h3>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {event.locations?.[0]?.name || "Online"}
              </span>
            </div>

            {/* INFO BOX */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <p className="text-[9px] uppercase text-zinc-500 mb-1">
                  Thể loại
                </p>
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Tag className="w-3 h-3 text-zinc-400" />
                  {event.category?.name || "N/A"}
                </div>
              </div>

              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <p className="text-[9px] uppercase text-zinc-500 mb-1">
                  Giá từ
                </p>
                <p className="text-sm font-semibold">
                  0<span className="text-zinc-400 text-xs ml-1">Đ</span>
                </p>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex gap-2 pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetail(event)}
              className="flex-1 rounded-full text-xs"
            >
              Chi tiết
            </Button>

            <Button
              size="sm"
              onClick={() => onEdit(event)}
              className="flex-1 rounded-full text-xs"
            >
              Sửa
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="rounded-xl">
                {event.isDeleted ? (
                  <DropdownMenuItem
                    onClick={() => handleRestore(event)}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Khôi phục
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleDelete(event)}
                    disabled={deletingId === event.id}
                    className="gap-2 text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
}