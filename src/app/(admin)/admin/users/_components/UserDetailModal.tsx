"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail, Phone, MapPin, Loader2, Calendar, User as UserIcon, Lock, Unlock } from "lucide-react";
import { User } from "@/types/user";

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onToggleStatus: (user: User) => void;
    isUpdating: boolean;
}

export default function UserDetailModal({
    isOpen,
    onClose,
    user,
    onToggleStatus,
    isUpdating,
}: UserDetailModalProps) {
    if (!user) return null;

    const isBlocked = user.status === "Blocked";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-[50%] data-[state=open]:duration-500">
                <DialogHeader className="p-8 border-b border-zinc-100 bg-slate-50/50">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg shrink-0">
                            <AvatarImage src={user.avatarUrl || ""} />
                            <AvatarFallback className="text-2xl font-bold bg-zinc-200 text-zinc-600">
                                {user.fullName?.[0] || user.email[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                                    {user.fullName || "N/A"}
                                </DialogTitle>
                                {user.isVerified && (
                                    <Badge className="bg-blue-500 text-white border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0 rounded-full flex items-center gap-1">
                                        <Shield className="w-2.5 h-2.5" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <DialogDescription asChild>
                                <div className="text-xs font-semibold text-zinc-500 mt-1 flex items-center gap-2">
                                    <Badge className="bg-zinc-100 text-zinc-600 border-none rounded-full px-2.5 py-0 text-[10px] font-bold uppercase tracking-wider">
                                        {user.role?.name || "User"}
                                    </Badge>
                                    <Badge
                                        className={`text-white hover:text-white rounded-full px-3 py-0 border-none pointer-events-none uppercase text-[9px] tracking-widest ${isBlocked ? "bg-red-500" : "bg-green-500"
                                            }`}
                                    >
                                        {user.status || "Active"}
                                    </Badge>
                                </div>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-[9px]">Thông tin liên hệ</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Email</p>
                                            <p className="font-semibold text-zinc-900 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                                            <Phone className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Số điện thoại</p>
                                            <p className="font-semibold text-zinc-900">{user.phone || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                                            <MapPin className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Địa chỉ</p>
                                            <p className="font-semibold text-zinc-900 italic text-xs">{user.address || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Metadata */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-[9px]">Thông tin cá nhân</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Giới tính</p>
                                        </div>
                                        <p className="text-xs font-bold text-zinc-900">
                                            {user.gender === 0 ? "Nam" : user.gender === 1 ? "Nữ" : "Khác"}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Ngày sinh</p>
                                        </div>
                                        <p className="text-xs font-bold text-zinc-900">
                                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-900 rounded-2xl text-white shadow-xl shadow-zinc-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Status Actions</h5>
                                    <Badge className={isBlocked ? "bg-rose-500 text-[9px]" : "bg-emerald-500 text-[9px]"}>
                                        {user.status || "Active"}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
                                    {isBlocked
                                        ? "Người dùng này đang bị khóa. Bạn có thể mở khóa để họ tiếp tục sử dụng dịch vụ."
                                        : "Người dùng đang hoạt động bình thường. Khóa người dùng nếu họ vi phạm chính sách."}
                                </p>
                                <Button
                                    onClick={() => onToggleStatus(user)}
                                    disabled={isUpdating}
                                    variant={isBlocked ? "default" : "destructive"}
                                    className="w-full h-10 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                            {isBlocked ? "Mở khóa ngay" : "Khóa người dùng"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-zinc-100 bg-slate-50/50 flex justify-end shrink-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-full px-8 font-bold text-xs text-zinc-500 hover:bg-zinc-200 h-11 transition-all">
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
