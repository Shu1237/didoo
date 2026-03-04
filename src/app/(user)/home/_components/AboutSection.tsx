import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { Category } from "@/types/category";

interface AboutSectionProps {
    categories: Category[];
}

export function AboutSection({ categories }: AboutSectionProps) {
    return (
        <section className="relative py-32 bg-slate-900 text-white overflow-hidden mt-12">

            {/* Background Accent Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* LEFT: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-5/12"
                    >
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6 block">The Didoo Experience</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8 uppercase"
                        >
                            Where Ideas <br />
                            <span className="text-slate-500">Take Flight.</span>
                        </motion.h2>

                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-12">
                            We don&apos;t just list events; we curate industry-defining moments.
                            From underground workshops to global masterclasses, Didoo connects ambition with opportunity.
                        </p>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Popular Sectors</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(0, 6).map((cat, idx) => (
                                    <motion.span
                                        key={cat.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + (idx * 0.1) }}
                                        className="px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-primary transition-colors cursor-default"
                                    >
                                        {cat.name}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Image / Media */}
                    <div className="w-full lg:w-6/12 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                            className="relative h-[600px] md:h-[700px] w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl shadow-primary/10 border border-slate-800"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
                                alt="Event Experience"
                                fill
                                className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 hover:scale-105 hover:opacity-100"
                            />

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-24 h-24 rounded-full bg-primary/90 text-white backdrop-blur-md flex items-center justify-center cursor-pointer shadow-xl shadow-primary/30"
                                >
                                    <PlayCircle className="w-10 h-10 fill-current" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Floating Stat Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="absolute -bottom-8 -left-8 bg-white text-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-xs z-20"
                        >
                            <p className="font-black text-5xl mb-2">500+</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Curated Events Yearly</p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}