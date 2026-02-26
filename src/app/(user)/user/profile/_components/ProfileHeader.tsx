"use client";

import { useGetMe } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Mail, Shield, Settings, Rocket, Clock, CheckCircle2, Ban } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BecomeOrganizerForm from "./BecomeOrganizerForm";
import { OrganizerStatus } from "@/utils/enum";
import { useGetOrganizer } from "@/hooks/useOrganizer";

export default function ProfileSidebar() {
  const { data: userData } = useGetMe();
  const user = userData?.data;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: organizerData, isLoading: isOrganizerLoading } = useGetOrganizer(user?.organizerId ?? "");

  const initials = user?.fullName
    ? user.fullName.substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* Sidebar Card */}
      <Card className="glass-card bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Decorative Background */}
        <div className="h-24 bg-gradient-to-br from-[#FF9B8A] via-[#8A7CFF] to-[#6EC2FF] bg-[length:200%_200%] animate-gradient-x" />

        <div className="px-6 pb-8 -mt-12 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-[4px] border-white shadow-xl ring-1 ring-slate-200">
              <AvatarImage src="" alt={user?.fullName || "User"} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-800">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg" />
          </div>

          {/* User Info */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user?.fullName || "Người dùng"}</h1>
            <p className="text-slate-500 text-sm font-semibold flex items-center justify-center gap-1.5 leading-none">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || "Chưa đăng nhập"}
            </p>
          </div>

          {/* Stats or Additional Info */}
          <div className="grid grid-cols-2 w-full gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tickets</p>
              <p className="text-lg font-extrabold text-slate-800">0</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviews</p>
              <p className="text-lg font-extrabold text-slate-800">0</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Nav Links */}
      <div className="hidden lg:flex flex-col gap-1.5 p-2.5 bg-slate-100/50 border border-slate-200 rounded-2xl">
        <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Tài khoản</div>
        <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold bg-white text-slate-700 shadow-sm border border-slate-200/60 hover:border-slate-300 transition-all">
          <Settings className="w-4 h-4 text-slate-400" />
          Cài đặt chung
        </button>
        <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-700 hover:bg-white transition-all">
          <Shield className="w-4 h-4 text-slate-300" />
          Quyền riêng tư
        </button>

        {/* Chưa có organizerId → cho phép đăng ký */}
        {user?.role?.name.toLowerCase() === "user" && !user?.organizerId && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-orange-500 hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100 mt-2">
                <Rocket className="w-4 h-4" />
                Trở thành Organizer
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none overflow-hidden rounded-[32px]">
              <DialogTitle className="sr-only">Đăng ký trở thành Organizer</DialogTitle>
              <DialogDescription className="sr-only">Điền thông tin để đăng ký tài khoản tổ chức sự kiện.</DialogDescription>
              <BecomeOrganizerForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}

        {/* Có organizerId → hiển thị trạng thái */}
        {user?.organizerId && (() => {
          const status = organizerData?.data?.status;
          const isVerified = status === OrganizerStatus.VERIFIED;
          const isBanned = status === OrganizerStatus.BANNED;
          return (
            <div className={`mt-2 px-3.5 py-2.5 rounded-xl border text-[13px] font-bold flex items-center gap-2 ${
              isVerified ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
              : isBanned  ? 'text-red-500 bg-red-50 border-red-100'
              : 'text-amber-500 bg-amber-50 border-amber-100'
            }`}>
              {isOrganizerLoading ? (
                <span className="text-slate-400 font-medium">Đang tải...</span>
              ) : isVerified ? (
                <><CheckCircle2 className="w-4 h-4 shrink-0" /> Organizer đã xác minh</>
              ) : isBanned ? (
                <><Ban className="w-4 h-4 shrink-0" /> Organizer bị khóa</>
              ) : (
                <><Clock className="w-4 h-4 shrink-0" /> Đang chờ xét duyệt</>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
