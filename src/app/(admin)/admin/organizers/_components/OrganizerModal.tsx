"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail, Phone, MapPin, Globe2, Facebook, Instagram, Loader2, Check, X } from "lucide-react";
import { Organizer } from "@/types/organizer";
import { OrganizerStatus } from "@/utils/enum";
import { Button } from "@/components/ui/button";

interface OrganizerModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizer: Organizer | null;
    onApprove: (org: Organizer) => void | Promise<void>;
    onReject: (org: Organizer) => void | Promise<void>;
    isUpdating: boolean;
}

export default function OrganizerModal({
    isOpen,
    onClose,
    organizer,
    onApprove,
    onReject,
    isUpdating,
}: OrganizerModalProps) {
    if (!organizer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-2xl gap-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-[50%] data-[state=open]:duration-500">
                {/* Banner Section */}
                <div className="relative h-48 w-full bg-zinc-100">
                    {organizer.bannerUrl ? (
                        <img
                            src={organizer.bannerUrl}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200" />
                    )}
                </div>

                {/* Header Section with Avatar Overlap */}
                <DialogHeader className="px-8 pb-6 pt-0 relative border-b border-zinc-50 bg-white">
                    <div className="flex items-end gap-6 -mt-12">
                        <Avatar className="w-28 h-28 border-[6px] border-white shadow-xl shrink-0">
                            <AvatarImage src={organizer.logoUrl || ""} className="object-cover" />
                            <AvatarFallback className="text-3xl font-bold bg-zinc-100 text-zinc-400">
                                {organizer.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 pb-2">
                            <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                                {organizer.name}
                            </DialogTitle>
                            <DialogDescription asChild>
                                <div className="text-xs font-semibold text-zinc-500 mt-2 flex items-center gap-2">
                                    <Badge
                                        className={`text-white hover:text-white rounded-full px-3 py-0.5 border-none pointer-events-none uppercase text-[9px] tracking-widest ${organizer.status === OrganizerStatus.PENDING
                                            ? "bg-amber-500"
                                            : organizer.status === OrganizerStatus.VERIFIED
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {organizer.status === OrganizerStatus.PENDING
                                            ? "Chờ phê duyệt"
                                            : organizer.status === OrganizerStatus.VERIFIED
                                                ? "Đã phê duyệt"
                                                : "Từ chối"}
                                    </Badge>
                                    {organizer.isVerified && (
                                        <Badge className="bg-blue-500 text-white border-none text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Shield className="w-2.5 h-2.5" />
                                            Đã xác minh
                                        </Badge>
                                    )}
                                </div>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content Section */}
                <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-none pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Column 1: Info */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Thông tin liên hệ</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-zinc-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase">Email</p>
                                            <p className="font-semibold text-zinc-900 break-all">{organizer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-zinc-50 rounded-lg">
                                            <Phone className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase">Số điện thoại</p>
                                            <p className="font-semibold text-zinc-900">{organizer.phone || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-zinc-50 rounded-lg">
                                            <MapPin className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase">Địa chỉ</p>
                                            <p className="font-medium text-zinc-600 italic leading-relaxed text-sm">{organizer.address || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Mạng xã hội</h4>
                                <div className="flex flex-wrap gap-3">
                                    {organizer.websiteUrl && (
                                        <a href={organizer.websiteUrl} target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all border border-zinc-100 shadow-sm">
                                            <Globe2 className="w-5 h-5 text-zinc-600" />
                                        </a>
                                    )}
                                    {organizer.facebookUrl && (
                                        <a href={organizer.facebookUrl} target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all border border-zinc-100 shadow-sm">
                                            <Facebook className="w-5 h-5 text-blue-600" />
                                        </a>
                                    )}
                                    {organizer.instagramUrl && (
                                        <a href={organizer.instagramUrl} target="_blank" rel="noreferrer" className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all border border-zinc-100 shadow-sm">
                                            <Instagram className="w-5 h-5 text-pink-600" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: About & Dates */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Giới thiệu</h4>
                                <div className="p-6 bg-zinc-50/50 rounded-[24px] border border-zinc-100 text-sm text-zinc-600 leading-relaxed font-medium">
                                    {organizer.description || "Nhà tổ chức này chưa cung cấp mô tả chi tiết."}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Ngày tham gia</p>
                                    <p className="text-sm font-bold text-zinc-900">
                                        {organizer.createdAt ? new Date(organizer.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                    </p>
                                </div>
                                <div className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Cập nhật lần cuối</p>
                                    <p className="text-sm font-bold text-zinc-900">
                                        {organizer.updatedAt ? new Date(organizer.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                {organizer.status === OrganizerStatus.PENDING && (
                    <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onReject(organizer)}
                            disabled={isUpdating}
                            className="rounded-2xl border-zinc-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-bold px-6 h-11"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
                            Từ chối
                        </Button>
                        <Button
                            onClick={() => onApprove(organizer)}
                            disabled={isUpdating}
                            className="rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 h-11 shadow-lg shadow-zinc-200"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            Duyệt & Xác minh Organizer
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}