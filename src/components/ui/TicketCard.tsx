'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Event } from '@/types/event';
import { format, isValid } from 'date-fns';

const TicketCard = ({
    id,
    name,
    startTime,
    locations,
    thumbnailUrl,
    bannerUrl,
    category,
}: Event) => {
    // Subtle Magnetic effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const displayDate = startTime && isValid(new Date(startTime))
        ? format(new Date(startTime), "dd MMM, yyyy")
        : "TBA";

    return (
        <Link href={`/events/${id}`} className="block group">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative h-full transition-all duration-300 ease-out will-change-transform"
            >
                <div className="relative flex flex-col h-full bg-[#121212] rounded-[32px] overflow-hidden border border-white/10 group-hover:border-primary transition-all duration-500 shadow-2xl">

                    {/* Media Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                            src={thumbnailUrl || bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop'}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />

                        {/* Elegant Category Tag */}
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{category?.name || "Event"}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-white leading-[0.85] tracking-tighter group-hover:text-primary transition-colors uppercase italic-none">
                                {name}
                            </h3>

                            <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 text-white/60">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest leading-none">
                                        {displayDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-white/60">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest truncate leading-none">{locations?.[0]?.name || "Online/TBA"}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-1 leading-none">Pass Value</p>
                                    <p className="text-2xl font-black text-white tracking-widest uppercase">Free</p>
                                </div>

                                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/10 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle soft glow on hover */}
                <div className="absolute -inset-4 opacity-0 group-hover:opacity-10 bg-primary/40 blur-[40px] transition-opacity duration-700 -z-10" />
            </motion.div>
        </Link>
    );
};

export default TicketCard;
