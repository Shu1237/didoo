'use client';

import React from "react";
import { motion } from "framer-motion";
import { Info, ShieldCheck, AlertCircle, Ticket, Clock } from "lucide-react";

export default function EventInfor() {
    return (
        <section className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-background/60 dark:bg-card/30 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-10 border-b border-border/40 pb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Info className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Thông tin quan trọng</h2>
                </div>

                {/* Content Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed">

                    {/* Column 1 */}
                    <div className="space-y-8">
                        {/* Section 1 */}
                        <div className="group">
                            <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                1. Quy định chung
                            </h3>
                            <ul className="space-y-2 list-disc pl-5 marker:text-primary/50 text-sm md:text-base">
                                <li>Khán giả có trách nhiệm bảo quản tài sản cá nhân.</li>
                                <li>Mỗi tài khoản được phép mua tối đa 10 vé mỗi lần.</li>
                                <li>Vé bị lộ thông tin sẽ không được hỗ trợ giải quyết.</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="group">
                            <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <AlertCircle className="w-5 h-5 text-primary" />
                                2. Quy định về độ tuổi
                            </h3>
                            <ul className="space-y-2 list-disc pl-5 marker:text-primary/50 text-sm md:text-base">
                                <li>Sự kiện không phù hợp cho trẻ em dưới 5 tuổi.</li>
                                <li>Người giám hộ đi cùng phải chịu trách nhiệm hoàn toàn.</li>
                                <li>Ban Tổ Chức không chịu trách nhiệm nếu không tuân thủ.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-8">
                        {/* Section 3 */}
                        <div className="group">
                            <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <Ticket className="w-5 h-5 text-primary" />
                                3. Quy định về sử dụng vé
                            </h3>
                            <ul className="space-y-2 list-disc pl-5 marker:text-primary/50 text-sm md:text-base">
                                <li>Vé đã mua không hoàn tiền dưới mọi hình thức chiều lòng.</li>
                                <li>Người mua không được phép chỉnh sửa thông tin vé.</li>
                                <li>Khán giả cần giữ vé nguyên vẹn mã vạch để check-in.</li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div className="group">
                            <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                                <Clock className="w-5 h-5 text-primary" />
                                4. Thời gian check-in
                            </h3>
                            <ul className="space-y-2 list-disc pl-5 marker:text-primary/50 text-sm md:text-base">
                                <li>Cổng check-in mở trước giờ diễn ra 2 tiếng.</li>
                                <li>Vui lòng đến sớm để hoàn tất thủ tục an ninh.</li>
                                <li>BTC có quyền từ chối vào cửa nếu đến quá trễ.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
