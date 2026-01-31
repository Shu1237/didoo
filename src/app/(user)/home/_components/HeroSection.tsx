'use client';

import { useState, useCallback } from 'react';
import { Event } from '@/utils/type';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CustomHeroCarousel from './CustomHeroCarousel';
import Image from 'next/image';

export default function HeroSection({ events: initialEvents }: { events: Event[] }) {
    // Quản lý danh sách sự kiện, phần tử đầu tiên (index 0) luôn là ảnh nền active
    const [eventList, setEventList] = useState(initialEvents);
    const activeEvent = eventList[0];

    // Hàm xử lý khi click chọn ảnh: 
    // Ảnh được chọn bung lên làm nền, ảnh nền cũ được đẩy xuống cuối danh sách.
    const handleSelectEvent = useCallback((selectedId: string) => {
        setEventList((prev) => {
            const selectedIndex = prev.findIndex(e => e.id === selectedId);
            if (selectedIndex === -1) return prev;

            const selectedItem = prev[selectedIndex];
            const remainingBefore = prev.slice(0, selectedIndex);
            const remainingAfter = prev.slice(selectedIndex + 1);

            // Thứ tự mới: [Ảnh mới chọn, ...Các ảnh phía sau, ...Các ảnh phía trước (bao gồm cả ảnh nền cũ)]
            return [selectedItem, ...remainingAfter, ...remainingBefore];
        });
    }, []);

    // Slider chỉ hiển thị từ phần tử thứ 2 trở đi
    const sliderEvents = eventList.slice(1);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">

            {/* BACKGROUND LAYER - Hiệu ứng bung từ dưới lên */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={activeEvent.id}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    >
                        {/* layoutId khớp với card để tạo hiệu ứng bung hình */}
                        <motion.div
                            layoutId={`img-${activeEvent.id}`}
                            className="absolute inset-0 w-full h-full"
                            transition={{ type: "spring", stiffness: 120, damping: 25 }}
                        >
                            <Image
                                src={activeEvent.image}
                                alt={activeEvent.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        {/* Overlay làm tối nền */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">

                    {/* LEFT CONTENT: Title & Buttons */}
                    <div className="lg:col-span-7 pb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeEvent.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-6xl lg:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl">
                                    {activeEvent.title}
                                </h1>
                                <div className="flex gap-4">
                                    <Button className="h-14 px-10 rounded-full bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors">
                                        Get Tickets
                                    </Button>
                                    <Button variant="outline" className="h-14 px-8 rounded-full text-white border-white/30 backdrop-blur-md uppercase font-bold hover:bg-white/10 transition-colors">
                                        More Info
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT CONTENT: Slider */}
                    <div className="lg:col-span-5 overflow-visible">
                        <CustomHeroCarousel
                            events={sliderEvents}
                            onSelect={handleSelectEvent}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}