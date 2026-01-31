'use client';

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
    return (
        <section className="relative py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-12">

                    {/* LEFT: Image / Media */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative h-[500px] lg:h-[600px] bg-black"
                    >
                        {/* Placeholder Image - replace with specific asset if available, using a generic event image for now */}
                        <Image
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
                            alt="Event Experience"
                            fill
                            className="object-cover opacity-80"
                        />

                        {/* Overlay Graphics */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                <PlayCircle className="w-10 h-10 text-white fill-current" />
                            </div>
                        </div>

                        {/* Side Text vertical */}
                        <div className="absolute top-8 left-8 bottom-8 flex flex-col justify-between z-10 pointer-events-none">
                            <div className="text-white font-mono text-xs rotate-180 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                                MOMENTS
                            </div>
                        </div>
                    </motion.div>


                    {/* RIGHT: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 py-12 lg:py-0 lg:pl-12"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-black leading-[0.9] tracking-tighter mb-8 uppercase">
                            The Event For <br />
                            <span className="text-gray-400">Experienced.</span>
                        </h2>

                        <p className="text-lg text-gray-600 font-medium leading-relaxed mb-12 max-w-lg">
                            Didoo builds an ecosystem where design & business meets.
                            From workshops to masterclasses, we bring the best minds together.
                        </p>

                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-black uppercase tracking-widest">Covering Topics Such As</h4>
                            <div className="flex flex-wrap gap-3">
                                {['Psychology', 'Design', 'Strategy', 'Business', 'UX', 'Leadership', 'Management', 'AI', 'Innovation', 'Creative Operations', 'Tech'].map((tag) => (
                                    <span key={tag} className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 uppercase hover:bg-black hover:text-white transition-colors cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}