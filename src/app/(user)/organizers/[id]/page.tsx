'use client';

import { useGetOrganizer } from "@/hooks/useOrganizer";
import { useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { use } from "react";
import Image from "next/image";
import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import TicketCard from "@/components/ui/TicketCard";
import { motion } from "framer-motion";

export default function OrganizerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data: organizerResponse, isLoading: isOrganizerLoading } = useGetOrganizer(id);
    const organizer = organizerResponse?.data;

    const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents({
        organizerId: id,
        pageSize: 12,
    });
    const events = eventsResponse?.data.items || [];

    if (isOrganizerLoading) return <Loading />;

    if (!organizer) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500 bg-[#050505]">
                <p>Nhà tổ chức không tồn tại</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Banner Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={organizer.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'}
                        alt={organizer.name}
                        fill
                        className="object-cover opacity-40 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 relative w-40 h-40 mx-auto"
                    >
                        <div className="absolute inset-0 bg-primary/30 rounded-[40px] blur-2xl animate-pulse" />
                        <div className="relative w-full h-full rounded-[40px] overflow-hidden border-4 border-white/20">
                            <Image
                                src={organizer.logoUrl || 'https://i.pravatar.cc/150?u=org'}
                                alt={organizer.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4"
                    >
                        {organizer.name}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest text-white/60"
                    >
                        {organizer.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {organizer.address}
                            </div>
                        )}
                        {organizer.websiteUrl && (
                            <a href={organizer.websiteUrl} target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                                <Globe className="w-4 h-4 text-primary" />
                                Website
                            </a>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Stats & Info Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* About & Socials */}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-black uppercase tracking-tighter">Về chúng tôi.</h2>
                                <div className="p-8 rounded-[32px] bg-white/[0.05] border border-white/10">
                                    <p className="text-lg text-white/70 leading-relaxed font-semibold">
                                        {organizer.description || "Chúng tôi là nhà tổ chức sự kiện chuyên nghiệp, mang đến những trải nghiệm văn hóa và nghệ thuật đẳng cấp cho cộng đồng."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Kết nối với chúng tôi</h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { icon: Facebook, url: organizer.facebookUrl },
                                        { icon: Instagram, url: organizer.instagramUrl },
                                        { icon: Twitter, url: organizer.tiktokUrl },
                                        { icon: Mail, url: organizer.email ? `mailto:${organizer.email}` : null },
                                        { icon: Phone, url: organizer.phone ? `tel:${organizer.phone}` : null }
                                    ].filter(s => s.url).map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.url!}
                                            target="_blank"
                                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-black hover:border-primary transition-all duration-500 shadow-xl"
                                        >
                                            <social.icon className="w-6 h-6" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Events Grid */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="flex items-center justify-between border-b border-white/10 pb-8">
                                <h2 className="text-4xl font-black uppercase tracking-tighter">Sự kiện đã tổ chức.</h2>
                                <span className="text-primary font-black text-xl">{events.length}</span>
                            </div>

                            {isEventsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-[4/5] rounded-[32px] bg-white/5 animate-pulse" />
                                    ))}
                                </div>
                            ) : events.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {events.map((event) => (
                                        <TicketCard key={event.id} {...event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 rounded-[48px] bg-white/[0.03] border border-white/10 text-center">
                                    <p className="text-white/40 text-xl font-black uppercase tracking-widest">Chưa có sự kiện nào được tổ chức</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
