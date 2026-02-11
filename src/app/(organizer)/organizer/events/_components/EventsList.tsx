"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { mockOrganizerEvents } from "@/utils/mockOrganizer";
import { Event } from "@/utils/type";

interface EventsListProps {
  events: any[];
  onViewDetail: (event: any) => void;
  onEdit: (event: any) => void;
}

export default function EventsList({ events, onViewDetail, onEdit }: EventsListProps) {

  if (!events || events.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-12 border-dashed border-2 border-zinc-100 bg-zinc-50/50 rounded-[40px]">
        <p className="text-zinc-400 font-black uppercase tracking-widest text-xs mb-8 italic">Bạn chưa tổ chức sự kiện nào</p>
        <Button
          onClick={() => { }} // This should ideally trigger the CREATE modal too
          className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px]"
        >
          Bắt đầu ngay
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-8">
      {events.map((event: any) => (
        <Card key={event.id} className="group relative overflow-hidden rounded-[40px] border border-zinc-100 bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-700 p-1 flex flex-col">

          <div className="p-7 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-900 font-bold text-[10px] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 mr-0.5 text-primary" />
                  {event.date}
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {event.status || "Sắp diễn ra"}
                </Badge>
              </div>

              <h3 className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-primary transition-colors leading-tight mb-2">
                {event.title}
              </h3>
              <p className="text-zinc-600 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
                Quản lý và theo dõi hiệu quả sự kiện của bạn với các công cụ tối ưu hóa bán vé.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Vé đã bán</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-zinc-900">{event.sold || 0}</span>
                  <span className="text-zinc-400 text-xs font-bold">/ {event.total || 0}</span>
                </div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Doanh thu</p>
                <p className="text-lg font-black text-zinc-900">
                  {((event.sold || 0) * 500000).toLocaleString()}
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
          </div>
        </Card>
      ))}
    </div>
  );
}
