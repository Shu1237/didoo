"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Layout, Tag, Clock, CheckCircle2, XCircle, Loader2, MapPin } from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";

interface EventDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onApprove: (event: Event) => void;
    onReject: (event: Event) => void;
    isUpdating: boolean;
}

export default function EventDetailModal({ isOpen, onClose, event, onApprove, onReject, isUpdating }: EventDetailModalProps) {
    if (!event) return null;

    const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-[50%] data-[state=open]:duration-500">
                {/* Banner Section */}
                <div className="relative h-48 w-full shrink-0">
                    <img src={event.bannerUrl || event.thumbnailUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop"} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                        <div className="min-w-0">
                            <Badge className="bg-white/20 backdrop-blur-md text-white border-none text-[10px] mb-2">{event.category?.name || "Sự kiện"}</Badge>
                            <DialogTitle className="text-2xl font-bold text-white tracking-tight">{event.name}</DialogTitle>
                        </div>
                        <Badge className={`text-white border-none px-3 py-1 rounded-full text-[10px] font-bold ${event.status === 1 ? "bg-emerald-500" : "bg-amber-500"}`}>
                            {event.status === 0 ? "Chờ duyệt" : "Đang diễn ra"}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <Section icon={<Layout className="w-3.5 h-3.5" />} title="Mô tả sự kiện">
                            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 text-[13px] text-zinc-600 leading-relaxed font-medium">
                                {event.description || "Chưa có mô tả chi tiết."}
                            </div>
                        </Section>

                        {/* Time & Location */}
                        <div className="grid grid-cols-2 gap-6">
                            <Section icon={<Clock className="w-3.5 h-3.5" />} title="Thời gian">
                                <div className="space-y-2">
                                    <TimeItem label="Bắt đầu" value={formatDate(event.startTime)} />
                                    <TimeItem label="Kết thúc" value={formatDate(event.endTime)} />
                                </div>
                            </Section>
                            <Section icon={<MapPin className="w-3.5 h-3.5" />} title="Địa điểm">
                                <div className="space-y-2">
                                    {event.locations?.length ? event.locations.map((loc, i) => (
                                        <div key={i} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase">{loc.name}</p>
                                            <p className="text-xs font-semibold text-zinc-900 leading-tight">{loc.address}</p>
                                        </div>
                                    )) : <p className="text-xs text-zinc-400 italic mt-2">Chưa xác định</p>}
                                </div>
                            </Section>
                        </div>

                        {/* Tags */}
                        <Section icon={<Tag className="w-3.5 h-3.5" />} title="Tags">
                            <div className="flex flex-wrap gap-2">
                                {event.tags?.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="rounded-full px-3 text-[10px] font-bold text-zinc-500">#{tag.tagName}</Badge>
                                )) || <span className="text-xs text-zinc-400 italic">Không có tags</span>}
                            </div>
                        </Section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="p-6 bg-zinc-900 rounded-[32px] text-white">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4">Nhà tổ chức</h5>
                            <div className="flex items-center gap-3 mb-6">
                                <Avatar className="w-10 h-10 border border-white/10 shrink-0">
                                    <AvatarImage src={event.organizer?.logoUrl} />
                                    <AvatarFallback className="bg-white/10">{event.organizer?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold truncate">{event.organizer?.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5 text-blue-400">
                                        <Shield className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase">Verified Vendor</span>
                                    </div>
                                </div>
                            </div>
                            <SidebarItem label="Email liên hệ" value={event.organizer?.email} />
                            <SidebarItem label="Số lượng vé" value={`${event.sold || 0} / ${event.total || 0} vé đã bán`} />
                        </div>

                        {event.status === 0 && (
                            <div className="p-6 bg-amber-50 rounded-[32px] border border-amber-100">
                                <h5 className="text-[10px] font-bold text-amber-700 uppercase mb-3">Phê duyệt</h5>
                                <div className="space-y-2">
                                    <ActionButton onClick={() => onApprove(event)} isUpdating={isUpdating} icon={<CheckCircle2 className="w-4 h-4" />} label="Duyệt hiển thị" primary />
                                    <ActionButton onClick={() => onReject(event)} isUpdating={isUpdating} icon={<XCircle className="w-4 h-4" />} label="Từ chối" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-100 bg-slate-50/50 flex justify-end">
                    <Button variant="ghost" onClick={onClose} className="rounded-full px-8 text-xs font-bold text-zinc-500 h-10">Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper components for clean code
const Section = ({ icon, title, children }: any) => (
    <div className="space-y-3">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            {icon} {title}
        </h4>
        {children}
    </div>
);

const TimeItem = ({ label, value }: { label: string, value: string }) => (
    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
        <p className="text-[9px] font-bold text-zinc-400 uppercase mb-0.5">{label}</p>
        <p className="text-xs font-bold text-zinc-900 leading-none">{value}</p>
    </div>
);

const SidebarItem = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col mb-4 last:mb-0">
        <span className="text-[9px] font-bold uppercase opacity-40 mb-1">{label}</span>
        <p className="text-xs font-bold truncate opacity-90">{value || "N/A"}</p>
    </div>
);

const ActionButton = ({ onClick, isUpdating, icon, label, primary }: any) => (
    <Button
        onClick={onClick}
        disabled={isUpdating}
        variant={primary ? "default" : "ghost"}
        className={`w-full rounded-2xl h-11 font-bold text-xs gap-2 transition-all active:scale-95 ${primary ? "bg-zinc-900 text-white shadow-lg" : "text-rose-600 hover:bg-rose-100"}`}
    >
        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{icon} {label}</>}
    </Button>
);