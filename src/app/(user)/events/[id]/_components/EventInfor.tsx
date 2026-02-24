'use client';

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Ticket, Clock, Zap, Globe, Cpu, Music, Wind, MapPin, Calendar } from "lucide-react";
import { Event } from "@/types/event";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EventInforProps {
    event: Event;
}

export default function EventInfor({ event }: EventInforProps) {

    return (
        <section className="relative py-24 bg-[#050505] overflow-hidden">
            {/* Ambient Background - Brighter and more dynamic */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[60%] h-[60%] bg-primary/10 blur-[180px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-purple-600/10 blur-[160px] rounded-full" />
                <div className="absolute top-1/2 left-0 w-[40%] h-[40%] bg-blue-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

                    {/* LEFT: MAIN CONTENT (8 columns) */}
                    <div className="lg:col-span-8 space-y-24">

                        {/* Story & Description */}
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-wrap gap-3">
                                    {event.tags && event.tags.map((tag, idx) => (
                                        <div key={idx} className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{tag.tagName}</span>
                                        </div>
                                    ))}
                                </div>

                                <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase">
                                    Thông tin <span className="text-primary">sự kiện.</span>
                                </h2>

                                <div className="space-y-6">
                                    <p className="text-2xl md:text-3xl font-bold text-white leading-tight whitespace-pre-line">
                                        {event.description}
                                    </p>
                                    {event.subtitle && (
                                        <p className="text-lg text-white/70 leading-relaxed font-bold border-l-4 border-primary pl-6">
                                            {event.subtitle}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Premium Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Danh mục", value: event.category?.name || "Sự kiện", icon: Cpu, color: "text-blue-400" },
                                { label: "Độ tuổi", value: event.ageRestriction > 0 ? `${event.ageRestriction}+` : "Mọi lứa tuổi", icon: ShieldCheck, color: "text-emerald-400" },
                                { label: "Trạng thái", value: event.status === 1 ? "Đang diễn ra" : "Sắp tới", icon: Globe, color: "text-amber-400" },
                                { label: "Địa điểm", value: `${event.locations?.length || 0} điểm`, icon: MapPin, color: "text-rose-400" }
                            ].map((spec, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/[0.08] border border-white/20 p-8 rounded-[32px] flex flex-col gap-6 hover:bg-white/[0.12] transition-all hover:border-white/30"
                                >
                                    <spec.icon className={`w-8 h-8 ${spec.color}`} />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-black mb-1">{spec.label}</p>
                                        <p className="text-lg font-black text-white">{spec.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Timeline Protocol */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: Clock, label: "Giờ mở cửa", val: event.openTime || "TBA", desc: "Check-in & Đón khách" },
                                { icon: Clock, label: "Giờ đóng cửa", val: event.closedTime || "TBA", desc: "Kết thúc hoạt động" },
                                { icon: Calendar, label: "Ngày bắt đầu", val: event.startTime ? new Date(event.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "TBA", desc: "Khởi động sự kiện" },
                                { icon: Calendar, label: "Ngày kết thúc", val: event.endTime ? new Date(event.endTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "TBA", desc: "Kết thúc sự kiện" }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-10 rounded-[40px] bg-gradient-to-br from-white/[0.1] to-white/[0.02] border border-white/20 flex gap-8 items-center group hover:border-primary transition-all duration-500"
                                >
                                    <div className="shrink-0 w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/20 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-black">{item.label}</p>
                                        <h4 className="text-3xl font-black text-white tracking-tight">{item.val}</h4>
                                        <p className="text-xs text-white/60 font-bold">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: SIDEBAR */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-[#121212] border border-white/20 rounded-[48px] p-10 space-y-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="text-center space-y-8 relative z-10">
                                    <Link href={`/organizers/${event.organizer?.id}`} className="block group/org">
                                        <div className="relative w-32 h-32 mx-auto mb-8">
                                            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                                            <div className="relative w-full h-full rounded-[40px] overflow-hidden border-2 border-white/20 transition-all duration-500 group-hover/org:border-primary">
                                                <Image
                                                    src={event.organizer?.logoUrl || "https://i.pravatar.cc/150?u=org"}
                                                    alt="Organizer"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 leading-none text-center">Nhà tổ chức</p>
                                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase transition-colors text-center group-hover/org:text-primary">
                                                {event.organizer?.name || "Organizer"}
                                            </h3>
                                        </div>
                                    </Link>

                                    <p className="text-sm text-white/60 leading-relaxed font-bold px-6">
                                        "Mang đến những trải nghiệm không bao giờ quên cho cộng đồng."
                                    </p>
                                </div>

                                <div className="space-y-4 relative z-10 pt-4">
                                    <Button className="w-full h-16 rounded-3xl bg-primary text-black hover:bg-white transition-all duration-500 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/10">
                                        Theo dõi ngay
                                    </Button>
                                    <Button variant="outline" className="w-full h-16 rounded-3xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-500 font-black uppercase text-xs tracking-widest">
                                        Liên hệ
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="px-8 py-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-center gap-4 group hover:bg-white/[0.04] transition-all">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">
                                    Giao dịch an toàn 100%
                                </span>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </section>
    );
}
