"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Plus, Pencil } from "lucide-react";
import Link from "next/link";

interface Activity {
  user: string;
  avatar: string;
}

interface RecentContactsCardProps {
  activities: Activity[];
}

export default function RecentContactsCard({ activities }: RecentContactsCardProps) {
  // Use only first 5 for the list to match design
  const displayActivities = activities.slice(0, 5);

  return (
    <Card className="p-8 bg-white border-none shadow-sm rounded-[32px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-zinc-900">Liên hệ gần đây</h3>
          <p className="text-sm text-zinc-500 mt-1">Gửi hoặc yêu cầu từ danh sách liên hệ</p>
        </div>
        <Button variant="ghost" size="icon" className="hover:bg-zinc-100 rounded-full">
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {displayActivities.map((activity, index) => (
          <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer min-w-[60px]">
            <div className="relative">
              <Avatar className="w-14 h-14 border-2 border-transparent group-hover:border-zinc-200 transition-all">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback className="bg-zinc-100 text-zinc-600 font-semibold">
                  {activity.user[0]}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator mock */}
              {index < 2 && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
            </div>
            <span className="text-xs font-medium text-zinc-600 truncate max-w-[70px]">{activity.user.split(' ')[0]}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[60px]">
          <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center border-2 border-dashed border-zinc-300 text-zinc-400 group-hover:border-zinc-400 group-hover:text-zinc-500 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-zinc-600">Thêm</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          className="flex-1 bg-[#18181b] text-white hover:bg-zinc-800 rounded-2xl h-12 font-semibold shadow-lg shadow-zinc-200"
          asChild
        >
          <Link href="/admin/users/create">
            <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center mr-2">
              <Plus className="w-3 h-3" />
            </div>
            Thêm mới
          </Link>
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-2xl h-12 font-semibold"
          asChild
        >
          <Link href="/admin/organizers">
            <Pencil className="w-4 h-4 mr-2" />
            Quản lý
          </Link>
        </Button>
      </div>
    </Card>
  );
}
