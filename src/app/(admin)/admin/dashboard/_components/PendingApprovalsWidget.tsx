"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Search, Filter, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetOrganizers, useOrganizer } from "@/hooks/useOrganizer";
import { OrganizerStatus } from "@/utils/enum";
import { toast } from "sonner";
import Loading from "@/components/loading";

export default function PendingApprovalsWidget() {
    const { data: organizersRes, isLoading } = useGetOrganizers({
        status: OrganizerStatus.PENDING,
        pageSize: 10,
    });
    const { update } = useOrganizer();

    const organizers = organizersRes?.data?.items || [];

    const handleAction = async (org: any, status: OrganizerStatus) => {
        const actionName = status === OrganizerStatus.VERIFIED ? "Phê duyệt" : "Từ chối";
        let message = `Bạn có chắc chắn muốn ${actionName.toLowerCase()} organizer "${org.name}" không?`;

        if (status === OrganizerStatus.VERIFIED && !org.isVerified) {
            message += "\n\nCẢNH BÁO: Organizer này CHƯA được verify danh tính!";
        }

        if (!window.confirm(message)) return;

        try {
            await update.mutateAsync({ id: org.id, body: { status } as any });
            toast.success(status === OrganizerStatus.VERIFIED ? "Đã phê duyệt!" : "Đã từ chối!");
        } catch (err) { }
    };

    if (isLoading) return <Loading />;

    return (
        <Card className="p-6 bg-white border-none shadow-sm rounded-[32px] flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 className="font-bold text-xl text-zinc-900 tracking-tight">Phê duyệt</h3>
                    <p className="text-sm text-zinc-500 mt-0.5 font-semibold">Danh sách các yêu cầu đang chờ</p>
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 hover:bg-zinc-100">
                        <Search className="w-5 h-5 text-zinc-400" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 hover:bg-zinc-100">
                        <Filter className="w-5 h-5 text-zinc-400" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-50 shrink-0">
                <div className="col-span-5">Tên tổ chức</div>
                <div className="col-span-4">Thời gian đăng ký</div>
                <div className="col-span-3 text-right">Thao tác</div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 mt-2 pr-1 space-y-1 scrollbar-thin">
                {organizers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-zinc-400 font-bold italic text-sm">
                        Không có yêu cầu nào đang chờ
                    </div>
                ) : (
                    organizers.map((org) => (
                        <div key={org.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-zinc-50 rounded-2xl transition-all group">
                            <div className="col-span-5 flex items-center gap-3 min-w-0">
                                <Avatar className="w-10 h-10 border border-zinc-100 shrink-0">
                                    <AvatarImage src={org.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${org.name}`} />
                                    <AvatarFallback>{org.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-zinc-900 truncate tracking-tight">{org.name}</h4>
                                    <p className="text-[10px] text-zinc-400 truncate font-bold uppercase tracking-wider">{org.email}</p>
                                </div>
                            </div>

                            <div className="col-span-4 text-[11px] font-bold text-zinc-500 truncate">
                                {org.createdAt ? new Date(org.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                            </div>

                            <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleAction(org, OrganizerStatus.VERIFIED)}
                                        disabled={update.isPending}
                                        size="icon"
                                        className="w-8 h-8 rounded-full bg-zinc-900 text-white hover:bg-primary shadow-lg shadow-zinc-200 transition-all active:scale-90"
                                    >
                                        {update.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(org, OrganizerStatus.BANNED)}
                                        disabled={update.isPending}
                                        size="icon"
                                        variant="outline"
                                        className="w-8 h-8 rounded-full border-zinc-200 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-4 mt-2 border-t border-zinc-50 shrink-0">
                <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 transition-all"
                    asChild
                >
                    <Link href="/admin/organizers">
                        Xem tất cả yêu cầu
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
