"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Organizer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  createdAt: string;
  avatar: string;
}

interface OrganizersListProps {
  organizers: Organizer[];
}

export default function OrganizersList({ organizers }: OrganizersListProps) {
  if (!organizers || organizers.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-zinc-200 shadow-sm">
        <p className="text-zinc-500 mb-4">Chưa có đơn đăng ký organizer nào</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {organizers.map((organizer) => (
        <Card key={organizer.id} className="p-4 bg-white border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Avatar className="w-12 h-12 shrink-0 border-2 border-zinc-100">
                <AvatarImage src={organizer.avatar} />
                <AvatarFallback className="text-zinc-600 font-bold bg-zinc-200">
                  {organizer.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{organizer.name}</p>
                  <Badge
                    className={`text-white hover:text-white shrink-0 ${
                      organizer.status === "pending"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : organizer.status === "approved"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {organizer.status === "pending"
                      ? "Chờ phê duyệt"
                      : organizer.status === "approved"
                        ? "Đã phê duyệt"
                        : "Từ chối"}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500 truncate">{organizer.company}</p>
                <p className="text-xs text-zinc-500 mt-1">{organizer.email}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700">
                Xem chi tiết
              </Button>
              {organizer.status === "pending" && (
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
