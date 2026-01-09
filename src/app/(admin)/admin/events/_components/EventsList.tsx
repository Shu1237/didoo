"use client";


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/data/mock-data";



export default function EventsList() {
  const events = EVENTS;


  if (!events || events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Bạn chưa có sự kiện nào</p>

        <Button>Tạo sự kiện đầu tiên</Button>

      </Card>
    );
  }



  return (
    <div className="space-y-4">
      {events.map((event: any) => (
        <Card key={event.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-medium">{event.title}</p>
                <Badge className={`text-white hover:text-white ${event.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' :
                    event.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                      'bg-gray-500 hover:bg-gray-600'
                  }`}>
                  {event.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{event.organizer.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Xem chi tiết</Button>
              {event.status === "pending" && (
                <>
                  <Button variant="default" size="sm">Phê duyệt</Button>
                  <Button variant="destructive" size="sm">Từ chối</Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
