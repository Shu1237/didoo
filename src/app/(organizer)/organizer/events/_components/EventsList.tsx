"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockOrganizerEvents } from "@/utils/mockOrganizer";
import { Event } from "@/utils/type";

interface EventsListProps {
  events:{
    id:string;
    title:string;
    date:string;
  }[]
}

export default function EventsList({ events }: EventsListProps) {

  if (!events || events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Bạn chưa có sự kiện nào</p>
        <Link href="/organizer/events/create">
          <Button>Tạo sự kiện đầu tiên</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event: any) => (
        <Card key={event.id} className="p-6">
          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{event.date}</p>
          <div className="flex gap-2">
            <Link href={`/organizer/events/${event.id}`} className="flex-1">
              <Button variant="outline" className="w-full">Xem chi tiết</Button>
            </Link>
            <Link href={`/organizer/events/${event.id}/edit`}>
              <Button variant="outline">Chỉnh sửa</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
