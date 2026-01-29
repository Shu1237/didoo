'use client';

import React from "react";
import { motion } from "framer-motion";
import { Info, ShieldCheck, AlertCircle, Ticket, Clock, User, Calendar, Star } from "lucide-react";
import { Event } from "@/utils/type";
import Image from "next/image";

interface EventInforProps {
    event: Event;
}

export default function EventInfor({ event }: EventInforProps) {
    // Generate some mock rich content if description is short (for design demo)
    const longDescription = event.description.length < 100
        ? `${event.description} Đây là sự kiện được mong chờ nhất năm với sự góp mặt của nhiều nghệ sĩ nổi tiếng. Chương trình hứa hẹn mang đến những màn trình diễn bùng nổ, âm thanh ánh sáng đẳng cấp quốc tế. Không chỉ là âm nhạc, đây còn là nơi kết nối những tâm hồn đồng điệu, tạo nên những kỷ niệm khó quên. Hãy chuẩn bị sẵn sàng cho một đêm không ngủ cùng chúng tôi!`
        : event.description;

    return (
        <section className="container mx-auto px-4 max-w-7xl pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                {/* LEFT CONTENT - About & Organizer */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 space-y-10"
                >
                    {/* About Section */}
                    <div className="bg-white/60 dark:bg-card/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            Giới thiệu sự kiện
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p className="mb-4 text-lg">{longDescription}</p>
                            <p>
                                Sự kiện được tổ chức chuyên nghiệp với quy mô lớn, đảm bảo an ninh và trải nghiệm tốt nhất cho khán giả.
                                Các khu vực tiện ích bao gồm: Quầy F&B đa dạng, Khu vực check-in sống ảo, Khu vực Y tế & Hỗ trợ.
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-8">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                #{event.category}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20">
                                #LiveEvent
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                                #2024
                            </span>
                        </div>
                    </div>

                    {/* Organizer Section */}
                    <div className="bg-white/60 dark:bg-card/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-28 h-28 shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                            <Image
                                src={event.organizer?.avatar || "https://i.pravatar.cc/150?u=org"}
                                alt={event.organizer?.name || "Organizer"}
                                fill
                                className="object-cover rounded-full border-4 border-background relative z-10"
                            />
                            <div className="absolute bottom-0 right-0 z-20 bg-blue-500 text-white p-1 rounded-full border-2 border-background">
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Ban tổ chức</h3>
                            <h4 className="text-2xl font-bold text-foreground mb-2">{event.organizer?.name || "Organizer Name"}</h4>
                            <p className="text-muted-foreground max-w-md">
                                Đơn vị tổ chức sự kiện chuyên nghiệp với hơn 10 năm kinh nghiệm trong ngành giải trí và sự kiện.
                            </p>
                        </div>
                        <button className="md:ml-auto px-6 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors">
                            Xem hồ sơ
                        </button>
                    </div>

                </motion.div>

                {/* RIGHT SIDEBAR - Important Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white/60 dark:bg-card/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 sticky top-24 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <Info className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Lưu ý quan trọng</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Item 1 */}
                            <div className="group flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-background flex shrink-0 items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1">Thời gian Check-in</h4>
                                    <p className="text-sm text-muted-foreground">Vui lòng có mặt trước <span className="text-primary font-bold">2 tiếng</span> để hoàn tất thủ tục an ninh.</p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="group flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-background flex shrink-0 items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                    <Ticket className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1">Vé sự kiện</h4>
                                    <p className="text-sm text-muted-foreground">Không hoàn tiền. Giữ mã QR cẩn thận để quét tại cổng.</p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="group flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-background flex shrink-0 items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1">Độ tuổi</h4>
                                    <p className="text-sm text-muted-foreground">Sự kiện dành cho khán giả trên <span className="text-primary font-bold">16 tuổi</span>. Mang theo CCCD.</p>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="group flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-background flex shrink-0 items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1">An ninh</h4>
                                    <p className="text-sm text-muted-foreground">Không mang vũ khí, chất cháy nổ. Tuân thủ hướng dẫn của BTC.</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs text-muted-foreground">
                                Cần hỗ trợ? <a href="#" className="text-primary underline">Liên hệ BTC</a>
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
