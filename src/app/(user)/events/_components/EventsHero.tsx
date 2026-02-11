'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

export default function EventsHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div ref={containerRef} className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-background">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <motion.div
                style={{ y: y1 }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] pointer-events-none animate-pulse"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"
            />

            {/* Tăng space-y-8 lên space-y-12 để dãn cách các block lớn */}
            <div className="container mx-auto px-4 relative z-10 text-center space-y-12 md:space-y-16">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary font-semibold backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm tracking-wide uppercase">Khám phá thế giới giải trí</span>
                </motion.div>

                {/* Tăng space-y-4 lên space-y-8 để H1 và Paragraph không dính nhau */}
                <div className="space-y-8 md:space-y-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]"
                    >
                        KIẾN TẠO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-pink-500">
                            TRẢI NGHIỆM
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Didoo kết nối bạn với những sự kiện độc đáo, từ âm nhạc sôi động đến những workshop đầy cảm hứng.
                    </motion.p>
                </div>

                {/* Thêm pt-8 để đẩy khu vực Avatar xuống thấp hơn một chút */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="flex justify-center items-center gap-4 pt-8"
                >
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden shadow-sm">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                        <span className="text-foreground font-bold">5,000+</span> người đang tham gia
                    </p>
                </motion.div>
            </div>

            {/* Tăng mt-24 để tách biệt hoàn toàn phần chữ với dải Marquee */}
            {/* PHẦN MARQUEE ĐÃ SỬA: Nằm ngang và Cao hơn */}
            <div className="relative z-20 w-full bg-primary py-8 whitespace-nowrap overflow-hidden border-y border-white/10 rotate-0 mt-20 mb-12 shadow-2xl">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex gap-12 items-center"
                >
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-12 items-center">
                            <span className="text-2xl md:text-5xl font-black italic uppercase text-black">Live Events</span>
                            <Sparkles className="w-10 h-10 text-white fill-white" />

                            <span className="text-2xl md:text-5xl font-black italic uppercase text-white/50">Sold Out Soon</span>
                            <Sparkles className="w-10 h-10 text-black" />

                            <span className="text-2xl md:text-5xl font-black italic uppercase text-black outline-text">Unlimited Experience</span>
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
                .outline-text {
                    -webkit-text-stroke: 1px black;
                    color: transparent;
                }
            `}</style>
        </div>
    );
}