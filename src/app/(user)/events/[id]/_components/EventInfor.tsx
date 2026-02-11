'use client';

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Ticket, Clock, Zap, Globe, Cpu, Music, Wind } from "lucide-react";
import { Event } from "@/utils/type";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EventInforProps {
    event: Event;
}

export default function EventInfor({ event }: EventInforProps) {
    const longDescription = event.description.length < 100
        ? `${event.description} Đây là sự kiện công nghệ được mong đợi nhất mùa giải. Tham gia cùng chúng tôi để có trải nghiệm tuyệt vời nơi nghệ thuật và đổi mới giao thoa.`
        : event.description;

    return (
        <section className="relative py-24 bg-[#050505] overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[160px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-purple-600/5 blur-[140px] rounded-full" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

                    {/* LEFT: MAIN CONTENT (8 columns) */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* Header & Story */}
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10"
                            >
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[11px] font-bold text-white/70 uppercase tracking-[0.2em]">Core Narrative</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <h2 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                                    Artistic <span className="text-primary italic">Manifesto.</span>
                                </h2>

                                <div className="grid md:grid-cols-5 gap-8 items-start">
                                    <div className="md:col-span-3">
                                        <p className="text-2xl font-light text-white/90 leading-tight">
                                            {longDescription}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2 pt-2">
                                        <p className="text-sm text-white/40 leading-relaxed border-l border-white/10 pl-6">
                                            Chúng tôi từ chối những điều bình thường. Trải nghiệm này được thiết kế dành cho những người tìm kiếm ranh giới của những gì có thể trong sự tổng hợp kỹ thuật số và vật lý.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Tech Specs - Kiểu dáng thanh lịch hơn */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
                            {[
                                { label: "Resolution", value: "Native 8K", icon: Cpu },
                                { label: "Audio", value: "Dolby Atmos", icon: Music },
                                { label: "Connectivity", value: "WiFi 7", icon: Globe },
                                { label: "Environment", value: "Climate Control", icon: Wind }
                            ].map((spec, i) => (
                                <div key={i} className="bg-[#080808] p-8 flex flex-col gap-4 group hover:bg-[#0c0c0c] transition-colors">
                                    <spec.icon className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{spec.label}</p>
                                        <p className="text-sm font-bold text-white">{spec.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Operational Intel - Layout gom cụm lại */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: Clock, label: "Check-in Protocol", val: "Strictly 30m prior", desc: "Không cho phép vào cửa muộn để đảm bảo đồng bộ hóa thị giác." },
                                { icon: Ticket, label: "ID Verification", val: "NFC Digital Pass", desc: "Không chấp nhận vé giấy hoặc ảnh chụp màn hình QR." },
                                { icon: ShieldCheck, label: "Privacy Policy", val: "NDA Enforced", desc: "Hạn chế khu vực ghi hình để bảo vệ tính nhập vai." },
                                { icon: Globe, label: "Language", val: "English / Vietnamese", desc: "Dịch thuật thời gian thực có sẵn qua tai nghe." }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex gap-6 items-center"
                                >
                                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-white tracking-tight">{item.val}</h4>
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: SIDEBAR (4 columns) - Làm gọn và chắc chắn hơn */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-8 shadow-2xl">
                                <div className="text-center space-y-6">
                                    <div className="relative w-28 h-28 mx-auto">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
                                            <Image
                                                src={event.organizer?.avatar || "https://i.pravatar.cc/150?u=org"}
                                                alt="Organizer"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Architected By</p>
                                        <h3 className="text-3xl font-bold text-white tracking-tighter italic">
                                            {event.organizer?.name || "Foodie Group"}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-white/40 leading-relaxed italic px-4">
                                        "Transforming space and time into unforgettable digital legacies."
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <Button className="w-full h-14 rounded-2xl bg-primary text-black hover:bg-white transition-all font-bold uppercase text-[11px] tracking-widest">
                                        Follow Organizer
                                    </Button>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-black font-bold uppercase text-[11px] tracking-widest">
                                        Contact Studio
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Badge - Kiểu dáng tối giản */}
                            <div className="px-8 py-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                    100% Secure Transaction & Entry
                                </span>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </section>
    );
}