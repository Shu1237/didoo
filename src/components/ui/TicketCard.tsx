'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Event } from '../../types/base';
import { format } from 'date-fns';

const TicketCard = ({
    id,
    title,
    date,
    location,
    price,
    image,
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
                <div className="relative flex flex-col h-full bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">

                    {/* Media Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

                        {/* Elegant Category Tag */}
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-bold text-white/90 uppercase tracking-[0.2em]">{category}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white leading-[0.9] tracking-tighter group-hover:text-primary transition-colors">
                                {title.split(' ').map((word, i) => (
                                    <span key={i} className={i === 1 ? "text-primary block" : "block"}>
                                        {word}
                                    </span>
                                ))}
                            </h3>

                            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3 text-white/40">
                                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                        {format(new Date(date), "dd MMM, yyyy")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-white/40">
                                    <MapPin className="w-3.5 h-3.5 text-primary/60" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest truncate leading-none">{location}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div>
                                    <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Pass Value</p>
                                    <p className="text-xl font-black text-white tracking-widest">{price}</p>
                                </div>

                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                    <ArrowUpRight className="w-5 h-5" />
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
