'use client';

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function EventsHero() {
    return (
        <div className="relative pt-32 pb-20 md:pb-32 overflow-hidden bg-background">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium mb-4 backdrop-blur-sm border border-secondary/20"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Khám phá thế giới giải trí</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]"
                >
                    Tìm kiếm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-cyan-500">Sự Kiện</span>
                    <br /> Đẳng Cấp
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    Trải nghiệm những khoảnh khắc đáng nhớ với hàng ngàn sự kiện âm nhạc, nghệ thuật và workshops đang diễn ra quanh bạn.
                </motion.p>
            </div>
        </div>
    );
}
