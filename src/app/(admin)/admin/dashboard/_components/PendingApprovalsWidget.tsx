"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Search, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

// 1. Đảm bảo mảng dữ liệu này nằm TRƯỚC hàm Export
const pendingOrganizers = [
    { id: 1, name: "Starlight Events", date: "22/07/2024, 16:43", status: "Đã thu", amount: "+ 5.000.000 đ" },
    { id: 2, name: "Mega Show Corp", date: "21/07/2024, 12:22", status: "Chờ xử lý", amount: "- 500.000 đ" },
    { id: 3, name: "Indie Music VN", date: "21/07/2024, 11:38", status: "Thanh toán", amount: "- 600.000 đ" },
    { id: 4, name: "Tech Startup", date: "21/07/2024, 10:22", status: "Đã thu", amount: "+ 10.000.000 đ" },
    { id: 5, name: "Art Gallery", date: "20/07/2024, 16:43", status: "Đã thu", amount: "+ 2.500.000 đ" },
    { id: 6, name: "Music Fest", date: "20/07/2024, 18:43", status: "Đã chi", amount: "- 1.500.000 đ" },
];

export default function PendingApprovalsWidget() {
    return (
        <Card className="p-6 bg-white border-none shadow-sm rounded-[32px] flex flex-col h-full min-h-0 overflow-hidden">
            {/* Header - shrink-0 giữ cố định */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 className="font-bold text-xl text-zinc-900">Phê duyệt</h3>
                    <p className="text-sm text-zinc-500 mt-0.5">Danh sách các yêu cầu đang chờ</p>
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

            {/* Table Header - shrink-0 giữ cố định */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-zinc-400 border-b border-zinc-50 shrink-0">
                <div className="col-span-4">Tên</div>
                <div className="col-span-4 text-center lg:text-left">Thời gian</div>
                <div className="col-span-2">Trạng thái</div>
                <div className="col-span-2 text-right">Số tiền</div>
            </div>

            {/* Scrollable Area - flex-1 để chiếm diện tích còn lại và tự cuộn */}
            <div className="flex-1 overflow-y-auto min-h-0 mt-2 pr-1 space-y-1 scrollbar-hide">
                {pendingOrganizers.map((org) => (
                    <div key={org.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-zinc-50 rounded-2xl transition-all group">
                        <div className="col-span-4 flex items-center gap-3 min-w-0">
                            <Avatar className="w-9 h-9 border border-zinc-100 shrink-0">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${org.name}`} />
                                <AvatarFallback>{org.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <h4 className="font-bold text-sm text-zinc-900 truncate">{org.name}</h4>
                                <p className="text-[10px] text-zinc-400 truncate">#{1000 + org.id}</p>
                            </div>
                        </div>

                        <div className="col-span-4 text-[11px] font-medium text-zinc-500 truncate">
                            {org.date}
                        </div>

                        <div className="col-span-2">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${org.status === 'Đã thu' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                org.status === 'Đã chi' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                    'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${org.status === 'Đã thu' ? 'bg-emerald-500' :
                                    org.status === 'Đã chi' ? 'bg-indigo-500' : 'bg-rose-500'
                                    }`} />
                                <span className="hidden sm:inline">{org.status}</span>
                            </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-end gap-2 text-right">
                            <span className="text-sm font-bold text-zinc-900 group-hover:hidden block transition-all">{org.amount}</span>
                            <div className="hidden group-hover:flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                                <Button size="icon" className="w-7 h-7 rounded-full bg-zinc-900 text-white hover:bg-black">
                                    <Check className="w-3 h-3" />
                                </Button>
                                <Button size="icon" variant="outline" className="w-7 h-7 rounded-full border-zinc-200 text-zinc-400 hover:text-rose-600 hover:bg-rose-50">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer: Nút xem thêm cố định dưới đáy */}
            <div className="pt-4 mt-2 border-t border-zinc-50 shrink-0">
                <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl font-semibold text-sm h-11 transition-all"
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