'use client';

import { useGetEvents } from "@/hooks/useEvent";
import { useGetCategories } from "@/hooks/useCategory";
import SearchFilter from "../home/_components/SearchFilter";
import EventsHero from "./_components/EventsHero";
import EventsGrid from "./_components/EventsGrid";
import { motion } from "framer-motion";
import { TrendingUp, Music, CalendarDays, Zap, LayoutGrid, Sparkles, MapPin, Calendar, ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/loading";

export default function EventsPage() {
    const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents({
        pageSize: 20,
        isDescending: true,
    });
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();

    if (isEventsLoading || isCategoriesLoading) return <Loading />;

    const events = eventsResponse?.data.items || [];
    const allCategories = categoriesResponse?.data.items || [];

    // categorizing events for display
    const featuredEvent = events[0]; // The main highlight
    const trendingEvents = events.slice(1, 9);
    const upcomingEvents = [...events].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).slice(0, 4);
    const musicEvents = events.filter(e => e.category?.name === 'Music' || e.category?.name === 'Âm nhạc').slice(0, 4);

    const staticCategories = [
        { name: "Tất cả", icon: <LayoutGrid className="w-4 h-4" /> },
        { name: "Âm nhạc", icon: <Music className="w-4 h-4" /> },
        { name: "Workshop", icon: <Zap className="w-4 h-4" /> },
        { name: "Nghệ thuật", icon: <Sparkles className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#050505] pb-20 text-white overflow-x-hidden relative">
            {/* 1. Global Immersive Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Grainy Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 200, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] left-[20%] w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10">
                {/* Decorative Background Fillers (Floating Icons/Shapes) */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-[20%] left-[5%] text-primary/30"
                    >
                        <Ticket className="w-24 h-24" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -45, 0] }}
                        transition={{ duration: 12, repeat: Infinity }}
                        className="absolute top-[60%] right-[5%] text-purple-500/30"
                    >
                        <Sparkles className="w-32 h-32" />
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute bottom-[10%] left-[15%] text-cyan-500/20"
                    >
                        <Zap className="w-40 h-40" />
                    </motion.div>
                </div>

                <EventsHero />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-20 -mt-10 mb-20"
                >
                    <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                        <SearchFilter categories={allCategories} />
                    </div>
                </motion.div>

                {/* Featured Highlight Section */}
                {featuredEvent && (
                    <div className="max-w-[1920px] mx-auto px-6 md:px-12 mb-40 relative z-10">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-primary font-black italic tracking-widest uppercase text-sm">/ Spotlight /</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>

                        <Link href={`/events/${featuredEvent.id}`} className="group block relative perspective-2000">
                            <motion.div
                                whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="relative h-[500px] md:h-[800px] rounded-[60px] overflow-hidden border border-white/10 shadow-[0_0_100px_-20px_rgba(var(--primary),0.2)]"
                            >
                                <Image
                                    src={featuredEvent.thumbnailUrl || featuredEvent.bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop'}
                                    alt={featuredEvent.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                                {/* Interactive Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/10 mix-blend-overlay" />

                                <div className="absolute bottom-0 left-0 right-0 p-10 md:p-20 space-y-8">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            className="px-6 py-2 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl"
                                        >
                                            Featured Event
                                        </motion.div>
                                        <div className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.3em]">
                                            Live Show
                                        </div>
                                    </div>

                                    <div className="space-y-6 max-w-5xl">
                                        <h3 className="text-5xl md:text-9xl font-black leading-[0.85] uppercase italic tracking-tighter group-hover:text-primary transition-colors duration-500">
                                            {featuredEvent.name}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-10 text-gray-400 font-black uppercase tracking-widest text-xs md:text-sm">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <span className="text-white">{featuredEvent.startTime ? new Date(featuredEvent.startTime).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : "TBA"}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                <span className="text-white">{featuredEvent.locations?.[0]?.name || "Online/TBA"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="h-20 px-12 rounded-[30px] bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 font-black text-xl uppercase italic group/btn shadow-2xl">
                                        Secure Your Ticket
                                        <ArrowRight className="ml-4 w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                )}

                {/* Premium Floating Category Navigation */}
                <div className="sticky top-8 z-50 flex justify-center mb-32 px-4 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-[30px] border border-white/10 p-2 rounded-[40px] flex flex-wrap justify-center gap-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] pointer-events-auto">
                        {staticCategories.map((cat, idx) => (
                            <Button
                                key={idx}
                                variant="ghost"
                                className={`rounded-[32px] h-14 px-10 transition-all duration-500 text-xs font-black uppercase tracking-[0.2em] ${idx === 0 ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="mr-3">{cat.icon}</span>
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Event Grid Sections */}
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 space-y-32">
                    <EventsGrid
                        title="Xu hướng"
                        icon={<TrendingUp className="w-6 h-6" />}
                        description="Những sự kiện đang bùng nổ và nhận được nhiều sự quan tâm nhất."
                        eventData={trendingEvents}
                    />

                    <EventsGrid
                        title="Sắp diễn ra"
                        icon={<CalendarDays className="w-6 h-6" />}
                        description="Chuẩn bị sẵn sàng cho lịch trình sự kiện trong tuần tới của bạn."
                        eventData={upcomingEvents}
                    />

                    {musicEvents.length > 0 && (
                        <EventsGrid
                            title="Vũ trụ Âm nhạc"
                            icon={<Music className="w-6 h-6" />}
                            description="Hòa mình vào những giai điệu sôi động từ các nghệ sĩ hàng đầu."
                            eventData={musicEvents}
                        />
                    )}
                </div>

                {/* Newsletter / CTA Section (Optional but adds to UI) */}
                <div className="container mx-auto px-4 mt-40">
                    <div className="relative rounded-[50px] overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent border border-white/10 p-12 md:p-24 text-center space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                            ĐỪNG BỎ LỠ <br /> <span className="text-primary italic">BẤT KỲ SỰ KIỆN NÀO</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-medium text-lg">
                            Đăng ký nhận bản tin để cập nhật những sự kiện mới nhất và ưu đãi độc quyền dành riêng cho bạn.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Email của bạn..."
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-medium focus:outline-none focus:border-primary transition-colors"
                            />
                            <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/80 text-white font-bold whitespace-nowrap">
                                Đăng ký
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
