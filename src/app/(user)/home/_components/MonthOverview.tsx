'use client';

import { Calendar, Flame, LayoutGrid, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export const MonthOverview = () => {
    return (
        <section className="py-12 bg-gradient-to-b from-transparent to-primary/5 rounded-[3rem] my-12 px-4 md:px-12">
            <SectionHeader
                title="MONTHLY OVERVIEW"
                subtitle="A comprehensive look at all activities and happenings throughout the month."
                icon={LayoutGrid}
            />
            <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-2xl space-y-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2">Sự kiện định kỳ</h4>
                        <p className="text-muted-foreground text-sm">Workshop mỗi cuối tuần, Chợ phiên chủ nhật...</p>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl space-y-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2">Chiến dịch dài hạn</h4>
                        <p className="text-muted-foreground text-sm">Lễ hội Ánh Sáng (Kéo dài đến 30/10), Triển lãm Tech Expo...</p>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl space-y-4">
                    <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-2">Danh sách chờ</h4>
                        <p className="text-muted-foreground text-sm">Các sự kiện Hot sắp mở bán vé vào cuối tháng.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
