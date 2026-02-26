"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Tag, MoreVertical, Trash2, RotateCcw } from "lucide-react";
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

export default function EventsList({ events, onViewDetail, onEdit }: EventsListProps) {
  const { deleteEvent, restore } = useEvent();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const handleDelete = async (event: Event) => {
    if (!window.confirm(`Xóa sự kiện "${event.name}"? Hành động này không thể hoàn tác.`)) return;
    setDeletingId(event.id);
     await deleteEvent.mutateAsync(event.id);
     setDeletingId(null);
  };

  const handleRestore = async (event: Event) => {
    await restore.mutateAsync(event.id);
    setDeletingId(null);
  };

  if (!events || events.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-12 border-dashed border-2 border-zinc-100 bg-zinc-50/50 rounded-[40px]">
        <p className="text-zinc-400 font-black uppercase tracking-widest text-xs mb-8 italic">Bạn chưa tổ chức sự kiện nào</p>
        <Button
          onClick={() => { router.push("/organizer/events/create")}} // This should ideally trigger the CREATE modal too
          className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px]"
        >
          Bắt đầu ngay
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-8">
      {events.map((event: Event) => (
        <Card key={event.id} className="group relative overflow-hidden rounded-[40px] border border-zinc-100 bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-700 p-1 flex flex-col">

          <div className="p-7 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-900 font-bold text-[10px] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 mr-0.5 text-primary" />
                  {new Date(event.startTime).toLocaleDateString("vi-VN")}
                </div>
                <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full ${event.status === EventStatus.PUBLISHED ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                  {event.status === EventStatus.PUBLISHED ? "Published" : "Draft"}
                </Badge>
              </div>

              <h3 className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-primary transition-colors leading-tight mb-2 line-clamp-2">
                {event.name}
              </h3>
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold mb-4">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{event.locations?.[0]?.name || "Online"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Thể loại</p>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-900">{event.category?.name || "N/A"}</span>
                </div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Giá vé từ</p>
                <p className="text-lg font-black text-zinc-900">
                  {"0"}
                  <span className="text-zinc-400 text-xs font-black ml-1">Đ</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-3 bg-zinc-100/50 rounded-[32px] border border-zinc-200/50 mx-2 mb-2">
            <Button
              onClick={() => onViewDetail(event)}
              variant="ghost"
              className="flex-1 h-12 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 font-black uppercase tracking-widest text-[10px] shadow-sm transition-all"
            >
              Chi tiết
            </Button>
            <Button
              onClick={() => onEdit(event)}
              className="flex-1 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] shadow-lg transition-all"
            >
              Sửa
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {event.isDeleted ? (
                  <DropdownMenuItem onClick={() => handleRestore(event)} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Khôi phục
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleDelete(event)}
                    className="gap-2 text-red-600 focus:text-red-600"
                    disabled={deletingId === event.id}
                  >
                    <Trash2 className="w-4 h-4" /> Xóa
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
