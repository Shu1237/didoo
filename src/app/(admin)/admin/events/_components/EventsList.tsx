"use client";


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/utils/type";
interface EventsListProps {
  events:Event[]
}

export default function EventsList({events}:EventsListProps) {



  if (!events || events.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-zinc-200 shadow-sm">
        <p className="text-zinc-500 mb-4">Bạn chưa có sự kiện nào</p>
        <Button className="bg-zinc-800 hover:bg-zinc-900">Tạo sự kiện đầu tiên</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event: any) => (
        <Card key={event.id} className="p-4 bg-white border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-medium text-zinc-900">{event.title}</p>
                <Badge
                  className={`text-white hover:text-white ${
                    event.status === "pending"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : event.status === "completed"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-zinc-500 hover:bg-zinc-600"
                  }`}
                >
                  {event.status}
                </Badge>
              </div>
              <p className="text-sm text-zinc-500">{event.organizer.name}</p>
              <p className="text-xs text-zinc-500 mt-1">{event.date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700">
                Xem chi tiết
              </Button>
              {event.status === "pending" && (
                <>
                  <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Phê duyệt
                  </Button>
                  <Button variant="destructive" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
                    Từ chối
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
