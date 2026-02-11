"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Ticket, Clock, Info, AlignLeft } from "lucide-react";

export type EventModalMode = "CREATE" | "EDIT" | "DETAIL";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: EventModalMode;
    event?: any;
}

export default function EventModal({ isOpen, onClose, mode, event }: EventModalProps) {
    const isDetail = mode === "DETAIL";
    const title = mode === "CREATE" ? "Tạo sự kiện mới" : mode === "EDIT" ? "Chỉnh sửa sự kiện" : "Chi tiết sự kiện";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-2xl border-none bg-white p-0 overflow-hidden shadow-2xl">
                {/* Header sạch sẽ hơn */}
                <DialogHeader className="p-6 border-b border-zinc-100 bg-white">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                            {title}
                        </DialogTitle>
                        {isDetail && (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-medium px-3 py-1 rounded-full">
                                {event?.status || "Đang diễn ra"}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="p-6 max-h-[75vh] overflow-auto scrollbar-thin">
                    {isDetail ? (
                        <div className="space-y-6">
                            {/* Section: Thông tin chính */}
                            <div className="space-y-1.5">
                                <p className="text-2xl font-bold text-zinc-900 tracking-tight">{event?.title || "Tên sự kiện chưa cập nhật"}</p>
                                <div className="flex items-center text-zinc-600 gap-2 text-sm font-medium">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    <span>{event?.location || "Trung tâm Hội nghị Quốc gia, Hà Nội"}</span>
                                </div>
                            </div>

                            {/* Grid thông số */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-zinc-600">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Ngày diễn ra</span>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900">{event?.date || "Chưa có ngày"}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-zinc-600">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Thời gian</span>
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900">{event?.time || "19:00 - 22:00"}</p>
                                </div>
                            </div>

                            {/* Progress Bar (Vé) */}
                            <div className="p-5 rounded-xl border border-zinc-200 bg-indigo-50/30">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-5 h-5 text-indigo-600" />
                                        <span className="text-sm font-bold text-zinc-900">Tình trạng vé</span>
                                    </div>
                                    <span className="text-sm font-bold text-zinc-600">
                                        <b className="text-indigo-700">{event?.sold || 0}</b> / {event?.total || 100}
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-zinc-200 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out shadow-sm"
                                        style={{ width: `${((event?.sold || 0) / (event?.total || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-600 font-medium italic">
                                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Hệ thống sẽ tự động đóng khi hết vé.</span>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                                    <AlignLeft className="w-4 h-4 text-indigo-500" />
                                    Mô tả sự kiện
                                </div>
                                <div className="text-sm text-zinc-700 leading-relaxed p-5 rounded-xl bg-zinc-50 border border-zinc-200 font-medium">
                                    {event?.description || "Sự kiện âm nhạc quy mô lớn với sự tham gia của các nghệ sĩ hàng đầu. Đừng bỏ lỡ những giây phút bùng nổ và cảm xúc nhất trong năm."}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Form Create/Edit tinh tế hơn */
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 space-y-2.5">
                                    <Label className="text-sm font-bold text-zinc-900">Tên sự kiện</Label>
                                    <Input
                                        defaultValue={event?.title}
                                        placeholder="Ví dụ: Hội thảo công nghệ 2024"
                                        className="h-12 rounded-xl border-zinc-300 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-bold text-zinc-900">Ngày tổ chức</Label>
                                    <Input
                                        defaultValue={event?.date}
                                        type="date"
                                        className="h-12 rounded-xl border-zinc-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-bold text-zinc-900">Số lượng vé</Label>
                                    <Input
                                        defaultValue={event?.total}
                                        type="number"
                                        placeholder="100"
                                        className="h-12 rounded-xl border-zinc-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-sm font-bold text-zinc-900">Địa điểm</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input
                                        placeholder="Nhập địa chỉ tổ chức..."
                                        className="pl-11 h-12 rounded-xl border-zinc-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-sm font-bold text-zinc-900">Mô tả sự kiện</Label>
                                <Textarea
                                    placeholder="Viết nội dung sự kiện tại đây..."
                                    className="min-h-[120px] rounded-xl border-zinc-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none p-4"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer với Button hiện đại */}
                <div className="p-6 border-t border-zinc-100 bg-zinc-50/80 flex justify-end gap-3.5">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl px-8 font-bold text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-all h-12">
                        {isDetail ? "Đóng" : "Hủy"}
                    </Button>
                    {!isDetail && (
                        <Button className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all h-12">
                            {mode === "CREATE" ? "Tạo sự kiện" : "Cập nhật ngay"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}