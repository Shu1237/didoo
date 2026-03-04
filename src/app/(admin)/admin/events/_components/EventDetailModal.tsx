"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Clock,
    MapPin,
    Mail,
    Users,
    CheckCircle2,
    XCircle,
    Loader2,
} from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onApprove: (event: Event) => void;
    onReject: (event: Event) => void;
    isUpdating: boolean;
}

export default function EventDetailModal({
    isOpen,
    onClose,
    event,
    onApprove,
    onReject,
    isUpdating,
}: Props) {
    if (!event) return null;

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("vi-VN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="
          w-[96vw]
          max-w-[1280px]
          h-[90vh]
          p-0
          overflow-hidden
          rounded-2xl
          flex
          flex-col
        "
            >
                {/* ---------------- Banner ---------------- */}
                <div className="h-56 w-full bg-zinc-100 shrink-0">
                    {event.bannerUrl || event.thumbnailUrl ? (
                        <img
                            src={event.bannerUrl || event.thumbnailUrl}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200" />
                    )}
                </div>

                {/* ---------------- Header ---------------- */}
                <DialogHeader className="px-8 py-4 border-b bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border">
                            <AvatarImage src={event.thumbnailUrl || ""} />
                            <AvatarFallback>
                                {event.name?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">
                                    {event.category?.name || "Sự kiện"}
                                </Badge>

                                <Badge
                                    className={
                                        event.status === EventStatus.PUBLISHED
                                            ? "bg-emerald-500 text-white"
                                            : event.status === EventStatus.DRAFT
                                                ? "bg-amber-500 text-white"
                                                : "bg-zinc-500 text-white"
                                    }
                                >
                                    {event.status === EventStatus.DRAFT
                                        ? "Chờ duyệt"
                                        : "Đang hiển thị"}
                                </Badge>
                            </div>

                            <DialogTitle className="text-xl font-semibold truncate">
                                {event.name}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                {/* ---------------- Content ---------------- */}
                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* LEFT COLUMN */}
                        <div className="space-y-10">

                            <Section title="Mô tả">
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    {event.description || "Chưa có mô tả chi tiết."}
                                </p>
                            </Section>

                            <Section title="Thời gian & Địa điểm">
                                <InfoRow icon={<Calendar size={16} />} label="Bắt đầu">
                                    {formatDate(event.startTime)}
                                </InfoRow>

                                <InfoRow icon={<Clock size={16} />} label="Kết thúc">
                                    {formatDate(event.endTime)}
                                </InfoRow>

                                <InfoRow icon={<MapPin size={16} />} label="Địa điểm">
                                    {event.locations?.length
                                        ? event.locations.map((l) => l.name).join(", ")
                                        : "Chưa xác định"}
                                </InfoRow>
                            </Section>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-10">

                            <Section title="Nhà tổ chức">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={event.organizer?.logoUrl} />
                                        <AvatarFallback>
                                            {event.organizer?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {event.organizer?.name || "N/A"}
                                        </p>
                                        <p className="text-xs text-zinc-500 truncate flex items-center gap-1">
                                            <Mail size={12} />
                                            {event.organizer?.email || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-zinc-50 rounded-xl border">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500">Vé đã bán</span>
                                        <span className="font-semibold">
                                            {event.sold || 0} / {event.total || 0}
                                        </span>
                                    </div>

                                    <div className="mt-3 h-2 bg-zinc-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all"
                                            style={{
                                                width: `${event.total
                                                        ? ((event.sold || 0) / event.total) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </Section>

                        </div>
                    </div>
                </div>

                {/* ---------------- Footer ---------------- */}
                <div className="px-8 py-4 border-t bg-zinc-50 flex justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={onClose}>
                        Đóng
                    </Button>

                    {event.status === EventStatus.DRAFT && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onReject(event)}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <XCircle className="w-4 h-4 mr-2" />
                                )}
                                Từ chối
                            </Button>

                            <Button
                                onClick={() => onApprove(event)}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                Duyệt
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ---------------- Small Components ---------------- */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase text-zinc-400 mb-5">
                {title}
            </h4>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-zinc-400 mt-0.5">{icon}</div>
            <div>
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="text-sm font-medium text-zinc-800">
                    {children}
                </p>
            </div>
        </div>
    );
}